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
import {
  getOneDetailPresentationAPI,
  GetOnePresentation,
  getSessionId,
  toggleStatusPresentation
} from "../API";
import { toast } from "react-toastify";
import { SocketContext } from "../../../components/Socket/socket-client";
import UserContext from "../../../utils/UserContext";
import { printMessage } from "../../../utils/method";
import { fetchUsers } from "../../../utils/api";

var presentationName = "presentation";
export const ShowPresentation = () => {
  const { Content } = Layout;
  const { presentationId, groupId } = useParams();
  const [currentSlide, setCurrentSlide] = useState(-1);
  const [sessionId, setSessionId] = useState("");
  const [user, setUser] = useState({});
  const socket = useContext(SocketContext);
  const [dataChart, setDataChart] = useState({});
  const [currentPresentation, setCurrentPresentation] = useState({});
  const navigate = useNavigate();

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
    const getInfo = async () => {
      const GetOnePresentationData = await GetOnePresentation(presentationId);
      if (GetOnePresentationData.status == 200) {
        setCurrentPresentation(GetOnePresentationData.data.data);
        const presentationValue = await getOneDetailPresentationAPI(presentationId);
        if (presentationValue.data.status != 2) {
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
                socket.emit("init-game", { id: presentationId, groupId, user: user });
                getSessionId(presentationId).then((data) => {
                  console.log("getSessionId return ", data);
                  const sessionId = data.data.data.session;
                  setSessionId(sessionId);
                });
              } else {
                printMessage(400, values.message);
              }
            })
            .catch((err) => {
              const values = err.response.data;
              printMessage(400, values);
            });
        } else {
          SetUser().then((response) => {
            console.log("showPresentation status: 2", presentationId, groupId, response);
            console.log("send init-game");
            socket.emit("init-game", { id: presentationId, groupId, user: response });
            getSessionId(presentationId, groupId).then((data) => {
              const sessionId = data.data.data.session;
              setSessionId(sessionId);
            });
          });
        }
      }
    };

    getInfo();

    // GetOnePresentation(presentationId)
    //   .then((values) => {
    //     setCurrentPresentation(values.data.data);
    //     toggleStatusPresentation(presentationId, 3)
    //       .then((values) => {
    //         if (values && values.status == 200) {
    //           // Gỉa sử delete thành công
    //           toast.success(values.message, {
    //             position: "top-right",
    //             autoClose: 2000,
    //             hideProgressBar: false,
    //             closeOnClick: true,
    //             pauseOnHover: false,
    //             draggable: true,
    //             theme: "light"
    //           });
    //           socket.emit("init-game", { id: presentationId, groupId, user: currentUser });
    //           getSessionId(presentationId).then((data) => {
    //             const sessionId = data.data.data.session;
    //             setSessionId(sessionId);
    //           });
    //         } else {
    //           toast.error(values.message, {
    //             position: "top-right",
    //             autoClose: 2000,
    //             hideProgressBar: false,
    //             closeOnClick: true,
    //             pauseOnHover: false,
    //             draggable: true,
    //             theme: "light"
    //           });
    //         }
    //       })
    //       .catch((err) => {
    //         const values = err.response.data;
    //         toast.error(values, {
    //           position: "top-right",
    //           autoClose: 2000,
    //           hideProgressBar: false,
    //           closeOnClick: true,
    //           pauseOnHover: false,
    //           draggable: true,
    //           theme: "light"
    //         });
    //       });
    //   })
    //   .catch((err) => {
    //     console.log("err ", err);
    //   });
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
      const currentArr = currentPresentation["slides"][currentSlide]["options"];
      const newDataChart = currentArr.map((value, index) => {
        return {
          answer: value.content,
          total: 0
        };
      });
      setDataChart(newDataChart);
    }
  }, [currentSlide]);
  const SetUser = async () => {
    console.log("vao SetUser");
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      return null;
    }
    const response = await fetchUsers(accessToken);
    console.log("response user ", response);
    if (response && response.user != null) {
      setUser(response.user);
    }
    return response.user;
  };
  const goToPreviousSlide = () => {
    setCurrentSlide(currentSlide - 1);
  };
  const goToNextSlide = () => {
    socket.emit("next-slide", { id: sessionId, presentationId, user: user });
  };

  const stopPresentation = async () => {
    try {
      const toggleStatusResponse = await toggleStatusPresentation(presentationId, 0, groupId);
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
        navigate(`/presentations`);
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
    console.log("startGame ", sessionId, presentationId, user);
    socket.emit("next-slide", { id: sessionId, presentationId, user: user });
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
