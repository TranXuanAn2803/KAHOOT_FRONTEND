import styled from "styled-components";
import { Menu } from "antd";

export const Styled = styled.div`
  .show_presentation-container {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .on-row {
    display: flex;
    flex-direction: row;
    gap: 20px;
  }
`;

export const StyleMenu = styled(Menu)`
  width: fit-content;
  max-width: 4rem;
  display: inline;
  z-index: 2;
  position: absolute;
  bottom: -25rem;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-90deg);
  transition: bottom 0.1s linear;
  border-radius: 0.4rem;
  &:hover {
    bottom: -22rem;
  }
`;

export const StyledOption = styled.div``;
