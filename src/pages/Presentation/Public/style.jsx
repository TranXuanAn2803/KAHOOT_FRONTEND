import { NavLink } from "react-router-dom";
import styled from "styled-components";
import Button from "react-bootstrap/Button";

export const StyledNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: 0.5rem;
  font-size: 1.4rem;
  font-weight: 400;
  text-decoration: none;
  color: #000;
  &p {
    padding-left: 0.5rem;
  }
`;

export const StyledButton = styled(Button)`
  padding: 0.6rem 1.6rem;
  font-size: 1.4rem;
  font-weight: 600;
  letter-spacing: 0.1rem;
  box-shadow: rgb(0 0 0 / 25%) 0px -4px inset;
  &:hover {
    box-shadow: rgb(0 0 0 / 25%) 0px -2px inset;
  }
`;

export const StyleContainer = styled.div`
  max-width: 60rem;
  display: flex;
  margin: auto;
  background-color: white;
  height: 100%;
`;
export const StyledChatScreen = styled.div`
  position: relative;
  z-index: 10000000003;
  .chat-window {
    width: 300px;
    height: 420px;
    margin: 20px auto;
    text-align: center;
  }
  .chat-window h2 {
    margin: 20px 0px;
    font-weight: 700;
    font-size: 30px;
  }
  .chat-header {
    height: 45px;
    border-radius: 6px;
    background: #263238;
  }
  .chat-header p {
    display: block;
    padding: 0 1em 0 2em;
    color: #fff;
    font-weight: 700;
    line-height: 45px;
  }
  .chat-body {
    height: calc(450px - (45px + 70px));
    border: 1px solid #263238;
    background: #fff;
    position: relative;
  }
  .chat-body .message-container {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
  }
  .message-container > div {
    height: 100%;
    overflow-y: auto;
    width: 100%;
  }
  .chat-window .chat-body .message {
    height: auto;
    padding: 10px;
    display: flex;
    justify-content: flex-start;
  }
  .message-content {
    justify-content: flex-start;
  }
  .chat-window .chat-body .message .message-content {
    width: auto;
    height: auto;
    min-height: 40px;
    max-width: 120px;
    background-color: #43a047;
    border-radius: 5px;
    color: white;
    display: flex;
    align-items: center;
    margin-right: 5px;
    margin-left: 5px;
    padding-right: 5px;
    padding-left: 5px;
    overflow-wrap: break-word;
    word-break: break-word;
  }
  .chat-window p {
    margin: 0;
  }
  .chat-window .chat-body .message .message-meta {
    display: flex;
    font-size: 12px;
    justify-content: flex-start;
    margin-left: 5px;
  }
  .chat-window .chat-footer {
    height: 40px;
    border: 1px solid #263238;
    border-top: none;
    display: flex;
  }
  .chat-window .chat-footer input {
    height: 100%;
    flex: 85% 1;
    border: 0;
    padding: 0 0.7em;
    font-size: 1em;
    border-right: 1px dotted #607d8b;
    outline: none;
    font-family: "Open Sans", sans-serif;
  }
  .chat-window .chat-footer button {
    border: 0;
    display: grid;
    place-items: center;
    cursor: pointer;
    flex: 15% 1;
    height: 100%;
    background: transparent;
    outline: none;
    font-size: 25px;
    color: lightgray;
  }
  .message-meta #author {
    margin-left: 10px;
    font-weight: bold;
  }
`;
export const StyledQuestionScreen = styled.div`
  position: relative;
  z-index: 10000000003;
  .question-window {
    width: 300px;
    height: 420px;
    margin: 20px auto;
    text-align: center;
  }
  .question-window h2 {
    margin: 20px 0px;
    font-weight: 700;
    font-size: 30px;
  }
  .chat-header {
    height: 45px;
    border-radius: 6px;
    background: #263238;
  }
  .chat-header p {
    display: block;
    padding: 0 1em 0 2em;
    color: #fff;
    font-weight: 700;
    line-height: 45px;
  }
  .chat-body {
    height: calc(450px - (45px + 70px));
    border: 1px solid #263238;
    background: #fff;
    position: relative;
  }
  .chat-body .message-container {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
  }
  .message-container > div {
    height: 100%;
    overflow-y: auto;
    width: 100%;
  }
  .chat-body .message {
    height: auto;
    padding: 10px;
    display: flex;
    justify-content: flex-start;
  }
  .message-content {
    justify-content: flex-start;
  }
  .chat-body .message .message-content {
    width: fit-content;
    height: auto;
    min-height: 40px;
    background-color: #4370a0;
    border-radius: 5px;
    color: white;
    display: flex;
    align-items: center;
    margin-right: 5px;
    margin-left: 5px;
    padding-right: 5px;
    padding-left: 5px;
  }
  .question-window p {
    margin: 0;
  }
  .message-meta {
    display: flex;
    font-size: 12px;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 5px;
    width: 90%;
  }
  .message-meta .like-container {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    gap: 5px;
    align-items: center;
    cursor: pointer;
  }

  .question-window .chat-footer {
    height: 40px;
    border: 1px solid #263238;
    border-top: none;
    display: flex;
  }
  .question-window .chat-footer input {
    height: 100%;
    flex: 85% 1;
    border: 0;
    padding: 0 0.7em;
    font-size: 1em;
    border-right: 1px dotted #607d8b;
    outline: none;
    font-family: "Open Sans", sans-serif;
  }
  .question-window .chat-footer button {
    border: 0;
    display: grid;
    place-items: center;
    cursor: pointer;
    flex: 15% 1;
    height: 100%;
    background: transparent;
    outline: none;
    font-size: 25px;
    color: lightgray;
  }
  .message-meta #like-count {
    margin-left: 5px;
    font-weight: bold;
  }
  .mark-question {
    margin-bottom: 2px;
    cursor: pointer;
  }
`;
