import React, { useState, useEffect, useContext } from "react";
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from "recharts";
import { Styled, StyleMenu } from "./style";
import { Layout, Menu, Modal, Button } from "antd";
import {
  ArrowsAltOutlined,
  ClockCircleOutlined,
  CommentOutlined,
  UndoOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined
} from "@ant-design/icons";
import { Slide } from "../Slide";
import { useParams, useLocation } from "react-router-dom";
import { GetOnePresentation, getSessionId, toggleStatusPresentation } from "../API";
import PresentationContext from "../../../utils/PresentationContext";
import { toast } from "react-toastify";
import { SocketContext } from "../../../components/Socket/socket-client";
import UserContext from "../../../utils/UserContext";
import { printMessage } from "../../../utils/method";

var presentationName = "presentation";
export const ShowPresentation = () => {
  const { Content } = Layout;
  const { presentationId } = useParams();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sessionId, setSessionId] = useState("");
  const [presentationContext, setPresentationContext] = useContext(PresentationContext);
  const [currentUser, setCurrentUser] = useContext(UserContext);
  const socket = useContext(SocketContext);
  const [dataChart, setDataChart] = useState({});

  const items = [
    {
      label: "Full screen",
      key: "Full screen",
      icon: <ArrowsAltOutlined style={{ transform: "rotate(90deg)" }} />
    },
    {
      label: "Reset results",
      key: "Reset results",
      icon: <UndoOutlined style={{ transform: "rotate(90deg)" }} />
    },
    {
      label: "Set alarm",
      key: "Set alarm",
      icon: <ClockCircleOutlined style={{ transform: "rotate(90deg)" }} />
    },
    {
      label: "Disable comments",
      key: "Disable comments",
      icon: <CommentOutlined style={{ transform: "rotate(90deg)" }} />
    },
    {
      label: "Previous slide",
      key: "Previous slide",
      icon: (
        <ArrowLeftOutlined
          style={{ transform: "rotate(90deg)" }}
          onClick={() => goToPreviousSlide()}
        />
      )
    },
    {
      label: "Next Slide",
      key: "Next Slide",
      icon: (
        <ArrowRightOutlined
          style={{ transform: "rotate(90deg)" }}
          onClick={() => goToNextSlide()}
        />
      )
    }
  ];
  useEffect(() => {
    document.title = `${presentationName} - Realtime quiz-based learning`;
    toggleStatusPresentation(presentationId, 3)
      .then((values) => {
        console.log("values ", values);
        if (values && values.status == 200) {
          // Gỉa sử delete thành công
          toast.success(values.message, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            theme: "light"
          });
        } else {
          toast.error(values.message, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            theme: "light"
          });
        }
      })
      .catch((err) => {
        const values = err.response.data;
        toast.error(values, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          theme: "light"
        });
      });
    socket.on("new-session-for-game", (data) => {
      console.log("new sesssion for game ", data);
    });
    socket.on("slide-changed", (values) => {
      console.log("slide changed fe", values);
      // printMessage(values.status, values.message);
    });
    return () => {
      socket.off("new-session-for-game");
      socket.off("slide-changed");
    };
  }, [socket]);
  useEffect(() => {
    const groupId = null;
    if (currentUser != undefined) {
      console.log("send socket ", presentationId, groupId, currentUser);
      socket.emit("init-game", { id: presentationId, groupId, user: currentUser });
      getSessionId(presentationId).then((data) => {
        const sessionId = data.data.data.session;
        setSessionId(sessionId);
      });
    }
  }, [currentUser]);
  useEffect(() => {
    if (currentSlide != 0) {
      const currentArr = presentationContext["slideList"][currentSlide]["options"];
      const newArr = currentArr.map((value, index) => {
        return {
          answer: value,
          total: 0
        };
      });
      setDataChart(newArr);
    }
  }, [currentSlide]);

  const goToPreviousSlide = () => {
    setCurrentSlide(currentSlide - 1);
  };
  const goToNextSlide = () => {
    ư;
  };
  const goBackToEdit = () => {
    let currentUrl = window.location.href;
    var to = currentUrl.lastIndexOf("/");
    currentUrl = currentUrl.substring(0, to) + "/" + "edit";
    window.location.href = currentUrl;
  };
  const stopPresentation = () => {
    stopPresentation(presentationId, 0).then((values) => {
      console.log("values stop presentation ", values);
    });
  };
  //id session, idpresentatioonId, user
  const startGame = () => {
    socket.emit("next-slide", { id: sessionId, presentationId, user: currentUser });
  };
  return (
    <Styled>
      <Layout style={{ height: "100vh" }}>
        <Content style={{ margin: "1rem auto", padding: "3rem 3.2rem", width: "100%" }}>
          <StyleMenu theme="dark" mode="inline" items={items} inlineCollapsed={true} />
          <div className="on-row">
            <ArrowLeftOutlined
              style={{ fontSize: "2.4rem", cursor: "pointer" }}
              onClick={() => goBackToEdit()}
            />

            <div className="codePublic">
              Go to{" "}
              <a className="url_code" href={`/presentations/public`}>
                this link{" "}
              </a>
              and use code {presentationId}
            </div>
            <Button
              type="primary"
              onClick={() => startGame()}
              disabled={currentSlide == 0 ? false : true}>
              Start game
            </Button>
            <Button type="primary" danger onClick={() => stopPresentation()}>
              Stop presentation
            </Button>
          </div>
          <div className="show_presentation-container">
            <Slide dataChart={dataChart} />
          </div>
        </Content>
      </Layout>
    </Styled>
  );
};
