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
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { GetOnePresentation, getSessionId, toggleStatusPresentation } from "../API";
import { toast } from "react-toastify";
import { SocketContext } from "../../../components/Socket/socket-client";
import UserContext from "../../../utils/UserContext";
import { printMessage } from "../../../utils/method";

var presentationName = "presentation";
export const ShowPresentation = () => {
  const { Content } = Layout;
  const { presentationId } = useParams();
  const [currentSlide, setCurrentSlide] = useState(-1);
  const [sessionId, setSessionId] = useState("");
  const [currentUser, setCurrentUser] = useContext(UserContext);
  const socket = useContext(SocketContext);
  const [dataChart, setDataChart] = useState({});
  const [currentPresentation, setCurrentPresentation] = useState({});
  const navigate = useNavigate();
  const groupId = null;

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
    //list all presentations
    GetOnePresentation(presentationId)
      .then((values) => {
        console.log("values ", values);
        setCurrentPresentation(values.data.data);
        toggleStatusPresentation(presentationId, 3)
          .then((values) => {
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
              socket.emit("init-game", { id: presentationId, groupId, user: currentUser });
              getSessionId(presentationId).then((data) => {
                const sessionId = data.data.data.session;
                setSessionId(sessionId);
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
      })
      .catch((err) => {
        console.log("err ", err);
      });
    //change status presentation
  }, []);
  useEffect(() => {
    socket.on("new-session-for-game", (data) => {
      console.log("new sesssion for game ", data);
    });
    socket.on("slide-changed", (values) => {
      console.log("slide changed fe", values);
      if (values.status !== 200) {
        printMessage(values.status, values.message);
      } else {
        printMessage(values.status, values.message);
        const slide = values.data.currentSlide;
        console.log("new session current slide ", slide);
        setCurrentSlide(slide - 1);
      }
    });
    socket.on("get-answer-from-player", (values) => {
      if (values.status !== 200) {
        printMessage(values.status, values.message);
      } else {
        printMessage(values.status, values.message);
        const dataAnswer = values.data;
        const total = dataAnswer.total;
        const newDataChart = total.map((value, index) => {
          return {
            answer: value.content,
            total: value.total
          };
        });
        console.log("newDataChart ", newDataChart);
        setDataChart(newDataChart);
      }
    });
    return () => {
      socket.off("new-session-for-game");
      socket.off("slide-changed");
      socket.off("get-answer-from-player");
    };
  }, [socket]);
  useEffect(() => {
    if (currentSlide != -1) {
      console.log("currentPresentation ", currentPresentation);
      const currentArr = currentPresentation["slides"][currentSlide]["options"];
      const newDataChart = currentArr.map((value, index) => {
        return {
          answer: value.content,
          total: 0
        };
      });
      console.log("newDataChart ", newDataChart);
      setDataChart(newDataChart);
    }
  }, [currentSlide]);

  const goToPreviousSlide = () => {
    setCurrentSlide(currentSlide - 1);
  };
  const goToNextSlide = () => {
    socket.emit("next-slide", { id: sessionId, presentationId, user: currentUser });
  };

  const stopPresentation = async () => {
    try {
      const toggleStatusResponse = await toggleStatusPresentation(presentationId, 0);
      console.log("toggleStatusResponse", toggleStatusResponse);
      if (toggleStatusResponse && toggleStatusResponse.status == 200) {
        // Gỉa sử delete thành công
        toast.success(toggleStatusPresentation.message, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          theme: "light"
        });
        navigate(`/presentations/${presentationId}/edit`);
      }
    } catch (err) {
      console.log("error", err);
      toast.error(err.message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "light"
      });
    }
  };
  //id session, idpresentatioonId, user
  const startGame = () => {
    console.log("Start game ");
    socket.emit("next-slide", { id: sessionId, presentationId, user: currentUser });
  };
  const showResult = () => {};
  return (
    <Styled>
      <Layout style={{ height: "100vh" }}>
        <Content style={{ margin: "1rem auto", padding: "3rem 3.2rem", width: "100%" }}>
          <StyleMenu theme="dark" mode="inline" items={items} inlineCollapsed={true} />
          <div className="on-row">
            <ArrowLeftOutlined
              style={{ fontSize: "2.4rem", cursor: "pointer" }}
              onClick={() => stopPresentation()}
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
              disabled={currentSlide == -1 ? false : true}>
              Start game
            </Button>
            <Button type="primary" onClick={() => showResult()}>
              Show result
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
