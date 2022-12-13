import axios from "axios";
import { ApiConfig as _ParamConfig } from "../../actions/constants";
let AxiosInstance = axios.create({
  baseURL: _ParamConfig.serverUrl,
  timeout: _ParamConfig.timeout
});

// #region Main methods

export const GetAllPresentations = async () => {
  var accessToken = localStorage.getItem("accessToken");
  var response = await AxiosInstance.get("/presentation", {
    headers: {
      x_authorization: accessToken
    }
  });
  // var response = await axios.get("http://localhost:5000/presentation", {
  //   headers: {
  //     x_authorization: accessToken
  //   }
  // });
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
