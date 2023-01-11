import React, { useState, useEffect, useContext, useCallback } from "react";
import { Header } from "../../components/Header";
import Styled from "./style";
import { Button, Tabs, Input, Select, Layout } from "antd";
import { QuestionCircleOutlined, CloseOutlined, BarChartOutlined } from "@ant-design/icons";
import PresentationContext from "../../utils/PresentationContext";
import { SlideType } from "../../actions/constants";
import { HeadingSlide, ParagraphSlide, MultipleChoiceSlide } from "../Presentation/Slide";
const Creator = (props) => {
  //slide chua cac slide hien tai (slideList)
  //curentaSlide chua so thu tu cua slide hien tai

  const { currentSlide, setCurrentSlide, savePresentation } = props;
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
  const [optionItems, setOptionsItem] = useState([]);
  const MultipleChoiceOptions = (
    <div className="d-flex align-items-center" style={{ fontSize: "1.6rem", padding: "0 0.8rem" }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        preserveAspectRatio="xMidYMid meet"
        width="28"
        height="28"
        viewBox="0 0 48 48">
        <title>Bar Chart Icon</title>
        <rect x="32.73" y="17.04" width="11.4" height="25.25" fill="rgb(231, 232, 235)"></rect>
        <rect x="3.87" y="26.22" width="11.4" height="16.06" fill="rgb(64, 70, 93)"></rect>
        <rect x="18.3" y="4.31" width="11.4" height="37.97" fill="rgb(183, 186, 194)"></rect>
        <rect y="42.28" width="48" height=".99" fill="#000000"></rect>
      </svg>
      <span style={{ marginLeft: "0.8rem" }}>Multiple Choice</span>
    </div>
  );
  const HeadingOption = (
    <div style={{ fontSize: "1.6rem", padding: "0 0.8rem" }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        preserveAspectRatio="xMidYMid meet"
        width="28"
        height="28"
        viewBox="0 0 48 48">
        <title>Heading Subheading Icon</title>
        <rect fill="rgb(64, 70, 93)" y="18.05" width="48" height="10.15" rx="1.26"></rect>
        <rect
          fill="rgb(183, 186, 194)"
          x="5.54"
          y="30.05"
          width="36.92"
          height="4.62"
          rx="1.3"></rect>
      </svg>
      <span style={{ marginLeft: "0.8rem" }}>Heading</span>
    </div>
  );
  const ParagraphOption = (
    <div style={{ fontSize: "1.6rem", padding: "0 0.8rem" }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        preserveAspectRatio="xMidYMid meet"
        width="28"
        height="28"
        viewBox="0 0 48 48">
        <title>Heading Paragraph Icon</title>
        <rect
          fill="rgb(183, 186, 194)"
          x="3.93"
          y="11.04"
          width="40.92"
          height="8.66"
          rx="1.26"></rect>
        <rect fill="rgb(64, 70, 93)" y="22.31" width="48" height="13.38" rx="1.26"></rect>
      </svg>
      <span style={{ marginLeft: "0.8rem" }}>Paragraph</span>
    </div>
  );
  const slideOptions = [
    {
      label: <div style={{ fontSize: "1.6rem" }}>Popular question types</div>,
      options: [{ label: MultipleChoiceOptions, value: SlideType.MultipleChoice }]
    },
    {
      label: <div style={{ fontSize: "1.6rem" }}>Content slides</div>,
      options: [
        { label: HeadingOption, value: SlideType.Heading },
        { label: ParagraphOption, value: SlideType.Paragraph }
      ]
    }
  ];
  const SlideSelect = () => {
    return (
      <Select
        defaultValue={presentationContext.slideList[currentSlide].type}
        size="large"
        style={{
          width: "100%",
          marginBottom: "2rem",
          fontSize: "1.6rem !important"
        }}
        listItemHeight={30}
        listHeight={250}
        onChange={handleChooseSlide}
        options={slideOptions}
      />
    );
  };

  const [currentSlideType, setCurrentSlideType] = useState(SlideType.MultipleChoice);
  useEffect(() => {
    // CHART
    const currentSlideArr = presentationContext.slideList[currentSlide];

    const data = currentSlideArr.options.map((item, index) => {
      return {
        answer: item,
        total: 0
      };
    });
    setDataChart(data);

    const optionsItem = currentSlideArr.options.map((item, index) => {
      return {
        id: index,
        name: item
      };
    });
    setOptionsItem(optionsItem);
  }, [presentationContext, currentSlide]);
  useEffect(() => {
    console.log("presentationContext change in creator ", presentationContext);
  }, [presentationContext]);
  const createNewOption = () => {
    let currentSlideList = presentationContext.slideList;
    let currentOptions = presentationContext.slideList[currentSlide].options;
    currentSlideList[currentSlide].options.push(currentOptions[currentOptions.length - 1]);
    setPresentationContext({ ...presentationContext, slideList: currentSlideList });
  };
  const removeOption = (index) => {
    let currentSlideList = presentationContext.slideList;
    currentSlideList[currentSlide].options.splice(index, 1);
    setPresentationContext({ ...presentationContext, slideList: currentSlideList });
  };
  const ChangeOptionValue = (index, value) => {
    let currentSlideList = presentationContext.slideList;
    console.log("currentSLide List", currentSlideList, currentSlide);
    currentSlideList[currentSlide].options[index] = value;
    console.log("currentSlide List after change ", currentSlideList);
    setPresentationContext({ ...presentationContext, slideList: currentSlideList });
  };
  const changeTextOfSlide = (typeOfSlide, value) => {
    console.log("change question of slide");
    let currentSlideList = presentationContext.slideList;
    currentSlideList[currentSlide][typeOfSlide] = value;
    setPresentationContext({ ...presentationContext, slideList: currentSlideList });
  };

  const createNewSlide = () => {
    console.log("new slide");
    let currentSlideList = presentationContext.slideList;
    let lastElement = currentSlideList[currentSlideList.length - 1];
    lastElement = JSON.parse(JSON.stringify(lastElement));
    lastElement.id = lastElement.id += 1;
    console.log("last element ", lastElement);
    currentSlideList.push(lastElement);
    setPresentationContext({ ...presentationContext, slideList: currentSlideList });
  };
  const deleteSlide = () => {
    let currentSlideList = presentationContext.slideList;
    currentSlideList.splice(currentSlide, 1);
    console.log("new slide list", currentSlideList, currentSlide);
    setPresentationContext({ ...presentationContext, slideList: currentSlideList });

    if (currentSlide == currentSlideList.length) {
      console.log("change current slide", currentSlide);
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleChooseSlide = (value) => {
    console.log("change question of slide");
    let currentSlideList = presentationContext.slideList;
    currentSlideList[currentSlide]["type"] = value;
    setPresentationContext({ ...presentationContext, slideList: currentSlideList });
  };
  const CenterDraw = () => {
    switch (presentationContext.slideList[currentSlide].type) {
      case SlideType.MultipleChoice:
        var question = presentationContext.slideList[currentSlide].question;
        return (
          <Layout style={{ margin: "1rem", position: "relative", top: "-17rem" }}>
            <MultipleChoiceSlide dataChart={dataChart} question={question} />
          </Layout>
        );
      case SlideType.Heading:
        var heading = presentationContext.slideList[currentSlide].heading;
        var subHeading = presentationContext.slideList[currentSlide].subHeading;
        return (
          <Layout style={{ margin: "1rem", position: "relative", top: "-17rem" }}>
            <HeadingSlide heading={heading} subHeading={subHeading} />
          </Layout>
        );
      case SlideType.Paragraph:
        var heading = presentationContext.slideList[currentSlide].heading;
        var paragraph = presentationContext.slideList[currentSlide].paragraph;
        return (
          <Layout style={{ margin: "1rem", position: "relative", top: "-17rem" }}>
            <ParagraphSlide heading={heading} paragraph={paragraph} />;
          </Layout>
        );
      default:
        break;
    }
  };
  const EditCurrentPresentation = () => {
    switch (presentationContext.slideList[currentSlide].type) {
      case SlideType.MultipleChoice:
        return (
          <form method="post" action="/slide">
            <div className="item-container">
              <div className="item-question">
                <label
                  htmlFor="question-name"
                  className="question-text"
                  style={{ fontSize: "1.6rem" }}>
                  Your question
                </label>
                <span className="question-icon">
                  <QuestionCircleOutlined />
                </span>
              </div>
              <div className="item-answer">
                <input
                  id="question-name"
                  type="text"
                  className="question-input"
                  maxLength={150}
                  defaultValue={presentationContext.slideList[currentSlide].question}
                  onBlur={(e) => changeTextOfSlide("question", e.target.value)}
                />
              </div>
            </div>
            <div className="item-container">
              <div className="item-question">
                <label htmlFor="answers" className="question-text">
                  Options
                </label>
                <span className="question-icon">
                  <QuestionCircleOutlined />
                </span>
              </div>
              {optionItems.map((item, index) => {
                return (
                  <div className="item-answer" key={`item-answer-${index}`}>
                    <input
                      id="answers"
                      name="answers[]"
                      type="text"
                      className="question-input option-input"
                      placeholder="Option"
                      defaultValue={item.name}
                      // key={`changeitemname-${item.name}`}
                      onBlur={(e) => ChangeOptionValue(index, e.target.value)}
                    />
                    <div className="item-close" onClick={(e) => removeOption(index)}>
                      <CloseOutlined />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="button-creator-container">
              <Button type="text" onClick={() => createNewOption()}>
                + Add option
              </Button>
              <Button type="primary" onClick={() => savePresentation()}>
                Save presentation
              </Button>
            </div>
          </form>
        );
      case SlideType.Heading:
        return (
          <form method="post" action="/slide">
            <div className="item-container">
              <div className="item-question">
                <label htmlFor="heading" className="question-text">
                  Heading
                </label>
                <span className="question-icon">
                  <QuestionCircleOutlined />
                </span>
              </div>
              <div className="item-answer">
                <input
                  id="heading"
                  type="text"
                  className="question-input"
                  maxLength={150}
                  defaultValue={presentationContext.slideList[currentSlide].heading}
                  onBlur={(e) => changeTextOfSlide("heading", e.target.value)}
                />
              </div>
            </div>
            <div className="item-container">
              <div className="item-question">
                <label htmlFor="subHeading" className="question-text">
                  SubHeading
                </label>
                <span className="question-icon">
                  <QuestionCircleOutlined />
                </span>
              </div>
              <div className="item-answer">
                <input
                  id="subHeading"
                  type="text"
                  className="question-input"
                  defaultValue={presentationContext.slideList[currentSlide].subHeading}
                  style={{ minHeight: "50px" }}
                  onBlur={(e) => changeTextOfSlide("subHeading", e.target.value)}
                />
              </div>
            </div>
            <div className="button-creator-container">
              <Button type="primary" onClick={() => savePresentation()}>
                Save presentation
              </Button>
            </div>
          </form>
        );
      case SlideType.Paragraph:
        return (
          <form method="post" action="/slide">
            <div className="item-container">
              <div className="item-question">
                <label htmlFor="heading" className="question-text">
                  Heading
                </label>
                <span className="question-icon">
                  <QuestionCircleOutlined />
                </span>
              </div>
              <div className="item-answer">
                <input
                  id="heading"
                  type="text"
                  className="question-input"
                  maxLength={150}
                  defaultValue={presentationContext.slideList[currentSlide].heading}
                  onBlur={(e) => changeTextOfSlide("heading", e.target.value)}
                />
              </div>
            </div>
            <div className="item-container">
              <div className="item-question">
                <label htmlFor="paragraph" className="question-text">
                  Paragraph
                </label>
                <span className="question-icon">
                  <QuestionCircleOutlined />
                </span>
              </div>
              <div className="item-answer">
                <textarea
                  id="paragraph"
                  type="text"
                  className="question-input"
                  defaultValue={presentationContext.slideList[currentSlide].paragraph}
                  style={{ minHeight: "50px" }}
                  onBlur={(e) => changeTextOfSlide("paragraph", e.target.value)}
                />
              </div>
            </div>
            <div className="button-creator-container">
              <Button type="primary" onClick={() => savePresentation()}>
                Save presentation
              </Button>
            </div>
          </form>
        );
      default:
        break;
    }
  };
  return (
    <Styled>
      <div className="creator-container">
        <div className="creator-header">
          <div className="header-button">
            <Button type="primary" className="new-slide-button" onClick={() => createNewSlide()}>
              + New slide
            </Button>
            <Button type="primary" danger onClick={() => deleteSlide()}>
              Delete slide
            </Button>
          </div>
        </div>
        <div className="creator-body">
          <div className="body-left-container">
            <div className="body-left-list">
              {presentationContext.slideList.map((item, index) => {
                return (
                  <div
                    key={`slide-thumbail-${index}`}
                    className={`${
                      currentSlide === index ? "slide-current slide-thumbnail" : "slide-thumbnail"
                    }`}
                    onClick={() => setCurrentSlide(index)}
                    data-testid="slide-thumbnail-0">
                    <div className="slide-count">
                      <span>{index + 1}</span>
                    </div>
                    <div className="slide-image-container">
                      <img className="slide-image" src="/assets/images/barchart.jpg" alt="chart" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="body-center">
            <div className="center-draw">
              <CenterDraw />
            </div>
          </div>
          <div className="body-right">
            <div className="slide-type-container">
              <div className="my-2 py-1" style={{ fontWeight: "bold" }}>
                Slide type
              </div>
              <div className="slide-select">
                <SlideSelect />
              </div>
            </div>
            <EditCurrentPresentation />
          </div>
        </div>
      </div>
    </Styled>
  );
};

export default Creator;
