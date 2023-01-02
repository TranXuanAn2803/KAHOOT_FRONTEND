import React, { useState, useEffect } from "react";
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
  const [presentation, setPresentation] = useState(PresentationContext);
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

    // #region get presentation and slides
    GetOnePresentation(presentationId)
      .then((response) => {
        console.log("one presentation ", response);
        console.log();
      })
      .catch((error) => {
        console.log(error);
      });
    // #endregion
  });
  //   return (
  //     <Styled>
  //       <div className="show_presentation-container">
  //         <BarChart width={430} height={500} data={dataChart}>
  //           <CartesianGrid strokeDasharray="3 3" />
  //           <XAxis dataKey="answer" />
  //           <YAxis />
  //           <Tooltip />
  //           <Legend />
  //           <Bar dataKey="total" fill="#8884d8" />
  //         </BarChart>
  //       </div>
  //     </Styled>
  //   );
  return <SlideShowForHost dataChart={dataChart} />;
};

// #region Slide show for host, co-host, owner, co-owner (gọi chung là host)

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label
  };
}

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
    icon: <ArrowLeftOutlined style={{ transform: "rotate(90deg)" }} />
  },
  {
    label: "Next Slide",
    key: "Next Slide",
    icon: <ArrowRightOutlined style={{ transform: "rotate(90deg)" }} />
  }
];

const SlideShowForHost = (props) => {
  const [collapsed, setCollapsed] = useState(false);
  const { dataChart } = props;
  const pathName = useLocation();
  return (
    <Layout style={{ height: "100vh" }}>
      <Content style={{ margin: "1rem auto", padding: "3rem 3.2rem", width: "100%" }}>
        <StyleMenu theme="dark" mode="inline" items={items} inlineCollapsed={true} />
        <Styled>
          <div className="codePublic">
            Go to{" "}
            <a className="url_code" href={`/presentations/public`}>
              this link{" "}
            </a>
            and use code 123456
          </div>
          <div className="show_presentation-container">
            <Slide dataChart={dataChart} />
          </div>
        </Styled>
      </Content>
    </Layout>
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
