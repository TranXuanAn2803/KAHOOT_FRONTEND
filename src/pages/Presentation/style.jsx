import Button from "react-bootstrap/Button";
import AddIcon from "@mui/icons-material/Add";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";

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

export const MenuItem = styled(NavLink)`
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

export const MenuBar = styled(Navbar)`
  padding: 0.8rem !important;
  height: 100%;
`;

export const MenuList = styled(Nav)`
  height: inherit;
`;
const Styled = styled.div`
  .on-row {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .input-box {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-bottom: 20px;
  }
  .creator-container {
    width: 100vw;
    height: calc(100vh - 6.4rem);
  }
  .creator-header {
    width: 100%;
    padding: 8px 16px;
    border-color: rgb(231, 232, 235);
    border-bottom-width: 1px;
    border-top-width: 1px;
    border-style: solid;
    border-left: none;
    border-right: none;
  }
  .new-slide-button {
    min-height: 40px;
  }
  .header-button {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 20px;
    flex: 1 1 auto;
  }
  .creator-body {
    display: flex;
    flex-direciton: row;
    flex: 1 1 auto;
    height: 100%;
    width: 100%;
  }
  .body-left-container {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    width: 224px;
    overflow-y: auto;
    overflow: visible;
  }
  .body-left-list {
    display: flex;
    flex-flow: column nowrap;
    align-content: flex-start;
    list-style: none;
    width: 100%;
    min-height: 100%;
    overflow: hidden;
    padding-bottom: 0px;
  }
  [data-rbd-drag-handle-context-id="3"] {
    cursor: grab;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }
  .slide-thumbnail {
    display: flex;
    flex-direciton: row;
    max-height: 100px;
    padding: 8px;
    gap: 10px;
  }
  .slide-image {
    background-size: contain;
    width: 100%;
    height: 113px;
  }
  .slide-image-container {
    height: 100%;
    max-width: 174px;
  }
  .body-center {
    padding: 32px;
    min-width: 500px;
    height: 100%;
    background-color: #e7e8eb;
  }
  .center-draw {
    background-color: #fff;
    height: 100%;
    width: 100%;
  }
  .body-right {
    width: 100%;
    height: 100%;
    background-color: #fff;
    padding: 20px 30px;
  }
  .item-question {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 20px;
  }
  .question-text {
    color: rgb(16, 24, 52);
    font-size: 16px;
    font-weight: 600;
    font-family: MentiText, Arial, sans-serif;
  }
  .question-icon {
    margin-bottom: 5px;
  }
  .question-input {
    transition: all 0.3s ease 0s;
    padding: 8px;
    outline: none;
    cursor: auto;
    border: 1px solid rgb(183, 186, 194);
    display: block;
    border-radius: 3px;
    width: 100%;
  }

  .question-input {
    transition: all 0.3s ease 0s;
    padding: 8px;
    outline: none;
    cursor: auto;
    border: 1px solid rgb(183, 186, 194);
    display: block;
    border-radius: 3px;
    width: 100%;
  }
  .question-input: focus {
    border-color: rgb(25, 108, 255);
  }
  .option-input {
    width: 50%;
    display: inline-block;
  }
  .item-answer {
    display: flex;
    flex-direction: row;
    gap: 20px;
    align-items: center;
    margin: 20px 0px;
  }
  .add-option button {
    width: 100%;
    background-color: rgb(219, 220, 225);
  }
  .add-option button:hover {
    background-color: rgb(175, 176, 180);
  }
  .presentation-button button {
    width: 100%;
  }
  .presentation-button .play-icon {
    transform: translate(-9px, -3px);
  }
  .form-create-slide {
    margin-bottom: 20px;
  }
  .ant-tabs-content-holder {
    min-height: 492px;
  }
  .publicPresentation-container {
    background: rgb(56, 18, 114);
    width: 100%;
    height: 100vh;
    position: relative;
  }
  .surveyPresentation-container {
    background: #fff;
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .survey-question {
    background-image: url(https://static.pexels.com/photos/4827/nature-forest-trees-fog.jpeg);
    -webkit-text-fill-color: transparent;
    -webkit-background-clip: text;
    color: #ffffff;
    font-size: 5rem;
    font-family: "Bungee", cursive;
    animation: filling 3s ease forwards;
  }
  .ant-radio-wrapper {
    font-size: 3rem;
  }
  .submit-button {
    margin-top: 2rem;
    width: 100%;
    min-height: 4rem;
    font-size: 2rem;
  }
  @keyframes filling {
    from {
      background-position: center 25%;
    }
    to {
      background-position: center 50%;
    }
  }
  .pubPresentation-box {
    position: absolute;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 0%);
    z-index: 1;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 320px;
    padding: 20px;
    text-align: center;
  }
  .publicquestion-input {
    transition: all 0.3s ease 0s;
    padding: 8px;
    outline: none;
    cursor: auto;
    border: 1px solid rgb(183, 186, 194);
    display: block;
    border-radius: 3px;
    width: 100%;
    margin-bottom: 20px;
  }
  .username-submit {
    width: 100%;
    margin: 0px;
    border: 0px;
    cursor: pointer;
    display: inline-block;
    vertical-align: bottom;
    box-shadow: rgb(0 0 0 / 25%) 0px -4px inset;
    background: rgb(51, 51, 51);
    color: rgb(255, 255, 255);
    border-radius: 4px;
    font-size: 1.5rem;
    font-weight: bold;
    text-align: center;
    text-decoration: none;
    min-width: 48px;
    min-height: 48px;
    padding: 0px 16px 4px;
  }
`;

export default Styled;
