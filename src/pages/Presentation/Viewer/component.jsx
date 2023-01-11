import {
  LikeFilled,
  LikeOutlined,
  MessageFilled,
  QuestionCircleFilled,
  StarFilled,
  StarOutlined
} from "@ant-design/icons";
import { Button, Layout, Popover, Radio, Space } from "antd";
import React, { useEffect, useState } from "react";
import LoadingScreen from "react-loading-screen";
import { useNavigate } from "react-router-dom";
import ScrollToBottom from "react-scroll-to-bottom";
import { SlideType } from "../../../actions/constants";
import { StyledChatScreen, StyledQuestionScreen } from "../Public/style";
import { StyledButton } from "../style";
import { StyledNavLink } from "./style";
const { Header, Footer, Sider, Content } = Layout;

export const PresentForViewer = (props) => {
  const { socket, slide, presentationId, username, isFinalSlide, sessionId } = props;
  useEffect(() => {
    document.getElementById("main").style.backgroundColor = "white";
  });
  if (!slide) {
    return <></>;
  }
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

export const ChatScreen = (props) => {
  const { currentMessage, setCurrentMessage, messageList, setMessageList, sendMessage } = props;
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
    </StyledChatScreen>
  );

  return (
    <Popover
      style={{
        zIndex: 10000000003,
        width: 500
      }}
      placement="leftBottom"
      content={hoverContent}
      title="Message box"
      trigger="hover"
      open={hovered}
      onOpenChange={handleHoverChange}>
      <Popover
        style={{
          zIndex: 10000000003
        }}
        placement="left"
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

export const QuestionScreen = (props) => {
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
    </StyledQuestionScreen>
  );
  return (
    <Popover
      style={{
        zIndex: 10000000003,
        width: 500
      }}
      placement="leftBottom"
      content={hoverContent}
      title="Question box"
      trigger="hover"
      open={hovered}
      onOpenChange={handleHoverChange}>
      <Popover
        style={{
          zIndex: 10000000003
        }}
        placement="left"
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
