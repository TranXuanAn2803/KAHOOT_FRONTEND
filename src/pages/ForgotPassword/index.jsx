import React from "react";
import { Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { Styled } from "./style";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { sendChangePasswordMail } from "../../utils/api";
const ForgotPassword = () => {
  const forgotSchema = Yup.object({
    email: Yup.string().email("Not a valid email").required("No email provided")
  });
  const formik = useFormik({
    initialValues: {
      email: ""
    },
    validationSchema: forgotSchema,
    onSubmit: async (value) => {
      try {
        console.log("value ", value);
        const email = value.email;
        const response = await sendChangePasswordMail(email);
        console.log("response return ", response);
        const { data, status } = response;
        console.log("data ", data, status);
        if (status == 200) {
          toast.success(data, {});
        } else {
          toast.error(data, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            theme: "light"
          });
        }
      } catch (err) {
        console.log("error ", err);
      }
    }
  });
  return (
    <Styled>
      <div className="background">
        <div className="forgotPassword-container">
          <h1 className="forgot-title">Reset your password</h1>
          <div className="forgot-card">
            <form
              className="card-form"
              method="post"
              onSubmit={formik.handleSubmit}
              autoComplete="on">
              <div className="input-box">
                <label htmlFor="email" className="input-label">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  type="email"
                  placeholder="Enter email address..."
                  className="input-text"
                />
                {formik.errors.email && formik.touched.email && (
                  <p className="error-message">{formik.errors.email}</p>
                )}
              </div>
              <button type="submit" disabled={!formik.isValid} className="forgot-btn">
                Send reset link
              </button>
            </form>
            <hr className="card-hr" />
            <a className="card-backToLogin" href="/signin">
              Back to log in
            </a>
          </div>
        </div>
      </div>
    </Styled>
  );
};
export default ForgotPassword;
