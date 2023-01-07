import styled from "styled-components";

const Styled = styled.div`
  .header-left {
    display: flex;
    flex-direction: row;
    gap: 20px;
    align-items: center;
  }
  .header-left div:nth-child(1) {
    cursor: pointer;
  }
`;

export default Styled;
