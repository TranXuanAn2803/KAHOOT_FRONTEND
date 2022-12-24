import React from 'react';
import { TeamOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { Styled } from "./style.jsx";
import { useNavigate } from "react-router-dom";

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}
const items = [
  getItem("Group I've joined", '1', <TeamOutlined />),
  getItem('Group I manage', '2', <TeamOutlined />),
];
const SideBar = ({selectedKey}) => {
  const navigate = useNavigate();

  const onClick = (e) => {
    switch (e.key)
    {
      case '1':
        navigate("/groups");

        break;
      case '2':
        navigate("/groups/owner");
        break;

    }
  };
  return (
    <Menu
      onClick={onClick}
      style={{
        width: 256,
        height: "100%",
        position: "absolute",
        left: 0,
        top: "6.4rem",
        bottom: 0,
        fontSize: "1.4rem",
        paddingTop: "2.4rem",
        boxShadow: "rgb(0 0 0 / 5%) 4px 0px 8px 0px"

      }}
      defaultSelectedKeys={selectedKey}
      mode="vertical"
      items={items}
    />
  );
};

export default SideBar;
