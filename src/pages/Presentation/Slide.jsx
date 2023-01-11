import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import * as React from "react";
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from "recharts";

export const MultipleChoiceSlide = (props) => {
  const { dataChart, question, chartWidth, charHeight } = props;
  return (
    <Content
      style={{
        paddingBottom: "56.25%",
        backgroundColor: "white"
      }}>
      <div
        className="d-flex flex-column"
        style={{
          maxHeight: "20rem",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          padding: "1.5rem 1rem",
          width: "100%",
        }}>
        <div style={{ fontSize: "3rem", fontWeight: "bold", marginBottom: "1rem" }}>{question}</div>
        <BarChart
          width={chartWidth || 600}
          height={charHeight || 400}
          data={dataChart}
          className="align-self-center">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="answer" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="total" fill="#8884d8" />
        </BarChart>
      </div>
    </Content>
  );
};

export const HeadingSlide = (props) => {
  const { heading, subHeading } = props;
  return (
    <Content style={{ paddingBottom: "56.25%", backgroundColor: "white" }}>
      <div
        className="d-flex flex-column align-items-center justify-content-center"
        style={{
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
        }}>
        <div style={{ fontSize: "10rem" }}>{heading}</div>
        <div style={{ fontSize: "1.6rem" }}>{subHeading}</div>
      </div>
    </Content>
  );
};

export const ParagraphSlide = (props) => {
  const { heading, paragraph } = props;
  return (
    <Content style={{ paddingBottom: "56.25%", backgroundColor: "white" }}>
      <div
        className="d-flex flex-column align-items-center justify-content-center"
        style={{
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
        }}>
        <div style={{ fontSize: "10rem" }}>{heading}</div>
        <div style={{ fontSize: "1.6rem" }}>{paragraph}</div>
      </div>
    </Content>
  );
};
