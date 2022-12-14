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
  var response = await AxiosInstance.get(`/slide/by-present/${id}`, {
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
  return {
    status: response.status,
    data: response.data.presentation,
    message: response.data.message || null
  };
};

export const DeletePresentation = async request => {
  var presentationId = request.presentationId;
  if (!presentationId || presentationId.trim() == "") {
    return null;
  }
  console.log("delete presentationid ", presentationId);

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

export const DeleteManyPresentation = async request => {
  var requestData = { id: request.presentationIdList };
  var response = await AxiosInstance.delete(`presentation`, {
    data: requestData,
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

export const CreateSlide = async request => {
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
