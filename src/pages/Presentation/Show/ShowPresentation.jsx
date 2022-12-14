import * as React from "react";
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from "recharts";
import { useState } from "react";
import Styled from "./style";
export const ShowPresentation = props => {
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
  return (
    <Styled>
      <div className="show_presentation-container">
        <BarChart width={430} height={500} data={dataChart}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="answer" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="total" fill="#8884d8" />
        </BarChart>
      </div>
    </Styled>
  );
};
