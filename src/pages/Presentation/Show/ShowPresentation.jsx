import * as React from "react";
import PresentationContext from "../../../utils/PresentationContext";
import { Layout, Divider } from "antd";
const { Header, Footer, Sider, Content } = Layout;

export const ShowPresentation = (props) => {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [isFullScreen, setIsFullScreen] = React.useState(true);
  const [presentation, setPresentation] = React.useContext(PresentationContext);

  return;
  <Layout>
    <Content>{presentation.name}</Content>
  </Layout>;
};
