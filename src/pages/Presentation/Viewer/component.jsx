import React, { useEffect, useState, useContext } from "react";
import { Layout, Radio, Space, Input, Button } from "antd";
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
import { StyleContainer, StyledNavLink } from "./style";
import { useNavigate, useParams } from "react-router-dom";

export const PresentForViewer = (props) => {
    const { socket, slide, presentationId, username, isFinalSlide, sessionId } = props;
    useEffect(() => {
      document.getElementById("main").style.backgroundColor = "white";
    });
    if(!slide)
    {
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