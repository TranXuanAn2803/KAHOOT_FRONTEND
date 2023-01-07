import { Layout, Divider, Modal } from "antd";
const { Header, Footer, Sider, Content } = Layout;
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Slide } from "../Slide";
import Container from "react-bootstrap/Container";
import { MenuItem as MenuBarItem, MenuBar, MenuList, StyledButton } from "../style";
import { ArrowLeftOutlined, PlayCircleOutlined, ShareAltOutlined } from "@ant-design/icons";
import Creator from "../../Creator";
import { useEffect, useContext } from "react";
import PresentationContext from "../../../utils/PresentationContext";
import { GetOnePresentation, savePresentationAPI } from "../api/Presentation.Api";
import { toggleStatusPresentation } from "../API";
import { toast } from "react-toastify";
import Styled from "./style";
import PresentPresentation from "../Present/presentPresentation";
export const EditPresentation = () => {
  const { presentationId } = useParams();
  const [modal, contextHolder] = Modal.useModal();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [presentationContext, setPresentationContext] = useContext(PresentationContext);
  const navigate = useNavigate();
  useEffect(() => {
    document.title = presentationContext.name;
    toggleStatusPresentation(presentationId, 1)
      .then((values) => {
        // Gỉa sử delete thành công

        toast.success(values.message, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          theme: "light"
        });
      })
      .catch((err) => {
        const values = err.response.data;
        toast.error(values, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          theme: "light"
        });
      });
    const getDataForPresentation = async () => {
      const value = await GetOnePresentation(presentationId);
      const arrPresentation = value.data.data;
      let newPresentation = {
        slideList: [],
        id: "",
        name: ""
      };
      newPresentation.id = arrPresentation._id;
      newPresentation.name = arrPresentation.name;

      for (let i = 0; i < arrPresentation.slides.length; i++) {
        const listOptions = arrPresentation.slides[i].options;
        let newListOptions = listOptions.map((item, index) => {
          return item.content;
        });
        newPresentation["slideList"].push({
          id: arrPresentation.slides[i].index,
          type: arrPresentation.slides[i].slide_type,
          question: arrPresentation.slides[i].question,
          options: newListOptions
        });
      }
      console.log("newPresentation ", newPresentation);
      setPresentationContext(newPresentation);
    };
    getDataForPresentation();
  }, []);
  const savePresentation = async () => {
    console.log("call savePresentation ", presentationContext);

    const request = {
      presentationId: presentationId,
      slides: presentationContext.slideList
    };
    const savePresentationResponse = await savePresentationAPI(request);
    if (savePresentationResponse && savePresentationResponse.status == 200) {
      // Gỉa sử delete thành công
      modal.info({
        title: "Notifications",
        content: (
          <>
            <p>{`Save presentations successfully.`}</p>
          </>
        )
      });
    } else {
      modal.error({
        title: "Notifications",
        content: (
          <>
            <p>{`Save presentations failed.`}</p>
          </>
        )
      });
    }
    // change from 1 to 0
    toggleStatusPresentation(presentationId, 0)
      .then((values) => {
        // Gỉa sử delete thành công
        toast.success(values.message, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          theme: "light"
        });
        navigate("/presentations");
      })
      .catch((err) => {
        const values = err.response.data;
        toast.error(values, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          theme: "light"
        });
      });
  };
  const presentPresentation = () => {
    const request = {
      presentationId: presentationId,
      slides: presentationContext.slideList
    };
    savePresentationAPI(request)
      .then((values) => {
        console.log(values);
        if (values && values.status == 200) {
          // Gỉa sử delete thành công
          modal.info({
            title: "Notifications",
            content: (
              <>
                <p>{`Save presentations successfully.`}</p>
              </>
            )
          });
        } else {
          modal.error({
            title: "Notifications",
            content: (
              <>
                <p>{`Save presentations failed.`}</p>
              </>
            )
          });
        }
      })
      .catch((error) => {
        modal.error({
          title: "Notifications",
          content: (
            <>
              <p>{`Delete presentations failed. ${error}`}</p>
            </>
          )
        });
      });
    // change from 1 to 0
    toggleStatusPresentation(presentationId, 0)
      .then((values) => {
        // Gỉa sử delete thành công
        toast.success(values.message, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          theme: "light"
        });
      })
      .catch((err) => {
        const values = err.response.data;
        toast.error(values, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          theme: "light"
        });
      });
    navigate(`/presentations/${presentationId}/show`);
  };

  return (
    <>
      <Layout>
        <Header style={{ backgroundColor: "white", padding: "0" }}>
          <EditHeader
            presentation={presentationContext}
            savePresentation={savePresentation}
            presentPresentation={presentPresentation}
          />
        </Header>
        <Divider type="horizontal" className="m-0" />
        <Layout>
          <EditContent
            slide={presentationContext.slideList}
            currentSlide={currentSlide}
            presentation={presentationContext}
            setCurrentSlide={setCurrentSlide}
            setPresentation={setPresentationContext}
            savePresentation={savePresentation}
          />
          {contextHolder}
        </Layout>
      </Layout>
    </>
  );
};

const EditHeader = (props) => {
  const { savePresentation, presentation, presentPresentation } = props;
  const { id, name, createdBy } = presentation;
  console.log("props presentation ", props.presentation);
  let { presentationId } = useParams();

  return (
    <Styled>
      <MenuBar id="menubar-horizontal" bg="light" className="d-flex justify-content-between">
        <div className="me-auto header-left">
          <div onClick={() => savePresentation()}>
            <ArrowLeftOutlined style={{ fontSize: "2.4rem" }} />
          </div>
          <div>
            <span style={{ fontSize: "1.4rem", fontWeight: "bold" }}>{name}</span>
          </div>
        </div>
        <MenuList className="d-flex align-items-center justify-content-evenly">
          <MenuBarItem to="/share">
            <StyledButton variant="secondary">
              <ShareAltOutlined style={{ fontSize: "2rem" }} />
              <span style={{ marginLeft: "1rem" }}>Share</span>
            </StyledButton>
          </MenuBarItem>
          <div onClick={() => presentPresentation()}>
            <StyledButton>
              <PlayCircleOutlined style={{ fontSize: "2rem" }} />
              <span style={{ marginLeft: "1rem" }}>Present</span>
            </StyledButton>
          </div>
        </MenuList>
      </MenuBar>
    </Styled>
  );
};

const EditContent = (props) => {
  const { slide, currentSlide, presentation, setCurrentSlide, setPresentation, savePresentation } =
    props;
  return (
    <Creator
      slide={slide}
      currentSlide={currentSlide}
      presentation={presentation}
      setCurrentSlide={setCurrentSlide}
      setPresentation={setPresentation}
      savePresentation={savePresentation}
    />
  );
};
