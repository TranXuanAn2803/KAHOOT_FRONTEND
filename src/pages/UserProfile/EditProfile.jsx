import React, { useContext, useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Box from "@mui/material/Box";
import { StyledButton, StyledInput, StyledModal, StyledTooltip } from "./style";
import EditIcon from "@mui/icons-material/Edit";
import * as Yup from "yup";
import { Field, Formik } from "formik";
import { toast as Toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

import { GetUserInfo, UpdateUserProfile } from "./ProfileApi";
import UserContext from "../../utils/UserContext";
import { isAuthenticated } from "../../utils/AuthService";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const EditProfileSchema = Yup.object({
  id: Yup.string().required("id is required"),
  username: Yup.string().required("Username required").min(3, "Minimum 3 characters"),
  name: Yup.string().min(10, "Name must include at least 10 characters."),
  email: Yup.string()
    .required("Email is a required field.")
    .email("Invalid Email")
    .min(10, "Minimum 10 characters")
});

const userProfileDefault = {
  id: "",
  username: "",
  email: "",
  name: ""
};

export const EditProfileScreen = (props) => {
  // #region Khởi tạo giá trị

  const [hasChanges, setHasChanges] = useState(false);
  const [modalShow, setModalShow] = React.useState(false);
  // const [userProfile, setUserProfile] = useState(userProfileDefault);
  const [currentUser, setCurrentUser] = useContext(UserContext);
  const navigate = useNavigate();

  //#endregion
  // # region Handler

  const handleHasChanges = (event) => {
    setHasChanges(true);
  };

  // #endregion

  return (
    <div>
      <Formik
        enableReinitialize
        initialValues={currentUser || userProfileDefault}
        validationSchema={EditProfileSchema}
        onSubmit={async (values, { setSubmitting }) => {
          await sleep(500);
          setSubmitting(false);
          const updateUserProfileResponse = await UpdateUserProfile(values);
          console.log("update user profile response ", updateUserProfileResponse);
          let cuser = await isAuthenticated();
          console.log("cuser ", cuser);
          if (cuser?.user != undefined) {
            setCurrentUser(cuser.user);
          }
          if (updateUserProfileResponse.Code == 1) {
            Toast.success("Update successfully", {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: true,
              theme: "light"
            });
            setCurrentUser(values);
          } else {
            Toast.error(`Update fail ${updateUserProfileResponse.Description}`, {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: true,
              theme: "light"
            });
          }
          // handle axios api
        }}>
        {({ isValid, handleChange, handleBlur, handleSubmit }) => (
          <Box
            component="form"
            style={{ fontSize: "1.4rem !important", maxWidth: "500px", margin: "auto" }}
            autoComplete="off"
            onSubmit={handleSubmit}>
            <Card>
              <Card.Header
                className="d-flex justify-content-between align-items-center"
                style={{ fontWeight: "600", padding: "1.2rem" }}>
                <div>User Information</div>
                <StyledButton variant="primary" type="submit" disabled={!(hasChanges && isValid)}>
                  Save
                </StyledButton>
              </Card.Header>
              <Card.Body style={{ padding: "2.4rem 1.2rem" }}>
                <div className="d-flex align-items-center mb-5">
                  <Field
                    component={StyledInput}
                    name="username"
                    id="username"
                    label="Username"
                    variant="standard"
                    fullWidth={true}
                    sx={{ marginRight: "1rem" }}
                    className="flex-fill"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled
                  />
                  <StyledTooltip
                    title={
                      <React.Fragment>
                        <span style={{ fontSize: "1.2rem" }}>Change username</span>
                      </React.Fragment>
                    }
                    placement="top"
                    size="lg"
                    arrow
                    disableFocusListener={true}>
                    <StyledButton
                      variant="secondary"
                      className="align-self-stretch"
                      onClick={() => setModalShow(true)}>
                      <EditIcon sx={{ fontSize: "2rem" }} />
                    </StyledButton>
                  </StyledTooltip>
                </div>
                <Field
                  component={StyledInput}
                  name="name"
                  id="name-input"
                  label="Name"
                  variant="standard"
                  className="mb-5"
                  fullWidth={true}
                  onChangeCapture={handleHasChanges}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <Field
                  component={StyledInput}
                  id="mail-input"
                  name="email"
                  type="email"
                  label="Email"
                  variant="standard"
                  className="mb-5"
                  fullWidth={true}
                  onChangeCapture={handleHasChanges}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled
                />
              </Card.Body>
            </Card>
          </Box>
        )}
      </Formik>
      <EditUserNameModal show={modalShow} onHide={() => setModalShow(false)} />
    </div>
  );
};

const EditUserNameModal = (props) => {
  const [hasChanges, setHasChanges] = useState(false);
  const [currentUser, setCurrentUser] = useContext(UserContext);

  return (
    <Formik
      enableReinitialize
      initialValues={currentUser || userProfileDefault}
      validationSchema={Yup.object({
        id: Yup.string().required(),
        username: Yup.string().required().min(3, "Username must include at least 3 characters")
      })}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        await sleep(500);
        setSubmitting(false);
        const updateUserProfileResponse = await UpdateUserProfile(values);
        console.log(updateUserProfileResponse);
        let cuser = await isAuthenticated();
        console.log("cuser ", cuser);
        if (cuser?.user != undefined) {
          setCurrentUser(cuser.user);
        }
        if (updateUserProfileResponse.Code == 1) {
          Toast.success("Update successfully", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            theme: "light"
          });
          setCurrentUser(values);
          props.onHide();
        } else {
          Toast.error(`Update fail ${updateUserProfileResponse.Description}`, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            theme: "light"
          });
        }
      }}>
      {({ isSubmitting, resetForm, isValid, handleChange, handleBlur, handleSubmit }) => (
        <StyledModal
          {...props}
          aria-labelledby="contained-modal-title-vcenter"
          centered
          dialogClassName="modal-50w"
          onExiting={() => resetForm({})}>
          <Box
            component="form"
            style={{ fontSize: "1.4rem !important", margin: "auto" }}
            autoComplete="off"
            onSubmit={handleSubmit}>
            <StyledModal.Header closeButton style={{ padding: "2.4rem 2.4rem 0.8rem" }}>
              <StyledModal.Title id="contained-modal-title-vcenter">
                <div style={{ fontWeight: "600", fontSize: "2.4rem" }}>Change your username</div>
              </StyledModal.Title>
            </StyledModal.Header>
            <StyledModal.Body style={{ padding: "1rem 2.4rem" }}>
              <p style={{ paddingBottom: "0.8rem", fontSize: "1.4rem" }}>
                <b>Before changing your username, please read the following:</b>
                <br />
                You can only change your username once a year. Your old username will still appear
                in previous reports.
              </p>
              <Field
                component={StyledInput}
                name="username"
                id="username"
                label="Username"
                fullWidth={true}
                sx={{ marginBottom: "1rem" }}
                className="flex-fill"
                onChangeCapture={() => setHasChanges(true)}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </StyledModal.Body>
            <StyledModal.Footer className="justify-content-center py-4">
              <StyledButton variant="secondary" onClick={props.onHide}>
                Cancel
              </StyledButton>
              <StyledButton variant="success" type="submit" disabled={!(hasChanges && isValid)}>
                Change username
              </StyledButton>
            </StyledModal.Footer>
          </Box>
        </StyledModal>
      )}
    </Formik>
  );
};
