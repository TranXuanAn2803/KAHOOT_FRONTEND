import React, { useState, useEffect, useContext, useCallback } from "react";
import { Header } from "../../components/Header";
import Styled from "./style";
import { Button, Tabs, Input, Select } from "antd";
import { QuestionCircleOutlined, CloseOutlined } from "@ant-design/icons";
import PresentationContext from "../../utils/PresentationContext";
import { SlideType } from "../../actions/constants";
import { Slide } from "../Presentation/Slide";
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
  const slideOptions = [
    {
      label: "Popular question types",
      options: [{ label: "MultipleChoice", value: SlideType.MultipleChoice }]
    },
    {
      label: "Content slides",
      options: [
        { label: "Heading ", value: SlideType.Heading },
        { label: "Paragraph ", value: SlideType.Paragraph }
      ]
    }
  ];
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
  const SlideSelect = () => {
    return (
      <Select
        defaultValue={presentationContext.slideList[currentSlide].type}
        style={{ width: "100%", marginBottom: "20px" }}
        onChange={handleChooseSlide}
        options={slideOptions}
      />
    );
  };
  const CenterDraw = () => {
    if (presentationContext.slideList[currentSlide].type === SlideType.MultipleChoice) {
      return <Slide dataChart={dataChart} />;
    } else if (presentationContext.slideList[currentSlide].type === SlideType.Heading) {
      return (
        <div className="drawText-container">
          <h3 className="drawText-header">{presentationContext.slideList[currentSlide].heading}</h3>
          <p className="drawText-body">{presentationContext.slideList[currentSlide].subHeading}</p>
        </div>
      );
    } else {
      return (
        <div className="drawText-container">
          <h3 className="drawText-header">{presentationContext.slideList[currentSlide].heading}</h3>
          <p className="drawText-body">{presentationContext.slideList[currentSlide].paragraph}</p>
        </div>
      );
    }
  };
  const EditCurrentPresentation = () => {
    if (presentationContext.slideList[currentSlide].type == SlideType.MultipleChoice) {
      return (
        <form method="post" action="/slide">
          <div className="item-container">
            <div className="item-question">
              <label htmlFor="question-name" className="question-text">
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
                placeholder="Multiple Choice"
                defaultValue={presentationContext.slideList[currentSlide].question}
                // key={`question-input`}
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
    } else if (presentationContext.slideList[currentSlide].type == SlideType.Heading) {
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
                placeholder="Heading"
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
                placeholder="SubHeading"
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
    } else {
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
                placeholder="Heading"
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
              <input
                id="paragraph"
                type="text"
                className="question-input"
                placeholder="Paragraph"
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
    }
  };
  return (
    <Styled>
      <Header />
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
              <h4>Slide type</h4>
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
