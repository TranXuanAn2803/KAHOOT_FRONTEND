import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import Avatar from "@mui/material/Avatar";

export const Styled = styled.div`
  line-height: 1.72;
  #logo {
    width: 0.4rem;
  }

  #menubar {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
    box-shadow: 0rem 0.4rem 1rem rgba(0, 0, 0, 0.25);
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
  }

  .nav-link {
    height: 6.4rem;
    display: flex;
    align-items: center;
    padding: 0.2rem 0.2rem 0;
    position: relative;
    box-sizing: border-box;
    font-weight: 500;
    font-size: 1.4rem;
  }

  .nav-link:hover {
    background-color: #ccc;
  }
  .nav-link.active {
    color: #ff8b66;
    border-bottom: 0.1rem solid transparent;
    background: #feefe3;
  }

  .nav-link:hover:after {
    border: #ff8b66;
    border-radius: 0.2.5rem 0;
  }
`;

export const MenuBar = styled(Navbar)`
  padding: 0 !important;
  height: 6.4rem;
  border-bottom: 0.1rem solid #ccc;
  box-shadow: 0rem 0.2rem 0.5rem rgba(0, 0, 0, 0.25);
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  z-index: 2;
`;

export const MenuList = styled(Nav)`
  height: inherit;
`;

export const MenuItem = styled(NavLink)`
  position: relative;
  display: flex;
  align-items: center;
  text-decoration: none;
  padding: 0 2.4rem;
  color: #000;
  font-size: 1.6rem;
  font-weight: 600;
  border-bottom: 0.1rem solid transparent;
  :hover {
    background-color: #ccc;
    color: #000;
  }
  :after {
    content: "";
    position: absolute;
    bottom: -0.2rem;
    left: 0rem;
    width: 100%;
    height: 0rem;
    border-top: 0.4rem solid transparent;
    border-radius: 2.5rem 2.5rem 0 0;
  }
  &.active {
    color: #584491 !important;
  }
  &.active:after {
    border-color: #584491 !important;
  }
  &.active:hover:after {
    border-top: 0.5rem solid;
  }
`;

export const UserAvatar = styled(Avatar)`
  text-decoration: none;
`;
