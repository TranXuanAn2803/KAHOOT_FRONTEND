import React, { createContext, useMemo } from "react";
const PresentationContext = createContext();
const SlideType = {
  MultipleChoices: 0
};
export const PresentationProvider = ({ children }) => {
  const [presentation, setPresentation] = React.useState({
    name: "present 1",
    slideList: [
      {
        id: 1,
        type: SlideType.MultipleChoices,
        question: "Question 1",
        options: ["Options 1", "Options-2", "Options 3", "Options 4", "Option 5"]
      }
    ]
  });

  let values = useMemo(() => [presentation, setPresentation], [presentation]);
  return <PresentationContext.Provider value={values}>{children}</PresentationContext.Provider>;
};
export default PresentationContext;
