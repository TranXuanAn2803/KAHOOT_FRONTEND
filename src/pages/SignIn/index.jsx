import React, { useState, useEffect, useContext } from "react";
import Styled from "./style";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { loginUser, loginUserWithGoogle } from "../../utils/api";
import { useGoogleLogin, GoogleLogin } from "react-google-login";
import { refreshTokenSetup } from "../../utils/refreshToken";
import { toast } from "react-toastify";
import { GOOGLE_CLIENT_ID } from "../../actions/constants";
import GoogleLoginButton from "../../components/GoogleLogin/GoogleLoginButton";
import UserContext from "../../utils/UserContext";
import { isAuthenticated } from "../../utils/AuthService";
export const SignIn = function () {
  const [showPwd, setShowPwd] = useState(false);
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useContext(UserContext);

  useEffect(() => {
    // console.log("currentUser log in ", currentUser);
    if (currentUser != undefined) {
      navigate("/home");
    }
  }, [currentUser]);
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
  const signInSchema = Yup.object({
    username: Yup.string().min(3, "Minimum 3 characters").required("Username required"),
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
      password: ""
    },
    validationSchema: signInSchema,
    onSubmit: async (value) => {
      // console.log("value submit ", value);
      try {
        const responseSignIn = await loginUser(value.username, value.password);
        const { data, status } = responseSignIn;

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
      } catch (err) {
        throw err;
      }
    }
  });
  const onSuccess = (res) => {
    console.log("Login Success: currentUser:", res.profileObj);
    refreshTokenSetup(res);
  };

  const onFailure = (res) => {
    console.log("Login failed: res:", res);
  };
  const { signInWithGoogle } = useGoogleLogin({
    onSuccess,
    onFailure,
    GOOGLE_CLIENT_ID,
    isSignedIn: true,
    accessType: "offline"
    // responseType: 'code',
    // prompt: 'consent',
  });
  useEffect(() => {
    document.title = "Sign in - Realtime quiz-based learning";
    // document.getElementById("root").style.backgroundImage = `url("./assets/images/universe.jpg")`;
    // document.getElementById("root").style.backgroundSize = `cover`;
    // document.getElementById("root").style.backgroundRepeat = `no-repeat`;
    document.body.style.backgroundImage = `url("./assets/images/universe.jpg")`;
    document.body.style.backgroundSize = `cover`;
    document.body.style.backgroundRepeat = `no-repeat`;

    return () => {
      document.body.style.backgroundImage = "url";
    };
  });
  return (
    <Styled>
      <div className="signin-container">
        <main className="signin-main">
          <div className="main-container">
            <div className="auth-form">
              <div className="card-container">
                <h2>Log in</h2>
                <form
                  className="form-login"
                  method="post"
                  onSubmit={formik.handleSubmit}
                  autoComplete="on">
                  <div className="input-box">
                    <label htmlFor="username" className="input-label">
                      Username or email
                    </label>
                    <input
                      id="username"
                      name="username"
                      value={formik.values.username}
                      onChange={formik.handleChange}
                      type="text"
                      placeholder="Input username"
                      className="input-text"
                    />
                    {formik.errors.username && formik.touched.username && (
                      <p className="error-message">{formik.errors.username}</p>
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
                  <button type="submit" className="login-btn">
                    Log in
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
                  Don't have an account?
                  <a href="/signup">Sign up</a>
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
