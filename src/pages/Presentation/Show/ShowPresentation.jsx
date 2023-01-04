import React, { useState, useEffect, useContext } from "react";
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from "recharts";
import { Styled, StyleMenu } from "./style";
import { Layout, Menu } from "antd";
import {
  ArrowsAltOutlined,
  ClockCircleOutlined,
  CommentOutlined,
  UndoOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined
} from "@ant-design/icons";
import { Slide } from "../Slide";
import { useParams, useLocation } from "react-router-dom";
import { GetOnePresentation } from "../API";
import PresentationContext from "../../../utils/PresentationContext";

const { Content, Sider } = Layout;
var presentationName = "presentation";

export const ShowPresentation = (props) => {
  const { presentationId } = useParams();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [presentationContext, setPresentationContext] = useContext(PresentationContext);
  const [dataChart, setDataChart] = useState([
    {
      answer: "A",
      total: 0
    },
    {
      answer: "B",
      total: 0
    },
    {
      answer: "C",
      total: 0
    },
    {
      answer: "D",
      total: 0
    }
  ]);
  useEffect(() => {
    document.title = `${presentationName} - Realtime quiz-based learning`;
    const currentArr = presentationContext["slideList"][currentSlide]["options"];
    const newArr = currentArr.map((value, index) => {
      return {
        answer: value,
        total: 0
      };
    });
    setDataChart(newArr);
  }, [currentSlide]);
  return (
    <SlideShowForHost
      currentSlide={currentSlide}
      setCurrentSlide={setCurrentSlide}
      dataChart={dataChart}
    />
  );
};

const SlideShowForHost = (props) => {
  const [collapsed, setCollapsed] = useState(false);
  const { dataChart, setCurrentSlide, currentSlide } = props;
  const pathName = useLocation();
  const goToPreviousSlide = () => {
    setCurrentSlide(currentSlide - 1);
  };
  const goToNextSlide = () => {
    setCurrentSlide(currentSlide + 1);
  };

  const items = [
    {
      label: "Full screen",
      key: "Full screen",
      icon: <ArrowsAltOutlined style={{ transform: "rotate(90deg)" }} />
    },
    {
      label: "Reset results",
      key: "Reset results",
      icon: <UndoOutlined style={{ transform: "rotate(90deg)" }} />
    },
    {
      label: "Set alarm",
      key: "Set alarm",
      icon: <ClockCircleOutlined style={{ transform: "rotate(90deg)" }} />
    },
    {
      label: "Disable comments",
      key: "Disable comments",
      icon: <CommentOutlined style={{ transform: "rotate(90deg)" }} />
    },
    {
      label: "Previous slide",
      key: "Previous slide",
      icon: (
        <ArrowLeftOutlined
          style={{ transform: "rotate(90deg)" }}
          onClick={() => goToPreviousSlide()}
        />
      )
    },
    {
      label: "Next Slide",
      key: "Next Slide",
      icon: (
        <ArrowRightOutlined
          style={{ transform: "rotate(90deg)" }}
          onClick={() => goToNextSlide()}
        />
      )
    }
  ];
  const goBackToEdit = () => {
    let currentUrl = window.location.href;
    console.log("url ", window.location.href);
    var to = currentUrl.lastIndexOf("/");
    currentUrl = currentUrl.substring(0, to) + "/" + "edit";
    console.log("currentUrl ", currentUrl);
    window.location.href = currentUrl;
  };
  return (
    <Styled>
      <Layout style={{ height: "100vh" }}>
        <Content style={{ margin: "1rem auto", padding: "3rem 3.2rem", width: "100%" }}>
          <StyleMenu theme="dark" mode="inline" items={items} inlineCollapsed={true} />
          <div className="on-row">
            <ArrowLeftOutlined
              style={{ fontSize: "2.4rem", cursor: "pointer" }}
              onClick={() => goBackToEdit()}
            />

            <div className="codePublic">
              Go to{" "}
              <a className="url_code" href={`/presentations/public`}>
                this link{" "}
              </a>
              and use code 123456
            </div>
          </div>

          <div className="show_presentation-container">
            <Slide dataChart={dataChart} />
          </div>
        </Content>
      </Layout>
    </Styled>
  );
};

// #endregion

// #region Slide show for the rest
const SlideShowForMember = (props) => {
  return (
    <>
      <Styled>
        <div className="show_presentation-container">
          <Slide dataChart={dataChart} />
        </div>
      </Styled>
    </>
  );
};
// #endregion
