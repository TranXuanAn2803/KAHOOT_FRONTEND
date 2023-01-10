import React, { useEffect, useState, useContext } from "react";
import { Layout, Radio, Space, Input, Button } from "antd";
import { toast } from "react-toastify";
const { Header, Footer, Sider, Content } = Layout;
import Styled, { StyledButton } from "../style";
// import PresentationContext from "../../../utils/PresentationContext";
import { Sector } from "recharts";
import { getSessionId } from "../API";
import { printMessage } from "../../../utils/method";
import { Slider } from "@material-ui/core";
import { GetCurrentSlide, GetSlideByPresentationAndIndex } from "../api/Session.Api";
import { SocketContext } from "../../../components/Socket/socket-client";
import { SlideType } from "../../../actions/constants";

import LoadingScreen from "react-loading-screen";
import { StyleContainer, StyledChatScreen, StyledNavLink, StyledPresentForViewer } from "./style";
import { useNavigate, useParams } from "react-router-dom";
import ScrollToBottom from "react-scroll-to-bottom";

const ChatScreen = (props) => {
  const { currentMessage, setCurrentMessage } = props;
  return (
    <StyledChatScreen>
      <div className="chat-window">
        <div className="chat-header">
          <p>Live Chat</p>
        </div>
        <div className="chat-body">
          <ScrollToBottom className="message-container">
            {messageList.map((value, index) => {
              return (
                <div className="message" key={`message-${index}`}>
                  <div className="message-content">{value.message}</div>
                  <div className="message-meta">
                    <p id="author">{value.author}</p>
                  </div>
                  <div className="chat-footer">
                    <input
                      type="text"
                      value={currentMessage}
                      placeholder="Type your message "
                      onChange={(event) => {
                        setCurrentMessage(event.target.value);
                      }}
                      onKeyPress={(event) => {
                        event.key === "Enter" && sendMessage();
                      }}
                    />
                    <button onClick={sendMessage}>&#9658;</button>
                  </div>
                </div>
              );
            })}
          </ScrollToBottom>
        </div>
      </div>
      ;
    </StyledChatScreen>
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
      return <HeadingPresentation content={slide.heading} />;
    case SlideType.Paragraph:
      return <ParagraphPresentation content={slide.paragraph} />;
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
    document.getElementById("main").style.backgroundColor = "white";
  });
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
  const { content } = props;
  return <h1>{content}</h1>;
};

const ParagraphPresentation = (props) => {
  const { content } = props;
  return <p>{content}</p>;
};

// import React, { useEffect, useState, useContext } from "react";
// import { Layout, Radio, Space, Input, Button } from "antd";
// import { toast } from "react-toastify";
// import Styled, { StyledButton } from "../style";
// import { GetCurrentSlide, GetSlideByPresentationAndIndex } from "../api/Session.Api";
// import { SocketContext } from "../../../components/Socket/socket-client";
// import { SlideType } from "../../../actions/constants";

// import LoadingScreen from "react-loading-screen";
// import { StyleContainer, StyledNavLink } from "./style";
// import { useNavigate, useParams } from "react-router-dom";
// import { PresentForViewer } from "./component";
// import { getSessionId } from "../API";
import UserContext from "../../../utils/UserContext";
import { fetchUsers } from "../../../utils/api";

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
