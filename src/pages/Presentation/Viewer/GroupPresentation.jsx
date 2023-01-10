import React, { useEffect, useState, useContext } from "react";
import { Layout } from "antd";
import Styled from "../style";
import { getSessionId } from "../API";
import { GetCurrentSlide, GetSlideByPresentationAndIndex } from "../api/Session.Api";
import { SocketContext } from "../../../components/Socket/socket-client";
import LoadingScreen from "react-loading-screen";
import { useNavigate, useParams } from "react-router-dom";
import { fetchUsers } from "../../../utils/api";
import { ChatScreen, PresentForViewer, QuestionScreen } from "./component";
const { Header, Footer, Sider, Content } = Layout;

export const GroupPresentation = (props) => {
  const { groupId, presentationId } = useParams();
  const [user, setUser] = useState({});
  const [sessionId, setSessionId] = useState("");
  const [currentSlideIndex, setCurrentSlideIndex] = useState(1);
  const [currentSlide, setCurrentSlide] = useState(null);
  const [isFinalSlide, setIsFinalSlide] = useState(false);
  const socket = useContext(SocketContext);
  const [messageList, setMessageList] = useState([]);
  const [questionList, setQuestionList] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState("");

  const navigate = useNavigate();

  if (!user) {
    navigate("/signin");
  }

  useEffect(() => {
    document.getElementById("main").style.backgroundColor = "rgb(56, 18, 114)";
    return () => {
      document.getElementById("main").style.backgroundColor = "white";
    };
  });
  useEffect(() => {
    const SetUser = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        return null;
      }
      const response = await fetchUsers(accessToken);
      if (response && response.user != null) {
        setUser(response.user);
      }
    };
    getSessionId(presentationId, groupId)
      .then((getSessionIdResponse) => {
        console.log("getSessionId response", getSessionIdResponse);
        if (getSessionIdResponse.status != 200) {
          throw new Error("Fail to get session");
        }
        setSessionId(getSessionIdResponse.data.data.session);
        var request = {
          sessionId: getSessionIdResponse.data.data.session,
          presentationId: presentationId
        };
        GetCurrentSlide(request)
          .then((GetCurrentSlideResponse) => {
            setCurrentSlideIndex(GetCurrentSlideResponse.data.data.current_slide);
          })
          .catch((error) => {
            console.log("GetCurrentSlide error:", error.message);
            throw new Error("cant get current slide");
          });
      })
      .catch((error) => {
        console.log("getSessionId error:", error.message);
      });

    SetUser();
  }, []);
  useEffect(() => {
    socket.emit("init-game", {
      id: presentationId,
      groupId: groupId,
      user: user
    });
    console.log("init game");
  }, [sessionId]);
  useEffect(() => {
    socket.on("connect", () => {
      console.log("socket: ", socket);
    });
    socket.on("slide-changed", (response) => {
      console.log("response ", response);
      if (response.status == 200) {
        setCurrentSlideIndex(response.data.current_slide);
      }
    });
    return () => {
      socket.off("connect");
      socket.off("slide-changed");
      socket.off("get-answer-from-player");
    };
  }, []);
  useEffect(() => {
    if (
      presentationId == "" ||
      presentationId.trim() == "" ||
      Number.isNaN(currentSlideIndex) ||
      currentSlideIndex < 1
    ) {
      return;
    } else {
      console.log("get slide by current");
      var request = {
        slideIndex: currentSlideIndex,
        presentationId: presentationId
      };
      GetSlideByPresentationAndIndex(request)
        .then((response) => {
          if (response.success == false) {
            console.log("failed:", response.message);
            return;
          }
          setIsFinalSlide(response.isFinalSlide);
          setCurrentSlide(response.slide);
        })
        .catch((error) => {
          console.log("error:", error);
        });
    }
  }, [currentSlideIndex]);

  return (
    <>
      <LoadingScreen
        loading={currentSlideIndex < 1}
        bgColor="#fffff"
        spinnerColor="#fff"
        textColor="#fff"
        text="Please waiting for the host to start">
        <Styled>
          <Layout>
            <PresentForViewer
              slide={currentSlide}
              socket={socket}
              presentationId={presentationId}
              username={user.username || ""}
              isFinalSlide={isFinalSlide}
              sessionId={sessionId}
            />
          </Layout>
        </Styled>
      </LoadingScreen>
      <ChatScreen
        currentMessage={currentMessage}
        setCurrentMessage={setCurrentMessage}
        messageList={messageList}
        setMessageList={setMessageList}
        sendMessage={sendMessage}
      />
      <QuestionScreen
        questionList={questionList}
        setQuestionList={setQuestionList}
        currentQuestion={currentQuestion}
        setCurrentQuestion={setCurrentQuestion}
        sendQuestion={sendQuestion}
        upVote={upVote}
        markQuestion={markQuestion}
      />
    </>
  );
};

const sendMessage = () => {
  console.log("currentMessage ", currentMessage);
  if (currentMessage.trim() !== "") {
    socket.emit("add-chat-message", {
      id: sessionId,
      presentationId,
      username,
      message: currentMessage
    });
  }
};
const sendQuestion = () => {
  console.log("currentQuestion ", currentQuestion);
  if (currentQuestion.trim() !== "") {
    socket.emit("add-question", {
      id: sessionId,
      presentationId,
      username,
      content: currentQuestion
    });
  }
};
const upVote = (questionId) => {
  if (questionId != undefined && questionId != "") {
    socket.emit("upvote-question", { id: sessionId, presentationId, questionId });
  }
};
const markQuestion = async (questionId) => {
  console.log("questionId ", questionId);
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken || accessToken == "") {
    printMessage(400, "Sorry you must be owner or co-owner to mark this question");
  } else {
    const user = await fetchUsers(accessToken);
    socket.emit("mark-answered-question", {
      id: sessionId,
      presentationId,
      questionId,
      user: user.user
    });
  }
};
