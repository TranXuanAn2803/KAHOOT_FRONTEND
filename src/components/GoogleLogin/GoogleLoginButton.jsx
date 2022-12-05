import React, { memo, useEffect } from "react";
import { GOOGLE_CLIENT_ID } from "../../actions/constants";
import { GoogleLogin } from "react-google-login";
import { gapi } from "gapi-script";
const GoogleLoginButton = props => {
  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        clientId: GOOGLE_CLIENT_ID,
        scope: ""
      });
    };
    gapi.load("client:auth2", initClient);
  }, []);
  return (
    <GoogleLogin
      clientId={GOOGLE_CLIENT_ID}
      buttonText="Continue with google"
      onSuccess={props.responseGoogle}
      onFailure={props.responseGoogle}
      cookiePolicy={"single_host_origin"}
      prompt="select_account"></GoogleLogin>
  );
};
export default memo(GoogleLoginButton);
