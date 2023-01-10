import React, { useState, useContext } from "react";
import PresentationContext from "../../../utils/PresentationContext";
import Styled from "./style";
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from "recharts";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useEffect } from "react";
const PresentPresentation = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [presentation, setPresentation] = useContext(PresentationContext);
  const [dataChart, setDataChart] = useState([
    {
      answer: "A",
      total: 100
    },
    {
      answer: "B",
      total: 50
    },
    {
      answer: "C",
      total: 20
    },
    {
      answer: "D",
      total: 30
    }
  ]);

  const changeCurrentSlide = (index) => {
    console.log("currentSlide ", currentSlide, presentation["slideList"].length);
    let newCurrentSlide = currentSlide + index;
    if (newCurrentSlide < 0 || newCurrentSlide >= presentation["slideList"].length) {
      newCurrentSlide = currentSlide - index;
    }
    setCurrentSlide(newCurrentSlide);
  };
  return (
    <Styled>
      <div className="presentPresentation-container">
        <div className="left-icon" onClick={() => changeCurrentSlide(-1)}>
          <LeftOutlined />
        </div>
        <BarChart width={500} height={500} data={dataChart}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="answer" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="total" fill="#0084ff" />
        </BarChart>
        <div className="right-icon" onClick={() => changeCurrentSlide(1)}>
          <RightOutlined />
        </div>
      </div>
    </Styled>
  );
};

export default PresentPresentation;
