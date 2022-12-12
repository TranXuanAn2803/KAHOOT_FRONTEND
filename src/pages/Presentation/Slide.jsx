import * as React from "react";

export const Slide = (props) => {
  const { id, type, question, options } = props.slide;

  return (
    <>
      <h2>
        {id} - {type} - {question}
      </h2>
    </>
  );
};
