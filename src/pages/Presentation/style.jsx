import styled from "styled-components";
const Styled = styled.div`
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
`;

export default Styled;
