import styled from "styled-components";
const Styled = styled.div`
  box-shadow: rgb(0 0 0 / 25%) 0 0.2rem 0.4rem 0;
  .header {
    width: 100%;
    position: fixed;
    left: 0px;
    top: 0px;
    z-index: 2;
    height: 6.4rem;
    box-shadow: rgb(0 0 0 / 10%) 0px 2px 4px 0px;
    background: #fff;
    padding: 10px 20px;
    display: flex;
  }
  .header-img {
    width: auto;
    background-size: cover;
    height: auto;
  }
  .signin-main {
    padding-top: 5rem;
    width: 100%;
    height: fit-content;
    background-color: transparent;
    min-height: 100rem;
  }
  .main-container {
    display: flex;
    flex-direction: column;
    max-width: 40rem;
    margin: 0 auto;
    width: fit-content;
  }
  .card-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: rgb(255, 255, 255);
    border-radius: 1rem;
    box-shadow: rgb(0 0 0 / 15%) 0 0.2rem 0.4rem 0;
    padding: 1rem 4rem;
  }
  .card-container h2 {
    font-weight: bold;
    line-height: 140%;
    margin-top: 3rem;
  }
  .input-box {
    align-self: flex-start;
    width: 100%;
  }
  .input-label {
    font-weight: bold;
    display: block;
    padding: 0.5rem 0rem;
  }
  .input-box .input-text[type="text"],
  .input-box .input-text[type="password"] {
    width: 100%;
    min-height: 4.4rem;
    font-family: Montserrat, "Noto Sans Arabic", "Helvetica Neue", Helvetica, Arial, sans-serif;
    border: 0.1rem solid rgb(178, 178, 178);
    border-radius: 0.5rem;
    background-color: #fff !important;
    color: rgb(51, 51, 51) !important;
    font-size: 1.6rem;
    line-height: 2rem;
    letter-spacing: 0.02rem;
    outline: none;
    transition: all 1s ease-in;
    padding-left: 2rem;
    text-overflow: ellipsis;
  }
  .input-text[type="password"] {
    padding-right: 3.5rem;
    overflow: hidden;
    white-space: nowrap;
  }
  .input-text:focus {
    border: 0.2rem solid rgb(19, 104, 206) !important;
  }
  .login-btn {
    margin: 3rem 0rem;
    border: none;
    width: 100%;
    cursor: pointer;
    box-shadow: rgb(0 0 0 / 25%) 0rem -0.4rem inset;
    background: rgb(38, 137, 12);
    color: rgb(255, 255, 255);
    border-radius: 0.4rem;
    font-size: 1.4rem;
    font-weight: bold;
    text-align: center;
    text-decoration: none;
    min-width: 4.2rem;
    min-height: 4.2rem;
    padding: 0rem 1.6rem 0.4rem;
  }
  .card-line {
    margin: 0rem;
    width: 100%;
    border-top: 0.1rem solid rgb(204, 204, 204);
  }
  .auth-split {
    display: flex;
    justify-content: center;
    text-align: center;
    position: relative;
    width: 100%;
    flex-direction: row;
  }
  .card-text {
    position: absolute;
    padding: 0rem 0.8rem;
    background: rgb(255, 255, 255);
    font-weight: bold;
    margin-top: -0.96rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1;
  }
  .single-sign-on {
    width: 100%;
    padding: 2.4rem 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .google-sign {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin: 0.4rem 0rem;
    border-radius: 0.4rem;
    color: rgb(0, 0, 0);
    border: 0.1rem solid rgb(0, 0, 0);
    background-color: rgb(255, 255, 255);
    box-shadow: none;
    padding: 0;
    line-height: 1.6rem;
    height: auto;
    font-weight: 500;
    cursor: pointer;
  }
  .google-sign-img {
    min-height: 2.8rem;
    margin: 0rem 0.8rem;
  }
  .form-login {
    width: 100%;
  }
  .text-disclaimer {
    margin-top: 1.6rem;
    max-width: 41.6rem;
    text-align: center;
    font-size: 1.28rem;
    color: rgb(110, 110, 110);
  }
  .error-message {
    color: red;
    font-size: 1.4rem;
    line-height: 2rem;
    margin: 2rem 0;
  }
  .redirect-signup {
    text-align: center;
    letter-spacing: 0.01rem;
  }
  .redirect-signup a {
    color: rgb(19, 104, 206);
    margin-left: 0.5rem;
  }
  .pwd-container {
    position: relative;
  }
  .pwd-action {
    position: absolute;
    right: 0.8rem;
    top: 50%;
    transform: translateY(-50%);
    height: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  .forgot-password {
    font-size: 1.5rem;
    line-height: 17px;
    margin: 1rem 0px 1.5rem;
  }
`;

export default Styled;
