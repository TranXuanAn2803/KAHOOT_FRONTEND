import { Layout, Divider, Modal } from "antd";
const { Header, Footer, Sider, Content } = Layout;
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Slide } from "../Slide";
import Container from "react-bootstrap/Container";
import { MenuItem as MenuBarItem, MenuBar, MenuList, StyledButton } from "../style";
import { ArrowLeftOutlined, PlayCircleOutlined, ShareAltOutlined } from "@ant-design/icons";
import Creator from "../../Creator";
import { useEffect, useContext } from "react";
import PresentationContext from "../../../utils/PresentationContext";
import { GetOnePresentation, savePresentationAPI } from "../API";
export const EditPresentation = (props) => {
  let { presentationId } = useParams();
  const [modal, contextHolder] = Modal.useModal();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [presentationContext, setPresentationContext] = useContext(PresentationContext);

  // console.log("presentation.slideList", presentation.slideList, currentSlide);
  const GetPresentation = (id) => {
    GetOnePresentation(id)
      .then((value) => {
        console.log("value ", value);
      })
      .catch((error) => {
        modal.error({
          title: "Notifications",
          content: (
            <>
              <p>{`get presentation failed. ${error}`}</p>
            </>
          )
        });
      });
  };
  const savePresentation = () => {
    // console.log("current presentation: " + JSON.stringify(presentation.slideList));
    const arr = presentationContext.slideList;
    setCurrentSlide(0);
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
  };
  const onPresent = () => {};
  useEffect(() => {
    document.title = presentationContext.name;
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

  return (
    <>
      <Layout>
        <Header style={{ backgroundColor: "white", padding: "0" }}>
          <EditHeader presentation={presentationContext} />
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
  const { id, name, createdBy } = props.presentation;
  console.log("props presentation ", props.presentation);
  let { presentationId } = useParams();

  return (
    <>
      <MenuBar id="menubar-horizontal" bg="light" className="d-flex justify-content-between">
        <MenuList className="me-auto">
          <MenuBarItem onClick={() => savePresentation()} to="/presentations">
            <ArrowLeftOutlined style={{ fontSize: "2.4rem" }} />
          </MenuBarItem>
          <MenuBarItem>
            <span style={{ fontSize: "1.4rem", fontWeight: "bold" }}>{name}</span>
          </MenuBarItem>
        </MenuList>
        <MenuList className="d-flex align-items-center justify-content-evenly">
          <MenuBarItem to="/share">
            <StyledButton variant="secondary">
              <ShareAltOutlined style={{ fontSize: "2rem" }} />
              <span style={{ marginLeft: "1rem" }}>Share</span>
            </StyledButton>
          </MenuBarItem>
          <MenuBarItem to={`/presentations/${id}/show`}>
            <StyledButton>
              <PlayCircleOutlined style={{ fontSize: "2rem" }} />
              <span style={{ marginLeft: "1rem" }}>Present</span>
            </StyledButton>
          </MenuBarItem>
        </MenuList>
      </MenuBar>
    </>
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
