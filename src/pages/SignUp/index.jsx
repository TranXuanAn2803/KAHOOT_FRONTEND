import React, { useEffect, useState, useContext } from "react";
import Styled from "./style";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { registerUser } from "../../utils/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginUserWithGoogle } from "../../utils/api";
import GoogleLoginButton from "../../components/GoogleLogin/GoogleLoginButton";
import UserContext from "../../utils/UserContext";
import { isAuthenticated } from "../../utils/AuthService";
const SignUp = () => {
  const [showPwd, setShowPwd] = useState(false);
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useContext(UserContext);
  useEffect(() => {
    // console.log("currentUser log up ", currentUser);
    if (currentUser != undefined) {
      navigate("/home");
    }
  });
  const SignUpSchema = Yup.object({
    username: Yup.string().min(3, "Minimum 3 characters").required("Username required"),
    email: Yup.string()
      .email("Not a proper email")
      .min(10, "Minimum 10 characters")
      .required("Email required"),
    password: Yup.string()
      .required("No password provided.")
      .min(8, "Password is too short - should be at least 8 characters")
      .matches(/^(?=.*[A-Z])/, "Must contain at least one uppercase character")
      .matches(/^(?=.*[0-9])/, "Must contain at least one number")
      .matches(/^(?=.*[!@#%&])/, "Must contain at least one special character")
  });
  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: ""
    },
    validationSchema: SignUpSchema,
    onSubmit: async (value) => {
      // console.log("sign up submit ", value);
      const data = await registerUser(value.username, value.email, value.password);
      // console.log("data register ", data);
      if (data.status != 200) {
        // alert(data.data);
        toast.error(data.data, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          theme: "light"
        });
        return;
      }
      const userResponse = data.data.username;
      // user have successfully register
      // alert(`User ${userResponse} have successfully signed up`);
      const msg = `User ${userResponse} have successfully signed up`;
      toast.success(msg, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "light"
      });
      navigate("/signin");
    }
  });
  const responseGoogle = async (response) => {
    console.log("response google ", response);
    const res = await loginUserWithGoogle(response.tokenId);
    const { data, status } = res;

    if (status != 200) {
      toast.error(data, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "light"
      });
    } else {
      const { accessToken, refreshToken, msg } = data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      toast.success(msg, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "light"
      });
      let cuser = await isAuthenticated();
      // console.log("cuser ", cuser);
      if (cuser?.user != undefined) {
        setCurrentUser(cuser.user);
      }
      navigate("/home");
    }
  };
  useEffect(() => {
    document.title = "Sign Up - Realtime quiz-based learning";
    document.getElementById("root").style.backgroundImage = `url("./assets/images/universe.jpg")`;
    document.getElementById("root").style.backgroundSize = `cover`;
    document.getElementById("root").style.backgroundRepeat = `no-repeat`;
    return () => {
      document.getElementById("root").style.backgroundImage = "url";
    };
  });
  return (
    <Styled>
      {/* <div className="header">
        <img src="./assets/images/kahoot.png" className="header-img" alt="kahoot" />
      </div> */}
      <div className="signup-container">
        <main className="signup-main">
          <div className="main-container">
            <div className="auth-form">
              <div className="card-container">
                <h2>Sign up</h2>
                <form
                  className="form-login"
                  method="post"
                  onSubmit={formik.handleSubmit}
                  autoComplete="off">
                  <div className="input-box">
                    <label htmlFor="username" className="input-label">
                      Username
                    </label>
                    <input
                      id="username"
                      name="username"
                      value={formik.values.username}
                      onChange={formik.handleChange}
                      type="text"
                      placeholder="Input username"
                      className="input-text"
                      autoComplete="false"
                    />
                    {formik.errors.username && formik.touched.username && (
                      <p className="error-message">{formik.errors.username}</p>
                    )}
                  </div>
                  <div className="input-box">
                    <label htmlFor="email" className="input-label">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      type="text"
                      placeholder="Input email"
                      className="input-text"
                    />
                    {formik.errors.email && formik.touched.email && (
                      <p className="error-message">{formik.errors.email}</p>
                    )}
                  </div>
                  <div className="input-box">
                    <label htmlFor="password" className="input-label">
                      Password
                    </label>
                    <div className="pwd-container">
                      <input
                        id="password"
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        type={showPwd ? "text" : "password"}
                        placeholder="Input password"
                        className="input-text"
                      />
                      <div className="pwd-action" onClick={() => setShowPwd(!showPwd)}>
                        <div className="pwd-img">
                          {showPwd == false ? (
                            <VisibilityOutlinedIcon />
                          ) : (
                            <VisibilityOffOutlinedIcon />
                          )}
                        </div>
                      </div>
                    </div>
                    {formik.errors.password && formik.touched.password && (
                      <p className="error-message">{formik.errors.password}</p>
                    )}
                  </div>
                  <button type="submit" className="signup-btn">
                    Sign up
                  </button>
                </form>
                <div className="auth-split">
                  <hr className="card-line" />
                  <span className="card-text">or</span>
                </div>
                <div className="single-sign-on">
                  <GoogleLoginButton responseGoogle={responseGoogle} />
                </div>
                <p className="redirect-signup">
                  Already have an account?
                  <a href="/signin">Sign in</a>
                </p>

                <p className="text-disclaimer">
                  By signing up, you accept our Terms and Conditions. Please read our Privacy Policy
                  and Children’s Privacy Policy.
                </p>
                <p className="text-disclaimer">
                  I understand that I can withdraw my consent at any time and the withdrawal will
                  not affect the lawfulness of the consent before its withdrawal, as described in
                  the Kahoot! Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </Styled>
  );
};

export default SignUp;
