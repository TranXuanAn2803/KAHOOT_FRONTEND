import React, { useEffect, useState, useContext } from "react";
import { Layout, Radio, Space, Input, Button } from "antd";
const { Header, Footer, Sider, Content } = Layout;
import Styled from "../style";
import PresentationContext from "../../../utils/PresentationContext";
import { Sector } from "recharts";
import { getSessionId } from "../API";
import { printMessage } from "../../../utils/method";
import { Slider } from "@material-ui/core";
import { GetCurrentSlide, GetSlideByPresentationAndIndex } from "../api/Session.Api";

export const PublicPresentation = (props) => {
  const [presentation, setPresentation] = useContext(PresentationContext);
  const [getUser, setGetUser] = useState(false);
  const [code, setCode] = useState("");
  const [submitGetCode, setSubmitGetCode] = useState(false);
  const [answer, setAnswer] = useState(1);
  const [username, setUsername] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [presentationId, setPresentationId] = useState("");
  const [currentSlideIndex, setCurrentSlideIndex] = useState(-1);
  const [currentSlide, setCurrentSlide] = useState({});
  const submitUsername = () => {
    // console.log("username ", username);
    setGetUser(true);
  };
  const submitCode = () => {
    setSubmitGetCode(true);
    if (username && code) {
      getSessionId(code)
        .then((response) => {
          if (response.status != 200) {
            return;
          }
          setPresentationId(code);
          setSessionId(response.data.data.session);
          var request = {
            sessionId: sessionId,
            presentationId: code
          };
          GetCurrentSlide(request)
            .then((response) => {
              console.log("current slide ", response.data.data);
              setCurrentSlideIndex(response.data.data.current_slide);
            })
            .catch((error) => {
              console.log("error ", err);
            });
        })
        .catch((err) => {
          console.log("error ", err);
        });
    }
  };
  const onChange = (e) => {
    setAnswer(e.target.value);
  };
  useEffect(() => {
    document.getElementById("main").style.backgroundColor = "rgb(56, 18, 114)";
  });

  useEffect(() => {
    if (presentationId == "" || presentationId.trim() == "" || currentSlideIndex < 0) {
      return;
    }
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
        setCurrentSlide(response.slide);
      })
      .catch((error) => {
        console.log("error:", error);
      });
  }, [currentSlideIndex]);

  // return (
  //   <Styled>
  //     <Layout>
  //       {getUser == false ? (
  //         <div className="publicPresentation-container">
  //           <div className="pubPresentation-box">
  //             <label className="question-label" htmlFor="username">
  //               Username
  //             </label>
  //             <input
  //               type="text"
  //               id="username"
  //               className="publicquestion-input"
  //               maxLength={150}
  //               placeholder="Enter username"
  //               value={username}
  //               autoComplete="off"
  //               onChange={(e) => setUsername(e.target.value)}
  //             />
  //             <button className="username-submit" onClick={() => submitUsername()}>
  //               Enter
  //             </button>
  //           </div>
  //         </div>
  //       ) : (
  //         <GetCode />
  //       )}
  //     </Layout>
  //   </Styled>
  // );

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
                defaultValue=""
                value={code}
                autoComplete="off"
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
    <Styled>
      <Layout>
        <PresentForViewer slide={currentSlide} />
      </Layout>
    </Styled>
  );
};

const PresentForViewer = (props) => {
  const { slide } = props;
  const [answer, setAnswer] = useState(1);
  const onChange = (e) => {
    setAnswer(e.target.value);
  };
  useEffect(() => {
    document.getElementById("main").style.backgroundColor = "white";
  });

  switch (slide.type) {
    case SlideType.MultipleChoice:
      return <MultipleChoicePresentation question={slide.question} optionList={slide.options} />;
    case SlideType.Heading:
      return <HeadingPresentation content={slide.heading} />;
    case SlideType.Paragraph:
      return <ParagraphPresentation content={slide.paragraph} />;
    default:
      break;
  }
};

const MultipleChoicePresentation = (props) => {
  const { question, optionList, ...others } = props;
  const [answer, setAnswer] = useState(null);
  const onChange = (e) => {
    setAnswer(e.target.value);
  };
  const submitAnswer = () => {
    // send socket
    // waiting screen or see chart.
  };
  useEffect(() => {
    document.getElementById("main").style.backgroundColor = "white";
  });
  var OptionComponentList = optionList.map((option) => (
    <Radio key={option._id} value={option._id}>
      {option.content}
    </Radio>
  ));
  return (
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
          <Button type="primary" className="submit-button" onClick={submitAnswer}>
            Submit
          </Button>
        </div>
      </div>
    </div>
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
/*

const PublicPresentation = (props) => {
  const [presentation, setPresentation] = useContext(PresentationContext);
  const [username, setUsername] = useState("");
  const [getUser, setGetUser] = useState(false);
  const [submitGetCode, setSubmitGetCode] = useState(false);
  const [code, setCode] = useState("");
  const [answer, setAnswer] = useState(1);

  const submitUsername = () => {
    // console.log("username ", username);
    setGetUser(true);
  };
  const submitCode = () => {
    setSubmitGetCode(true);
  };
  const onChange = (e) => {
    setAnswer(e.target.value);
  };
  useEffect(() => {
    document.getElementById("main").style.backgroundColor = "rgb(56, 18, 114)";
  });
  return (
    <Styled>
      <Layout>
        {getUser == false ? (
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
                onChange={(e) => setUsername(e.target.value)}
              />
              <button className="username-submit" onClick={() => submitUsername()}>
                Enter
              </button>
            </div>
          </div>
        ) : (
          <GetCode username={username} />
        )}
      </Layout>
    </Styled>
  );
};
const GetCode = (props) => {
  const { username } = props;
  const [submitGetCode, setSubmitGetCode] = useState(false);
  const [code, setCode] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [dataCurrentSlide, setDataCurrentSlide] = useState("");
  const submitCode = async () => {
    console.log("username va ma code hien tai ", username, code);
    await getSessionId(code)
      .then((response) => {
        console.log("submitCode ", response);
        const sessionId = response.data.data.session;
        setSessionId(sessionId);
        setSubmitGetCode(true);
      })
      .catch((err) => {
        const response = err.response;
        printMessage(400, response.data);
      });
  };
  return (
    <>
      {submitGetCode == false ? (
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
              defaultValue=""
              value={code}
              autoComplete="off"
              onChange={(e) => setCode(e.target.value)}
            />
            <button className="username-submit" onClick={() => submitCode()}>
              Enter
            </button>
          </div>
        </div>
      ) : (
        <SurveyPresentation currentSlide={currentSlide} dataCurrentSlide={dataCurrentSlide} />
      )}
    </>
  );
};
const SurveyPresentation = (props) => {
  const { currentSlide, dataCurrentSlide } = props;
  const [answer, setAnswer] = useState(1);
  const onChange = (e) => {
    setAnswer(e.target.value);
  };
  useEffect(() => {
  useEffect(() => {
    document.getElementById("main").style.backgroundColor = "white";
  }, []);
  return (
    <>
      {currentSlide == 0 ? (
        <div className="waitingPresentation-container">
          <h3>Waiting for other people to join...</h3>
        </div>
      ) : (
        <div className="surveyPresentation-container">
          <img
            id="logo"
            src="/assets/images/kahoot.png"
            style={{ maxWidth: "20rem", marginTop: "3rem" }}
          />
          <div className="survey-body">
            <div className="survey-question">This is test question?</div>
            <div className="survey-answer">
              <Radio.Group onChange={onChange} value={answer}>
                <Space direction="vertical">
                  <Radio value="1">Option A</Radio>
                  <Radio value="2">Option B</Radio>
                  <Radio value="3">Option C</Radio>
                  <Radio value="4">Option D</Radio>
                </Space>
              </Radio.Group>
            </div>
            <div className="survey-submit">
              <Button type="primary" className="submit-button">
                Submit
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

*/

const SlideType = {
  MultipleChoice: 1,
  Heading: 2,
  Paragraph: 3
};
