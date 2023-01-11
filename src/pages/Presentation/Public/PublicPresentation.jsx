import React, { useEffect, useState, useContext } from "react";
import { Layout, Radio, Space, Input, Button, Popover } from "antd";
import { toast } from "react-toastify";
const { Header, Footer, Sider, Content } = Layout;
import Styled, { StyledButton } from "../style";
import PresentationContext from "../../../utils/PresentationContext";
import { Sector } from "recharts";
import { getSessionId } from "../API";
import { printMessage } from "../../../utils/method";
import { Slider } from "@material-ui/core";
import { GetCurrentSlide, GetSlideByPresentationAndIndex } from "../api/Session.Api";
import { SocketContext } from "../../../components/Socket/socket-client";
import { SlideType } from "../../../actions/constants";

import LoadingScreen from "react-loading-screen";
import { StyledChatScreen, StyledNavLink, StyledQuestionScreen } from "./style";
import { useNavigate, useParams } from "react-router-dom";
import ScrollToBottom from "react-scroll-to-bottom";
import { getMessageAPI, getQuestionAPI } from "../api/Presentation.Api";
import {
  LikeOutlined,
  StarOutlined,
  LikeFilled,
  StarFilled,
  WechatOutlined,
  MessageOutlined,
  MessageFilled,
  QuestionCircleFilled
} from "@ant-design/icons";
import { fetchUsers } from "../../../utils/api";
import Icon from "@ant-design/icons/lib/components/Icon";

export const PublicPresentation = (props) => {
  const { groupId } = useParams();
  const [presentation, setPresentation] = useContext(PresentationContext);
  const [code, setCode] = useState("");
  const [getUser, setGetUser] = useState(false);
  const [submitGetCode, setSubmitGetCode] = useState(false);
  const [answer, setAnswer] = useState(1);
  const [username, setUsername] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [presentationId, setPresentationId] = useState("");
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [currentSlide, setCurrentSlide] = useState({});
  const [isFinalSlide, setIsFinalSlide] = useState(false);
  const socket = useContext(SocketContext);
  const [messageList, setMessageList] = useState([]);
  const [questionList, setQuestionList] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState("");

  useEffect(() => {
    document.getElementById("main").style.backgroundColor = "rgb(56, 18, 114)";
  });

  useEffect(() => {
    socket.emit("init-game", {
      id: presentationId,
      groupId: null,
      user: null
    });
  }, [sessionId]);
  useEffect(() => {
    socket.on("connect", () => {});
    socket.on("slide-changed", (response) => {
      console.log("response ", response);
      if (response.status == 200) {
        setCurrentSlideIndex(response.data.currentSlide);
      }
    });
    socket.on("user-adding-message-chat", (response) => {
      console.log("user-adding-message-chat response ", response);
      if (response.status == 200) {
        setMessageList(response.data.newChat);
      } else {
        printMessage(response.status, response.message);
      }
    });
    socket.on("user-adding-question", (response) => {
      console.log("user-adding-question response ", response);
      if (response.status == 200) {
        setQuestionList(response.data.newQuestion);
      } else {
        printMessage(response.status, response.message);
      }
    });
    socket.on("user-voting-question", (response) => {
      console.log("user-voting-question response ", response);
      if (response.status == 200) {
        setQuestionList(response.data.newVote);
      } else {
        printMessage(response.status, response.message);
      }
    });
    socket.on("host-mark-question", (response) => {
      if (response.status == 200) {
        setQuestionList(response.data.newQuestion);
      } else {
        printMessage(response.status, response.message);
      }
    });
    return () => {
      socket.off("connect");
      socket.off("slide-changed");
      socket.off("get-answer-from-player");
      socket.off("user-adding-message-chat");
      socket.off("user-adding-question");
      socket.off("user-voting-question");
      socket.off("host-mark-question");
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
      var request = {
        slideIndex: currentSlideIndex,
        presentationId: presentationId
      };
      GetSlideByPresentationAndIndex(request)
        .then((response) => {
          if (response.success == false) {
            return;
          }
          setIsFinalSlide(isFinalSlide);
          setCurrentSlide(response.slide);
          getMessageAPI(presentationId, sessionId).then((response) => {
            console.log("getMessageAPI ", response);
            if (response.status === 200) {
              setMessageList(response.data);
            }
          });
          getQuestionAPI(presentationId, sessionId).then((response) => {
            console.log("getQuestionAPI ", response);
            if (response.status === 200) {
              setQuestionList(response.data);
            }
          });
        })
        .catch((error) => {
          console.log("error:", error);
        });
    }
  }, [currentSlideIndex]);
  const submitUsername = () => {
    setGetUser(true);
  };
  const submitCode = () => {
    if (code == "" || code.trim() == "") {
      toast.error("Please enter PIN to join a presentation", {
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
    setSubmitGetCode(true);
    if (username && code) {
      console.log("send getSessionId ", code, groupId);
      getSessionId(code, groupId)
        .then((response) => {
          if (response.status != 200) {
            return;
          }
          console.log("response getsessionId ", response);
          setPresentationId(code);
          setSessionId(response.data.data.session);
          var request = {
            sessionId: sessionId,
            presentationId: code
          };
          GetCurrentSlide(request)
            .then((response) => {
              setCurrentSlideIndex(response.data.data.current_slide);
            })
            .catch((error) => {
              throw error;
            });
        })
        .catch((err) => {
          setCode("");
          setSubmitGetCode(false);
          console.log("err ", err.message);
          toast.error(
            "Cant not access the presentation with " + code + ". Please enter another PIN!",
            {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: true,
              theme: "light"
            }
          );
        });
    }
  };
  const handleSubmitUserName = (e) => {
    if (e.keyCode === 13) {
      submitUsername();
    }
  };
  const handleSubmitCode = (e) => {
    if (e.keyCode === 13) {
      submitCode();
    }
  };
  const sendMessage = () => {
    console.log("currentMessage ", currentMessage);
    if (currentMessage.trim() !== "") {
      socket.emit("add-chat-message", {
        id: sessionId,
        presentationId,
        username,
        message: currentMessage
      });
    }
  };
  const sendQuestion = () => {
    console.log("currentQuestion ", currentQuestion);
    if (currentQuestion.trim() !== "") {
      socket.emit("add-question", {
        id: sessionId,
        presentationId,
        username,
        content: currentQuestion
      });
    }
  };
  const upVote = (questionId) => {
    if (questionId != undefined && questionId != "") {
      socket.emit("upvote-question", { id: sessionId, presentationId, questionId });
    }
  };
  const markQuestion = async (questionId) => {
    console.log("questionId ", questionId);
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken || accessToken == "") {
      printMessage(400, "Sorry you must be owner or co-owner to mark this question");
    } else {
      const user = await fetchUsers(accessToken);
      socket.emit("mark-answered-question", {
        id: sessionId,
        presentationId,
        questionId,
        user: user.user
      });
    }
  };
  if (getUser == false) {
    return (
      <Styled>
        <Layout>
          <div className="publicPresentation-container">
            <div className="pubPresentation-box">
              <label className="question-label" htmlFor="username">
                Username
              </label>
              <input
                type="text"
                id="username"
                className="publicquestion-input"
                maxLength={150}
                placeholder="Enter username"
                value={username}
                autoComplete="off"
                onKeyDown={handleSubmitUserName}
                onChange={(e) => setUsername(e.target.value)}
              />
              <button className="username-submit" onClick={() => submitUsername()}>
                Enter
              </button>
            </div>
          </div>
        </Layout>
      </Styled>
    );
  }
  if (submitGetCode == false) {
    return (
      <Styled>
        <Layout>
          <div className="publicPresentation-container">
            <div className="pubPresentation-box">
              <label className="question-label" htmlFor="username">
                Code
              </label>
              <input
                type="text"
                id="code"
                className="publicquestion-input"
                maxLength={150}
                placeholder="Enter code"
                value={code}
                autoComplete="off"
                onKeyDown={handleSubmitCode}
                onChange={(e) => setCode(e.target.value)}
              />
              <button className="username-submit" onClick={() => submitCode()}>
                Enter
              </button>
            </div>
          </div>
        </Layout>
      </Styled>
    );
  }

  return (
    <>
      <LoadingScreen
        loading={currentSlideIndex == 0}
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
              username={username}
              isFinalSlide={isFinalSlide}
              sessionId={sessionId}
            />
          </Layout>
        </Styled>
      </LoadingScreen>
      <ChatScreen
        currentMessage={currentMessage}
        setCurrentMessage={setCurrentMessage}
        messageList={messageList}
        setMessageList={setMessageList}
        sendMessage={sendMessage}
      />
      <QuestionScreen
        questionList={questionList}
        setQuestionList={setQuestionList}
        currentQuestion={currentQuestion}
        setCurrentQuestion={setCurrentQuestion}
        sendQuestion={sendQuestion}
        upVote={upVote}
        markQuestion={markQuestion}
      />
    </>
  );
};
const ChatScreen = (props) => {
  const { currentMessage, setCurrentMessage, messageList, setMessageList, sendMessage } = props;
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleHoverChange = (open) => {
    setHovered(open);
    setClicked(false);
  };
  const handleClickChange = (open) => {
    setHovered(false);
    setClicked(open);
  };

  const hoverContent = <div>Chatbox</div>;
  const clickContent = (
    <StyledChatScreen>
      <div className="chat-window" style={{ zIndex: 10000000003 }}>
        <h2>Chat window</h2>
        <div className="chat-header">
          <p>Live Chat</p>
        </div>
        <div className="chat-body">
          <ScrollToBottom className="message-container">
            {messageList.map((value, index) => {
              return (
                <div className="message" key={`message-${index}`}>
                  <div>
                    <div className="message-content">{value.message}</div>
                    <div className="message-meta">
                      <p id="author">{value.created_by}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </ScrollToBottom>
        </div>
        <div className="chat-footer">
          <input
            type="text"
            value={currentMessage}
            placeholder="Type your message "
            onChange={(event) => {
              setCurrentMessage(event.target.value);
            }}
          />
          <button onClick={sendMessage}>&#9658;</button>
        </div>
      </div>
      ;
    </StyledChatScreen>
  );

  return (
    <Popover
      style={{
        zIndex: 10000000003,
        width: 500
      }}
      content={hoverContent}
      title="Message box"
      trigger="hover"
      open={hovered}
      onOpenChange={handleHoverChange}>
      <Popover
        title="Message box"
        content={clickContent}
        trigger="click"
        open={clicked}
        onOpenChange={handleClickChange}>
        <span
          className="d-inline-block"
          style={{
            position: "absolute",
            right: 20,
            bottom: 100,
            zIndex: 10000000002,
            fontSize: "50px"
          }}>
          <MessageFilled style={{ fontSize: "50px", color: "#08c" }} />
        </span>
      </Popover>
    </Popover>
  );
};
const QuestionScreen = (props) => {
  const {
    questionList,
    setQuestionList,
    currentQuestion,
    setCurrentQuestion,
    sendQuestion,
    upVote,
    markQuestion
  } = props;
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);

  const hide = () => {
    setClicked(false);
    setHovered(false);
  };
  const handleHoverChange = (open) => {
    setHovered(open);
    setClicked(false);
  };
  const handleClickChange = (open) => {
    setHovered(false);
    setClicked(open);
  };

  const hoverContent = <div>Chatbox</div>;
  const clickContent = (
    <StyledQuestionScreen>
      <div className="question-window" style={{ zIndex: 10000000003 }}>
        <h2>Question window</h2>
        <div className="chat-header">
          <p>Question List</p>
        </div>
        <div className="chat-body">
          <ScrollToBottom className="message-container">
            {questionList.map((value, index) => {
              return (
                <div className="message" key={`message-${index}`}>
                  <div style={{ width: "100%" }}>
                    <div className="message-content">{value.question}</div>
                    <div className="message-meta">
                      <div className="like-container" onClick={() => upVote(value._id)}>
                        {value.vote > 0 ? <LikeFilled /> : <LikeOutlined />}
                        <p id="like-count">{value.vote}</p>
                      </div>
                      <div className="mark-question" onClick={() => markQuestion(value._id)}>
                        {value.is_answered == true ? <StarFilled /> : <StarOutlined />}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </ScrollToBottom>
        </div>
        <div className="chat-footer">
          <input
            type="text"
            value={currentQuestion}
            placeholder="Type your question "
            onChange={(event) => {
              setCurrentQuestion(event.target.value);
            }}
          />
          <button onClick={sendQuestion}>&#9658;</button>
        </div>
      </div>
      ;
    </StyledQuestionScreen>
  );
  return (
    <Popover
      style={{
        zIndex: 10000000003,
        width: 500
      }}
      content={hoverContent}
      title="Question box"
      trigger="hover"
      open={hovered}
      onOpenChange={handleHoverChange}>
      <Popover
        style={{
          zIndex: 10000000003
        }}
        title="Question box"
        content={clickContent}
        trigger="click"
        open={clicked}
        onOpenChange={handleClickChange}>
        <span
          className="d-inline-block"
          style={{
            position: "absolute",
            right: 20,
            bottom: 20,
            zIndex: 10000000002,
            fontSize: "50px"
          }}>
          <QuestionCircleFilled style={{ fontSize: "50px", color: "#08c" }} />
        </span>
      </Popover>
    </Popover>
  );
};
const PresentForViewer = (props) => {
  const { socket, slide, presentationId, username, isFinalSlide, sessionId } = props;
  useEffect(() => {
    document.getElementById("main").style.backgroundColor = "white";
  });
  switch (slide.type) {
    case SlideType.MultipleChoice:
      return (
        <MultipleChoicePresentation
          question={slide.question}
          optionList={slide.options}
          socket={socket}
          presentationId={presentationId}
          username={username}
          isFinalSlide={isFinalSlide}
          sessionId={sessionId}
        />
      );
    case SlideType.Heading:
      return <HeadingPresentation slide={slide} />;
    case SlideType.Paragraph:
      return <ParagraphPresentation slide={slide} />;
    default:
      break;
  }
};

const MultipleChoicePresentation = (props) => {
  const {
    question,
    optionList,
    socket,
    presentationId,
    username,
    isFinalSlide,
    sessionId,
    ...others
  } = props;
  const [answer, setAnswer] = useState(null); // option_id
  // const [hasSelect, setHasSelect] = useState(false);
  const [hasSelect, setHasSelect] = useState(true);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const navigate = useNavigate();
  const onChange = (e) => {
    setAnswer(e.target.value);
    if (!hasSelect) {
      setHasSelect(true);
    }
  };
  const submitAnswer = () => {
    // send socket
    socket.emit("send-answer-to-host", {
      id: sessionId,
      presentationId: presentationId,
      username: username,
      options: new Array(answer)
    });
    setHasSubmitted(true);
    // waiting screen or see chart.
  };
  useEffect(() => {
    console.log("socket", socket);
    socket.on("get-answer-from-player", (response) => {
      console.log("Add options: ", response.data);
    });
    socket.on("slide-changed", (response) => {
      if (response.status == 200) {
        setHasSelect(false);
        setHasSubmitted(false);
      }
    });
  }, [socket]);
  var OptionComponentList = optionList.map((option) => (
    <Radio key={option._id} value={option._id}>
      {option.content}
    </Radio>
  ));
  if (isFinalSlide && hasSubmitted) {
    return (
      <>
        <div
          className="d-flex flex-column justify-content-center align-items-stretch"
          style={{
            height: "100vh",
            position: "relative",
            top: "0",
            left: "0",
            background: "white"
          }}>
          <img className="mx-auto" src="/assets/images/kahoot.png" style={{ maxWidth: "30rem" }} />
          <h2 className="mx-auto my-4 py-2" style={{ fontSize: "2.8rem", fontWeight: "bold" }}>
            Thank you for your participation!
          </h2>
          <div className="d-flex flex-column align-items-stretch">
            <StyledNavLink to="/signup" className="mx-auto">
              <StyledButton variant="success">
                <div>Sign up and become a member</div>
              </StyledButton>
            </StyledNavLink>
            <StyledNavLink onClick={() => navigate(0)} className="mx-auto">
              <StyledButton variant="secondary">
                <div>Join Another Presentation</div>
              </StyledButton>
            </StyledNavLink>
          </div>
        </div>
      </>
    );
  }
  return (
    <LoadingScreen
      loading={hasSubmitted}
      bgColor="#fffff"
      spinnerColor="#fff"
      textColor="#fff"
      text="Please wait for the presenter to show the next slide.">
      <div className="surveyPresentation-container">
        <img
          id="logo"
          src="/assets/images/kahoot.png"
          style={{ maxWidth: "20rem", marginTop: "3rem" }}
        />
        <div className="survey-body">
          <div className="survey-question">{question}</div>
          <div className="survey-answer">
            <Radio.Group onChange={onChange} value={answer}>
              <Space direction="vertical">{OptionComponentList}</Space>
            </Radio.Group>
          </div>
          <div className="survey-submit">
            <Button
              disabled={!hasSelect || hasSubmitted}
              type="primary"
              className="submit-button"
              onClick={submitAnswer}>
              Submit
            </Button>
          </div>
        </div>
      </div>
    </LoadingScreen>
  );
};

const HeadingPresentation = (props) => {
  const { slide} = props;
  console.log("Heading", slide);
  return (
    <Layout style={{ margin: "1rem", position: "relative", top: "-17rem" }}>
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
          <div style={{ fontSize: "1.6rem" }}>{slide.subHeading}</div>
        </div>
      </Content>
    </Layout>
  );
};

const ParagraphPresentation = (props) => {
  const { slide } = props;
  return (
    <Layout style={{ margin: "1rem", position: "relative", top: "-17rem" }}>
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