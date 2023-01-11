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

  .chat-window {
    margin-top: 20px;

  }
`;
