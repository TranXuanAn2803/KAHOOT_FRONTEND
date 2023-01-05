import axios from "axios";
import { ApiConfig as _ParamConfig } from "../../actions/constants";

let AxiosInstance = axios.create({
  baseURL: _ParamConfig.serverUrl,
  timeout: _ParamConfig.timeout
});

// #region private methods

const PostAsync = async (method, requestData) => {
  var response = await AxiosInstance.post(method, requestData, {
    headers: {
      x_authorization: localStorage.getItem("accessToken")
    }
  });
  return response.data;
};

// #endregion

export const CreateNewPresentingSession = async (data) => {
  try {
    const { PresentationId, GroupId, HostId, IsLive, Type } = data;
    var requestData = {
      PresentationId,
      Type,
      GroupId,
      HostId,
      AnswerList: [],
      ParticipantList: [],
      IsLive
    };
    var request = {
      Method: "CreateSession",
      RequestData: JSON.stringify(requestData)
    };
    const CreatePresentingSessionResponse = await PostAsync("session", request);
    return CreatePresentingSessionResponse;
  } catch (error) {
    console.error(error);
  }
};

export const GetPresentingSession = async (data) => {
  try {
    const { Id } = data;
    var requestData = {
      Id
    };
    var request = {
      Method: "GetSession",
      RequestData: JSON.stringify(requestData)
    };
    const GetPresentingSessionResponse = await PostAsync("session", request);
    return GetPresentingSessionResponse;
  } catch (error) {
    console.error(error);
  }
};

export const UpdatePresentingSession = async (data) => {
  try {
    const { Id, PresentationId, GroupId, HostId, ParticipantList, IsLive } = data;
    var requestData = {
      Id,
      PresentationId,
      GroupId,
      HostId,
      ParticipantList,
      IsLive
    };
    var request = {
      Method: "UpdateSession",
      RequestData: JSON.stringify(requestData)
    };
    const UpdatePresentingSessionResponse = await PostAsync("session", request);
    return UpdatePresentingSessionResponse;
  } catch (error) {
    console.error(error);
  }
};
