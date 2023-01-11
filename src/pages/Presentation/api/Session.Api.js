import axios from "axios";
import { ApiConfig as _ParamConfig } from "../../../actions/constants";
import { SlideType } from "../../../actions/constants";

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

export const GetCurrentSlide = async (request) => {
  let reqBodyData = {
    sessionId: request.sessionId
  };
  var presentationId = request.presentationId;
  const GetCurrentSlideResponse = await AxiosInstance.put(
    `presentation/presenting/slide/${presentationId}`,
    reqBodyData,
    {
      headers: {
        x_authorization: localStorage.getItem("accessToken")
      }
    }
  );
  return GetCurrentSlideResponse;
};

export const GetSlideByPresentationAndIndex = async (request) => {
  var index = request.slideIndex;
  if (Number.isNaN(index) || index < 0) {
    return {
      success: false,
      message: "Index is invalid or smaller than 0"
    };
  }
  var presentationId = request.presentationId;
  var GetSlideListResponse = await AxiosInstance.get(`slide/by-present/${presentationId}`, {
    headers: {
      x_authorization: localStorage.getItem("accessToken")
    }
  });

  if (GetSlideListResponse.status != 200) {
    return {
      success: false,
      message: "Failed"
    };
  }
  var slideList = GetSlideListResponse.data.data.slides;
  if (index <= slideList.length) {
    switch (slideList[index - 1].slide_type) {
      case "MULTIPLE_CHOICE":
        slideList[index - 1].type = SlideType.MultipleChoice;
        break;
      case "HEADING":
        slideList[index - 1].type = SlideType.Heading;
        break;
      case "PARAGRAPH":
        slideList[index - 1].type = SlideType.Paragraph;
        break;
      default:
        break;
    }
    return {
      success: true,
      isFinalSlide: index == slideList.Length, // đã hết slide
      slide: slideList[index - 1]
    };
  }
  return {
    success: false,
    message: "Oversize"
  };
};
