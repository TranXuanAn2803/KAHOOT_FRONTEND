import React, { useEffect, useState, useContext } from "react";
import { Layout } from "antd";
const { Header, Footer, Sider, Content } = Layout;
import Styled from "../style";
import PresentationContext from "../../../utils/PresentationContext";
import { Sector } from "recharts";
export const PublicPresentation = (props) => {
  const [username, setUsername] = useState("");
  const [getUser, setGetUser] = useState(false);
  const [presentation, setPresentation] = useContext(PresentationContext);

  const submitUsername = () => {
    console.log("username ", username);
    setGetUser(true);
  };
  console.log("presentation ", presentation);
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
        <></>
      )}
    </>
  );
};
