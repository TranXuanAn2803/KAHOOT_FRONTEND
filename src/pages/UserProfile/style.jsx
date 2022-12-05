import styled from "styled-components";
import Button from "react-bootstrap/Button";
import { OutlinedInput, InputLabel, Input, Tooltip } from "@mui/material";
import { Modal } from "react-bootstrap";
import { TextField } from "formik-mui";

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

export const StyledInput_ = styled(Input)`
  font-size: 1.4rem !important;
`;

export const StyledInput = styled(TextField)`
  font-size: 1.4rem !important;

  .MuiFormLabel-root {
    font-size: 1.4rem !important;
    padding-right: 0.5rem !important;
    background: white !important;
  }

  .MuiInputBase-input {
    font-size: 1.4rem !important;
  }

  .MuiFormHelperText-root {
    font-size: 1.3rem !important;
  }
`;

export const StyleInputLabel = styled(InputLabel)`
  font-size: 1.5rem !important;
  font-weight: bold !important;
`;

export const StyledModal = styled(Modal)``;

export const StyledOutlinedInputLabel = styled(InputLabel)`
  font-size: 1.5rem !important;
  background: #fff;
  padding: 0.2rem 0.6rem 0.2rem 0.4rem !important;
  font-weight: bold !important;
  line-height: 1.3 !important;
`;

export const StyledOutlinedInput = styled(OutlinedInput)`
  font-size: 1.5rem !important;
`;

export const StyledTooltip = styled(Tooltip)`
`;
