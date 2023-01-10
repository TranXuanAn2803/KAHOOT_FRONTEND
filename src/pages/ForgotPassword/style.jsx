import styled from "styled-components";
export const Styled = styled.div`
  .background {
    height: fit-content;
    background-color: #f2f2f2;
    width: 100%;
    display: flex;
    align-items: center;
    height: calc(100vh - 6.4rem);
    justify-content: center;
  }
  .forgotPassword-container {
    font-size: 1.5rem;
    font-weight: bold;
    margin: 1.5rem 0px;
  }
  .card-hr {
    width: 100%;
    border: 1px solid rgb(204, 204, 204);
    margin: 0px;
  }
  .card-backToLogin {
    padding: 1.5rem;
    color: rgb(69, 163, 229);
    text-align: center;
    letter-spacing: 0.2px;
    font-size: 1.5rem;
    width: 100%;
  }
  .forgot-card {
    min-width: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: rgb(0 0 0/15%) 0px 2px 4px 0px;
    color: inherit;
  }
  .forgot-title {
    color: inherit;
    font-size: 2rem;
    font-weight: bold;
    margin: 1.5rem 0px;
    text-align: center;
  }
  .card-form {
    width: 100%;
    padding: 20px;
  }
  .input-text {
    width: 100%;
    min-height: 4rem;
    font-family: Montserrat, "Noto Sans Arabic", "Helvetica Neue", Helvetica, Arial, sans-serif;
    border: 1px solid rgb(178, 178, 178);
    border-radius: 0.25rem;
    background-color: rgb(255, 255, 255);
    color: rgb(51, 51, 51);
    font-size: 1.5rem;
    line-height: 1.25rem;
    -webkit-letter-spacing: 0.2px;
    -moz-letter-spacing: 0.2px;
    -ms-letter-spacing: 0.2px;
    letter-spacing: 0.2px;
    -webkit-transition: all 0.2s ease 0s;
    transition: all 0.2s ease 0s;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    text-overflow: ellipsis;
    resize: none;
    overflow: auto;
    padding: 20px;
    white-space: nowrap;
  }
  .forgot-btn {
    min-height: 42px;
    padding-bottom: 0px;
    background-color: rgb(204, 204, 204);
    color: rgb(255, 255, 255);
    box-shadow: none;
    cursor: not-allowed;
  }
  .forgot-btn {
    margin-top: 20px;
    min-height: 42px;
    padding-bottom: 0px;
    background-color: rgb(204, 204, 204);
    color: rgb(255, 255, 255);
    box-shadow: none;
    cursor: not-allowed;
    width: 100%;
    border: 0px;
    cursor: pointer;
    display: inline-block;
    vertical-align: bottom;
    box-shadow: rgb(0 0 0 / 25%) 0px -4px inset;
    background: rgb(38, 137, 12);
    color: rgb(255, 255, 255);
    border-radius: 4px;
    font-size: 1.5rem;
    font-weight: bold;
    text-align: center;
    text-decoration: none;
    min-width: 42px;
    min-height: 42px;
    padding: 0px 16px 4px;
    position: relative;
    font-family: Montserrat, "Noto Sans Arabic", "Helvetica Neue", Helvetica, Arial, sans-serif;
  }
  .forgot-btn[disabled] {
    background-color: rgb(204, 204, 204);
    color: rgb(255, 255, 255);
    box-shadow: none;
    cursor: not-allowed;
  }
`;
