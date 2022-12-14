import { Layout, Divider } from "antd";
const { Header, Footer, Sider, Content } = Layout;
import * as React from "react";
import { useParams } from "react-router-dom";
import { Slide } from "../Slide";
import Container from "react-bootstrap/Container";
import { MenuItem as MenuBarItem, MenuBar, MenuList, StyledButton } from "../style";
import { ArrowLeftOutlined, PlayCircleOutlined, ShareAltOutlined } from "@ant-design/icons";
import Creator from "../../Creator";
import { useEffect, useContext } from "react";
import PresentationContext from "../../../utils/PresentationContext";
import { GetOnePresentation } from "../API";
export const EditPresentation = props => {
  let { presentationId } = useParams();
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [presentation, setPresentation] = useContext(PresentationContext);
  // console.log("presentation.slideList", presentation.slideList, currentSlide);
  const GetPresentation = id => {
    GetOnePresentation(id)
      .then(value => {
        console.log("value ", value);
      })
      .catch(error => {
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
  useEffect(() => {
    document.title = presentation.name;
    const getDataForPresentation = async () => {
      const presentation = await GetOnePresentation(presentationId);
      console.log("presentation ", presentation);
      const created_by = presentation.data.data.created_by;
    };
    getDataForPresentation();
  }, []);

  return (
    <>
      <Layout>
        <Header style={{ backgroundColor: "white", padding: "0" }}>
          <EditHeader presentation={presentation} />
        </Header>
        <Divider type="horizontal" className="m-0" />
        <Layout>
          <EditContent
            slide={presentation.slideList}
            currentSlide={currentSlide}
            presentation={presentation}
            setCurrentSlide={setCurrentSlide}
            setPresentation={setPresentation}
          />
        </Layout>
      </Layout>
    </>
  );
};

const EditHeader = props => {
  console.log("props presentation ", props.presentation);
  const { id, name, createdBy } = props.presentation;
  return (
    <>
      <MenuBar id="menubar-horizontal" bg="light" className="d-flex justify-content-between">
        <MenuList className="me-auto">
          <MenuBarItem to="/presentations">
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
          <MenuBarItem to="/show">
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

const EditContent = props => {
  const { slide, currentSlide, presentation, setCurrentSlide, setPresentation } = props;
  console.log("slide edit content", slide, currentSlide);
  return (
    <Creator
      slide={slide}
      currentSlide={currentSlide}
      presentation={presentation}
      setCurrentSlide={setCurrentSlide}
      setPresentation={setPresentation}
    />
  );
};
