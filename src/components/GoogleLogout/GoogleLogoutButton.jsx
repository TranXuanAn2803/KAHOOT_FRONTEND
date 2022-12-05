import React, { memo } from "react";
import { GoogleLogout } from "react-google-login";
import { GOOGLE_CLIENT_ID } from "../../actions/constants";

const GoogleLogoutButton = (props) => (
  <GoogleLogout
    clientId={GOOGLE_CLIENT_ID}
    buttonText="Logout Google"
    onLogoutSuccess={() => props.logout()}
    onLogoutFailure={(err) => console.log(err)}
  />
);

export default memo(GoogleLogoutButton);
