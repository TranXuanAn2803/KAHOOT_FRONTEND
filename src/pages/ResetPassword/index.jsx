import React, { useEffect } from "react";
import { Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { Styled } from "./style";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { findUserByResetPasswordCode, changePassword } from "../../utils/api";
import { useParams, useNavigate } from "react-router-dom";
const ResetPassword = () => {
  const { resetPasswordToken } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    findUserByResetPasswordCode(resetPasswordToken)
      .then((data) => {
        console.log("Data return ", data);
      })
      .catch((err) => {
        console.log("error while find user ", err);
        navigate("/signin");
      });
  }, []);
  const changePasswordSchema = Yup.object({
    password: Yup.string()
      .required("No password provided.")
      .min(8, "Password is too short - should be at least 8 characters")
      .matches(/^(?=.*[A-Z])/, "Must contain at least one uppercase character")
      .matches(/^(?=.*[0-9])/, "Must contain at least one number")
      .matches(/^(?=.*[!@#%&])/, "Must contain at least one special character"),
    confirmPassword: Yup.string()
      .required("No confirm password provided.")
      .min(8, "Password is too short - should be at least 8 characters")
      .matches(/^(?=.*[A-Z])/, "Must contain at least one uppercase character")
      .matches(/^(?=.*[0-9])/, "Must contain at least one number")
      .matches(/^(?=.*[!@#%&])/, "Must contain at least one special character")
  });
  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: ""
    },
    validationSchema: changePasswordSchema,
    onSubmit: async (value) => {
      try {
        const password = value.password;
        const confirmPassword = value.confirmPassword;
        if (password != confirmPassword) {
          toast.error("Confirm password must be same as password", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            theme: "light"
          });
        } else {
          changePassword(password, resetPasswordToken)
            .then((data) => {
              toast.success(data, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                theme: "light"
              });
              navigate("/signin");
            })
            .catch((err) => {
              console.log("error", err);
              toast.error(err, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                theme: "light"
              });
            });
        }
        // const email = value.email;
        // const response = await sendChangePasswordMail(email);
        // console.log("response return ", response);
        // const { data, status } = response;
        // console.log("data ", data, status);
        // if (status == 200) {
        //   toast.success(data, {});
        // } else {
        //   toast.error(data, {
        //     position: "top-right",
        //     autoClose: 2000,
        //     hideProgressBar: false,
        //     closeOnClick: true,
        //     pauseOnHover: false,
        //     draggable: true,
        //     theme: "light"
        //   });
        // }
      } catch (err) {
        console.log("error ", err);
      }
    }
  });
  return (
    <Styled>
      <div className="background">
        <div className="forgotPassword-container">
          <h1 className="forgot-title">Change your password</h1>
          <div className="forgot-card">
            <form
              className="card-form"
              method="post"
              onSubmit={formik.handleSubmit}
              autoComplete="on">
              <div className="input-box">
                <label htmlFor="password" className="input-label">
                  New Password
                </label>
                <input
                  id="password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  type="password"
                  placeholder="Enter password..."
                  className="input-text"
                  autoComplete="true"
                />
                {formik.errors.password && formik.touched.password && (
                  <p className="error-message">{formik.errors.password}</p>
                )}
              </div>
              <div className="input-box">
                <label htmlFor="confirmPassword" className="input-label">
                  Confirm password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  type="password"
                  placeholder="Enter confirm password..."
                  className="input-text"
                  autoComplete="true"
                />
                {formik.errors.confirmPassword && formik.touched.confirmPassword && (
                  <p className="error-message">{formik.errors.confirmPassword}</p>
                )}
              </div>
              <button type="submit" className="forgot-btn">
                Change password
              </button>
            </form>
          </div>
        </div>
      </div>
    </Styled>
  );
};
export default ResetPassword;
