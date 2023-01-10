import React, { useEffect, useState, useContext } from "react";
import { Layout, Radio, Space, Input, Button } from "antd";
import { toast } from "react-toastify";
import Styled, { StyledButton } from "../style";
import { GetCurrentSlide, GetSlideByPresentationAndIndex } from "../api/Session.Api";
import { SocketContext } from "../../../components/Socket/socket-client";
import { SlideType } from "../../../actions/constants";

import LoadingScreen from "react-loading-screen";
import { StyleContainer, StyledNavLink } from "./style";
import { useNavigate, useParams } from "react-router-dom";
import { PresentForViewer } from "./component";
import UserContext from "../../../utils/UserContext";
import { fetchUsers } from "../../../utils/api";
import { getSessionId } from "../API";

export const GroupPresentation = (props) => {
  const { groupId, presentationId } = useParams();
  const [user, setUser] = useState({});
  const [sessionId, setSessionId] = useState("");
  const [currentSlideIndex, setCurrentSlideIndex] = useState(1);
  const [currentSlide, setCurrentSlide] = useState(null);
  const [isFinalSlide, setIsFinalSlide] = useState(false);
  const socket = useContext(SocketContext);
  const navigate = useNavigate();

  if (!user) {
    navigate("/signin");
  }

  useEffect(() => {
    document.getElementById("main").style.backgroundColor = "rgb(56, 18, 114)";
    return () => {
      document.getElementById("main").style.backgroundColor = "white";
    };
  });
  useEffect(() => {
    const SetUser = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        return null;
      }
      const response = await fetchUsers(accessToken);
      if (response && response.user != null) {
        setUser(response.user);
      }
    };
    getSessionId(presentationId, groupId)
      .then((getSessionIdResponse) => {
        console.log("getSessionId response", getSessionIdResponse);
        if (getSessionIdResponse.status != 200) {
          throw new Error("Fail to get session");
        }
        setSessionId(getSessionIdResponse.data.data.session);
        var request = {
          sessionId: getSessionIdResponse.data.data.session,
          presentationId: presentationId
        };
        GetCurrentSlide(request)
          .then((GetCurrentSlideResponse) => {
            setCurrentSlideIndex(GetCurrentSlideResponse.data.data.current_slide);
          })
          .catch((error) => {
            console.log("GetCurrentSlide error:", error.message);
            throw new Error("cant get current slide");
          });
      })
      .catch((error) => {
        console.log("getSessionId error:", error.message);
      });

    SetUser();
  }, []);
  useEffect(() => {
    socket.emit("init-game", {
      id: presentationId,
      groupId: groupId,
      user: user
    });
    console.log("init game");
  }, [sessionId]);
  useEffect(() => {
    socket.on("connect", () => {});
    socket.on("slide-changed", (response) => {
      console.log("response ", response);
      if (response.status == 200) {
        setCurrentSlideIndex(response.data.current_slide);
      }
    });
    return () => {
      socket.off("connect");
      socket.off("slide-changed");
      socket.off("get-answer-from-player");
    };
  }, [socket]);
  useEffect(() => {
    if (
      presentationId == "" ||
      presentationId.trim() == "" ||
      Number.isNaN(currentSlideIndex) ||
      currentSlideIndex < 1
    ) {
      return;
    } else {
      console.log("get slide by current");
      var request = {
        slideIndex: currentSlideIndex,
        presentationId: presentationId
      };
      GetSlideByPresentationAndIndex(request)
        .then((response) => {
          if (response.success == false) {
            console.log("failed:", response.message);
            return;
          }
          setIsFinalSlide(response.isFinalSlide);
          setCurrentSlide(response.slide);
        })
        .catch((error) => {
          console.log("error:", error);
        });
    }
  }, [currentSlideIndex]);

  return (
    <LoadingScreen
      loading={currentSlideIndex < 1}
      bgColor="#fffff"
      spinnerColor="#fff"
      textColor="#fff"
      text="Please waiting for the host to start">
      <Styled>
        <Layout>
          <PresentForViewer
            slide={currentSlide}
            socket={socket}
            presentationId={presentationId}
            username={user.username || ""}
            isFinalSlide={isFinalSlide}
            sessionId={sessionId}
          />
        </Layout>
      </Styled>
    </LoadingScreen>
  );
};
