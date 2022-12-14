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
  return response.data;
};

export const GetOnePresentation = async id => {
  var accessToken = localStorage.getItem("accessToken");
  var response = await AxiosInstance.get(`/presentation/${id}`, {
    headers: {
      x_authorization: accessToken
    }
  });
  return response;
};

export const getSlidesFromPresentation = async id => {
  var accessToken = localStorage.getItem("accessToken");
  var response = await AxiosInstance.get(`/slide/${id}`, {
    headers: {
      x_authorization: accessToken
    }
  });
  return response;
};

export const AddPresentation = async request => {
  if (!request.presentationName || request.presentationName.trim() == "") {
    return null;
  }
  var requestData = {
    name: request.presentationName
  };
  var response = await AxiosInstance.post("presentation", requestData, {
    headers: {
      x_authorization: localStorage.getItem("accessToken")
    }
  });
  return response.data;
};

export const DeletePresentation = async request => {
  var presentationIdList = request.presentationIdList;
  if (!presentationIdList) {
    return null;
  }
  var response = [];
  for (const presentationId of presentationIdList) {
    var result = await AxiosInstance.delete(`presentation/${presentationId}`, {
      headers: {
        x_authorization: localStorage.getItem("accessToken")
      }
    });
    response.push(result);
    return response;
  }
};

export const DeleteManyPresentation = async () => {
  // var requestData ={request};
  // var response = await AxiosInstance.delete(`presentation`, requestData, {
  //   headers: {
  //     x_authorization: localStorage.getItem("accessToken")
  //   }
  // });
  // return response;
  return true;
};

// #endregion
