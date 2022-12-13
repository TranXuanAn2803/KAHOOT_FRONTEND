import axios from "axios";
import { ApiConfig as _ParamConfig } from "../../actions/constants";
let AxiosInstance = axios.create({
  baseURL: _ParamConfig.serverUrl,
  timeout: _ParamConfig.timeout
});

// #region private methods

// const PostAsync = async (method, requestData) => {
//   var response = await AxiosInstance.post(method, requestData, {
//     headers: {
//       x_authorization: localStorage.getItem("accessToken")
//     }
//   });
//   return response.data;
// };

// #endregion

// #region Main methods

export const GetAllPresentations = async () => {
  var accessToken = localStorage.getItem("accessToken");
  var response = await AxiosInstance.get("presentation", null, {
    headers: {
      x_authorization: accessToken
    }
  });
  return response.data;
};

export const AddPresentation = async request => {
  var requestData = {
    name: request.presentationName
  };
  var response = await AxiosInstance.post("presentation", requestData, {
    headers: {
      x_authorization: localStorage.getItem("accessToken")
    }
  });
  console.log(response);
  return response.data;
};
// #endregion
