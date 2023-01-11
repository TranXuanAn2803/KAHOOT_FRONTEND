import React, { useState, useEffect, useContext } from "react";
import { Styled, StyleMenu } from "./style";
import { Layout, Button } from "antd";
import {
  ArrowsAltOutlined,
  ClockCircleOutlined,
  CommentOutlined,
  UndoOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined
} from "@ant-design/icons";
import { MultipleChoiceSlide } from "../Slide";
import { useParams, useNavigate } from "react-router-dom";
import {
  getOneDetailPresentationAPI,
  GetOnePresentation,
  getSessionId,
  toggleStatusPresentation
} from "../API";
import { toast } from "react-toastify";
import { SocketContext } from "../../../components/Socket/socket-client";
import { printMessage } from "../../../utils/method";
import { fetchUsers } from "../../../utils/api";
import { Content } from "antd/es/layout/layout";
import { GetCurrentSlide } from "../api/Session.Api";

export const ShowPresentation = () => {
  const { Content } = Layout;
  const { presentationId, groupId } = useParams();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(-1);
  const [sessionId, setSessionId] = useState("");
  // const [currentUser, setCurrentUser] = useContext(UserContext);
  // const [currentUserAPI, setCurrentUserAPI] = useState({});
  const [currentUser, setCurrentUser] = useState({});
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
    //list all presentations
    const getInfo = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        toast.error("You need to login first", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          theme: "light"
        });
        return;
      }
      const response = await fetchUsers(accessToken);
      if (!response || response.user == null) {
        toast.error("You need to login first", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          theme: "light"
        });
        return;
      }
      var user = response.user;
      console.log("user:", user);
      setCurrentUser(user);
      const GetOnePresentationData = await GetOnePresentation(presentationId);
      // const user = await SetUser();
      // console.log("getInfo user ", user);
      if (GetOnePresentationData.status == 200) {
        setCurrentPresentation(GetOnePresentationData.data.data);
        const presentationValue = await getOneDetailPresentationAPI(presentationId);
        if (groupId && presentationValue.data.status != PresentationMode.GroupPresentation) {
          toggleStatusPresentation(presentationId, 2)
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
                getSessionId(presentationId)
                  .then((data) => {
                    console.log("getSessionId return ", data);
                    const sessionId = data.data.data.session;
                    setSessionId(sessionId);
                    console.log("sessionId", sessionId);
                  })
                  .catch((error) => {
                    console.log("GetCurrentSlide error.", error.message);
                    toast.error("Cannot access presenting feature now. Please try again.", {
                      position: "top-right",
                      autoClose: 2000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: false,
                      draggable: true,
                      theme: "light"
                    });
                  });
              } else {
                printMessage(400, values.message);
              }
            })
            .catch((err) => {
              const values = err.response.data;
              printMessage(400, values);
              navigate("/groups");
              return;
            });
        }
        if (!groupId && presentationValue.data.status != PresentationMode.PublicPresentation) {
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
              navigate("/presentations");
            });
          return;
        }
        let currentSession = presentationValue.data.current_session;
        console.log("currentSession = ", currentSession);
        if (currentSession && currentSession.trim() != "") {
          let currentIndex = presentationValue.data.current_slide;
          console.log("currentSlideIndex = ", currentIndex);
          setSessionId(sessionId);
          setCurrentSlideIndex(currentIndex - 1);
        } else {
          console.log("showPresentation status: ", presentationId, groupId, currentUser);
          socket.emit("init-game", { id: presentationId, groupId, user: currentUser });
          getSessionId(presentationId, groupId)
            .then((data) => {
              const sessionId = data.data.data.session;
              console.log("sessionId = ", sessionId);
              setSessionId(sessionId);
              var request = {
                sessionId: sessionId,
                presentationId: presentationId
              };
              GetCurrentSlide(request)
                .then((response) => {
                  console.log("currentSlideIndex = ", response.data.data.current_slide);
                  setCurrentSlideIndex(response.data.data.current_slide - 1);
                })
                .catch((error) => {
                  throw error;
                });
            })
            .catch((error) => {
              console.log("GetCurrentSlide error.", error.message);
              toast.error("Cannot access presenting feature now. Please try again.", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                theme: "light"
              });
            });
        }
      }
    };
    getInfo();
  }, []);
  useEffect(() => {
    document.title = `${currentPresentation.name} - Realtime quiz-based learning `;
  }, [currentPresentation]);
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
        setCurrentSlideIndex(slide - 1);
      }
    });
    socket.on("get-answer-from-player", (values) => {
      console.log("values", values);
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
    if (currentSlideIndex > -1) {
      var slide = currentPresentation["slides"][currentSlideIndex];
      if (!slide) return;
      switch (slide.slide_type) {
        case "MULTIPLE_CHOICE":
          const currentArr = currentPresentation["slides"][currentSlideIndex]["options"];
          const newDataChart = currentArr.map((value, index) => {
            return {
              answer: value.content,
              total: 0
            };
          });
          setDataChart(newDataChart);
          break;
        case "HEADING":
          break;
        case "PARAGRAPH":
          break;
        default:
          break;
      }
    }
  }, [currentSlideIndex]);
  // const SetUser = async () => {
  //   console.log("vao SetUser");
  //   const accessToken = localStorage.getItem("accessToken");
  //   if (!accessToken) {
  //     return null;
  //   }
  //   const response = await fetchUsers(accessToken);
  //   if (response && response.user != null) {
  //     setUserAPI(response.user);
  //   }
  //   return response.user;
  // };
  const goToPreviousSlide = () => {
    setCurrentSlideIndex(currentSlideIndex - 1);
  };
  const goToNextSlide = () => {
    console.log("current slide ", currentSlideIndex);
    if (currentSlideIndex > currentPresentation.length - 1) {
      toast.warn("You are in the final slide.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "light"
      });
      return;
    }
    console.log("goToNextSlide user", currentUser);
    socket.emit("next-slide", { id: sessionId, presentationId, user: currentUser });
    setCurrentSlideIndex(currentSlideIndex + 1);
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
  const startGame = () => {
    if (currentSlideIndex > -1) {
      return;
    }
    socket.emit("next-slide", { id: sessionId, presentationId, user: currentUser });
    setCurrentSlideIndex(currentSlideIndex + 1);
  };
  const showResult = () => {};
  return (
    <Styled>
      <Layout style={{ height: "100vh" }}>
        <Content style={{ margin: "1rem auto", padding: "3rem 3.2rem", width: "100%" }}>
          <StyleMenu theme="dark" mode="inline" items={items} inlineCollapsed={true} />
          <div className="on-row">
            <div className="d-flex align-items-center" style={{ gap: "2rem" }}>
              <ArrowLeftOutlined
                style={{ fontSize: "2.4rem", cursor: "pointer" }}
                onClick={() => stopPresentation()}
              />
              {groupId ? (
                <></>
              ) : (
                <div className="codePublic">
                  Go to{" "}
                  <a className="url_code" href={`/presentations/public`}>
                    this link{" "}
                  </a>
                  and use code <b>{presentationId}</b>
                </div>
              )}
            </div>
            <div className="btn-group d-flex align-items-center" style={{ gap: "2rem" }}>
              <Button
                type="primary"
                onClick={() => startGame()}
                disabled={currentSlideIndex == -1 ? false : true}>
                Start game
              </Button>
              <Button type="primary" onClick={() => showResult()}>
                Show result
              </Button>
              <Button type="primary" danger onClick={() => stopPresentation()}>
                Stop presentation
              </Button>
            </div>
          </div>
          <div className="show_presentation-container">
            <Layout
              style={{
                marginTop: "1.5rem",
                position: "relative",
                boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                maxHeight: "50rem"
              }}>
              {currentSlideIndex == -1 ||
              !currentPresentation ||
              !currentPresentation["slides"][currentSlideIndex] ? (
                <Content style={{ paddingBottom: "56.25%", backgroundColor: "white" }}></Content>
              ) : (
                <PresentationForHost
                  slide={currentPresentation["slides"][currentSlideIndex]}
                  dataChart={dataChart}
                />
              )}
            </Layout>
          </div>
        </Content>
      </Layout>
    </Styled>
  );
};

const PresentationForHost = (props) => {
  const { slide, ...others } = props;
  if (!slide) {
    return <></>;
  }
  switch (slide.slide_type) {
    case "MULTIPLE_CHOICE":
      return (
        <MultipleChoiceSlide
          question={slide.question}
          dataChart={others.dataChart}
          chartWidth={800}
          charHeight={400}
        />
      );
    case "HEADING":
      return <HeadingPresentation slide={slide} />;
    case "PARAGRAPH":
      return <ParagraphPresentation slide={slide} />;
    default:
      break;
  }
};

const HeadingPresentation = (props) => {
  const { slide } = props;
  console.log("Heading", slide);
  return (
    <Layout>
      <Content style={{ paddingBottom: "56.25%", backgroundColor: "white" }}>
        <div
          className="d-flex flex-column align-items-center justify-content-center"
          style={{
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%"
          }}>
          <div style={{ fontSize: "10rem" }}>{slide.heading}</div>
          <div style={{ fontSize: "1.6rem" }}>{slide.sub_heading}</div>
        </div>
      </Content>
    </Layout>
  );
};

const ParagraphPresentation = (props) => {
  const { slide } = props;
  return (
    <Layout>
      <Content style={{ paddingBottom: "56.25%", backgroundColor: "white" }}>
        <div
          className="d-flex flex-column align-items-center justify-content-center"
          style={{
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%"
          }}>
          <div style={{ fontSize: "10rem" }}>{slide.heading}</div>
          <div style={{ fontSize: "1.6rem" }}>{slide.paragraph}</div>
        </div>
      </Content>
    </Layout>
  );
};

const PresentationMode = {
  PublicPresentation: 3,
  GroupPresentation: 2
};
