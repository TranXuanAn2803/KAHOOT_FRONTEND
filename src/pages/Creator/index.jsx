import React, { useState, useEffect } from "react";
import { Header } from "../../components/Header";
import Styled from "./style";
import { Button, Tabs, Input } from "antd";
import { QuestionCircleOutlined, CloseOutlined } from "@ant-design/icons";
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from "recharts";
import { useMemo } from "react";
const Creator = props => {
  const { slide, currentSlide, presentation, setCurrentSlide, setPresentation } = props;
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
  const [optionItems, setOptionsItem] = useState([
    // {
    //   id: 1,
    //   name: "option 1"
    // },
    // {
    //   id: 2,
    //   name: "test 2"
    // },
    // {
    //   id: 3,
    //   name: "test 3"
    // },
    // {
    //   id: 4,
    //   name: "test 4"
    // }
  ]);
  useEffect(() => {
    // CHART
    console.log("slide currentSlide ", slide, currentSlide);
    const currentSlideArr = slide[currentSlide];
    // console.log("currentSlideArr: " + currentSlideArr);
    const data = currentSlideArr.options.map((item, index) => {
      return {
        answer: item,
        total: Math.floor(Math.random() * (100 - 20)) + 20
      };
    });
    setDataChart(data);

    //options answers
    const optionsItem = currentSlideArr.options.map((item, index) => {
      return {
        id: index,
        name: item
      };
    });
    setOptionsItem(optionsItem);
  }, [presentation, currentSlide]);

  const onChange = key => {
    console.log("key", key);
  };
  const createNewOption = () => {
    let currentSlideList = presentation.slideList;
    let currentOptions = presentation.slideList[currentSlide].options;
    currentSlideList[currentSlide].options.push(currentOptions[currentOptions.length - 1]);
    console.log("newSlideList", currentSlideList);
    const newPresentation = { ...presentation, slideList: currentSlideList };
    console.log("newPresentation", newPresentation);
    setPresentation({ ...presentation, newPresentation });
  };
  const items = useMemo(
    () => [
      {
        label: "Content",
        key: "1",
        children: (
          <>
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
                  <Input
                    id="question-name"
                    type="text"
                    className="question-input"
                    maxLength={150}
                    //   showCount={true}
                    placeholder="Multiple Choice"
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
                      <Input
                        id="answers"
                        name="answers[]"
                        type="text"
                        className="question-input option-input"
                        placeholder="Option "
                        defaultValue={item.name}
                      />
                      <div className="item-close">
                        <CloseOutlined />
                      </div>
                    </div>
                  );
                })}
              </div>
              <Button type="primary" onClick={() => createNewOption()}>
                + Add option
              </Button>
            </form>
          </>
        )
      },
      {
        label: "Customize",
        key: "2",
        children: "content of Tab Pane 2"
      }
    ],
    [optionItems]
  );
  useEffect(() => {
    console.log("items value", items);
  }, [items]);
  return (
    <Styled>
      <Header />
      <div className="creator-container">
        <div className="creator-header">
          <div className="header-button">
            <Button type="primary" className="new-slide-button">
              + New slide
            </Button>
          </div>
        </div>
        <div className="creator-body">
          <div className="body-left-container">
            <ol
              data-rbd-droppable-id="droppable"
              data-rbd-droppable-context-id="3"
              className="body-left-list">
              <li
                aria-label="Slide"
                data-rbd-draggable-context-id="3"
                data-rbd-draggable-id="x3dsryvjw68d"
                tabIndex="0"
                role="button"
                aria-describedby="rbd-hidden-text-3-hidden-text-15"
                draggable="false">
                <div className="slide-thumbnail" data-testid="slide-thumbnail-0">
                  <div className="slide-count">
                    <span>1</span>
                  </div>
                  <div className="slide-image-container">
                    <img
                      className="slide-image"
                      src="https://images.twinkl.co.uk/tw1n/image/private/t_630/u/ux/barchart_ver_1.jpg"
                      alt="chart"
                    />
                  </div>
                </div>
              </li>
            </ol>
          </div>
          <div className="body-center">
            <div className="center-draw">
              <BarChart width={430} height={500} data={dataChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="answer" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#8884d8" />
              </BarChart>
            </div>
          </div>
          <div className="body-right">
            <Tabs defaultActiveKey="1" onChange={onChange} items={items} />
          </div>
        </div>
      </div>
    </Styled>
  );
};

export default Creator;
