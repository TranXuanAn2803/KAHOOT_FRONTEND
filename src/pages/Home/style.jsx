import { Button } from "react-bootstrap";
import styled from "styled-components";

export const StyledButton = styled(Button)`
  padding: 0.6rem 2.4rem;
  font-size: 1.4rem;
  font-weight: 550;
  letter-spacing: 0.1rem;
  box-shadow: rgb(0 0 0 / 25%) 0px -4px inset;
  &:hover {
    box-shadow: rgb(0 0 0 / 25%) 0px -2px inset;
  }
`;