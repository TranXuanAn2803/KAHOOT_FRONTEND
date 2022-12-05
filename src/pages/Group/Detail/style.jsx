import styled from "styled-components";
import { NavLink } from "react-router-dom";

export const StyledNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #000;
  font-size: 1.4rem;
  font-weight: bold;
  border-bottom: none;
  &.active {
    color: #009e58 !important;
  }
`;
