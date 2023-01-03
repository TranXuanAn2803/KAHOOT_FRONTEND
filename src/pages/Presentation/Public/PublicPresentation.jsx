import React, { useEffect, useState, useContext } from "react";
import { Layout, Radio, Space, Input, Button } from "antd";
const { Header, Footer, Sider, Content } = Layout;
import Styled from "../style";
import PresentationContext from "../../../utils/PresentationContext";
import { Sector } from "recharts";

export const PublicPresentation = (props) => {
  const [username, setUsername] = useState("");
  const [getUser, setGetUser] = useState(false);
  const [presentation, setPresentation] = useContext(PresentationContext);

  const submitUsername = () => {
    // console.log("username ", username);
    setGetUser(true);
  };
  // console.log("presentation ", presentation);

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
                defaultValue=""
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
          <GetCode />
        )}
      </Layout>
    </Styled>
  );
};
const GetCode = () => {
  const [submitGetCode, setSubmitGetCode] = useState(false);
  const [code, setCode] = useState("");
  const submitCode = () => {
    setSubmitGetCode(true);
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
        <SurveyPresentation />
      )}
    </>
  );
};
const SurveyPresentation = () => {
  const [answer, setAnswer] = useState(1);
  const onChange = (e) => {
    setAnswer(e.target.value);
  };
  useEffect(()=>{
    document.getElementById("main").style.backgroundColor = "white";
  });
  return (
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
  );
};
