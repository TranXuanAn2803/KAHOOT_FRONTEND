import axios from "axios";
import { ApiConfig as _ParamConfig } from "../../actions/constants";

let AxiosInstance = axios.create({
  baseURL: _ParamConfig.serverUrl,
  timeout: _ParamConfig.timeout
});

// #region private methods

export const PostAsync = async (method, requestData) => {
  var response = await AxiosInstance.post(method, requestData, {
    headers: {
      x_authorization: localStorage.getItem("accessToken")
    }
  });
  return response.data;
};

// #endregion

// #region Main methods

export const GetUserInfo = async (username) => {
  try {
    var requestData = {
      Username: username
    };
    var request = {
      Method: "GETPROFILE",
      RequestData: JSON.stringify(requestData)
    };
    const GetUserInfoResponse = await PostAsync("users/profile", request);
    return GetUserInfoResponse;
  } catch (error) {
    console.error(error);
  }
};

export const UpdateUserProfile = async (user) => {
  try {
    var requestData = {
      Id: user._id,
      Username: user.username,
      Email: user.email,
      Name: user.name
    };
    var request = {
      Method: "UpdateProfile",
      RequestData: JSON.stringify(requestData)
    };
    const UpdateUserProfileResponse = await PostAsync("users/profile", request);
    return UpdateUserProfileResponse;
  } catch (error) {
    console.error(error);
  }
};
// #endregion
