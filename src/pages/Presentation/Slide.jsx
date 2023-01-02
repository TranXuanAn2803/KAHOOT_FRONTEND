import * as React from "react";
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from "recharts";

export const Slide = (props) => {
  // const { id, type, question, options } = props.slide;
  const { dataChart } = props;
  return (
    <>
      <BarChart width={430} height={500} data={dataChart}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="answer" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="total" fill="#8884d8" />
      </BarChart>
    </>
  );
};
