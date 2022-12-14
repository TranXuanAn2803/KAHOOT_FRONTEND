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