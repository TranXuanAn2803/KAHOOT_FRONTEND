import React, { createContext, useMemo } from "react";
import { SlideType } from "../actions/constants";
const PresentationContext = createContext();
export const PresentationProvider = ({ children }) => {
  const [presentationContext, setPresentationContext] = React.useState({
    name: "present 1",
    slideList: [
      {
        id: 1,
        type: SlideType.MultipleChoices,
        question: "Question 1",
        heading: "Heading 1",
        subHeading: "SubHeading 1",
        paragraph: "Paragrapth 1",
        options: ["Answer 1"]
      }
    ]
  });

  let values = useMemo(() => [presentationContext, setPresentationContext], [presentationContext]);
  return <PresentationContext.Provider value={values}>{children}</PresentationContext.Provider>;
};
export default PresentationContext;
