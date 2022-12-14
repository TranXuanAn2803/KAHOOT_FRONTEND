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
  console.log(response);

  return {
    status: response.status,
    data: response.data.data,
    message: response.data.message || null
  };
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
<<<<<<< HEAD
  return response.data;
};

export const DeletePresentation = async request => {
  var presentationIdList = request.presentationIdList;
  if (!presentationIdList) {
=======
  return {
    status: response.status,
    data: response.data.presentation,
    message: response.data.message || null
  };
};

export const DeletePresentation = async (request) => {
  var presentationId = request.presentationId;
  if (!presentationId || presentationId.trim() == "") {
>>>>>>> fff2693b9b2898be946f884fc72e2d6aa52a38dc
    return null;
  }
  var response = await AxiosInstance.delete(`presentation/${presentationId}`, {
    headers: {
      x_authorization: localStorage.getItem("accessToken")
    }
  });
  console.log(response);
  return {
    status: response.status,
    data: response.data.data,
    message: response.data.message || null
  };
};

export const DeleteManyPresentation = async () => {
  // var requestData ={request};
  // var response = await AxiosInstance.delete(`presentation`, requestData, {
  //   headers: {
  //     x_authorization: localStorage.getItem("accessToken")
  //   }
  // });
<<<<<<< HEAD
  // return response;
  return true;
=======
  //  return { status: response.status, data: response.data.data, message: response.data.message || null };
  return { status: 200 };
>>>>>>> fff2693b9b2898be946f884fc72e2d6aa52a38dc
};

export const CreateSlide = async (request) => {
  var requestData = {
    presentation_id: request.presentationId,
    index: request.index
  };
  var response = await AxiosInstance.post(`slide`, requestData, {
    headers: {
      x_authorization: localStorage.getItem("accessToken")
    }
  });
  return {
    status: response.status,
    data: response.data.data,
    message: response.data.message || null
  };
};
// #endregion
