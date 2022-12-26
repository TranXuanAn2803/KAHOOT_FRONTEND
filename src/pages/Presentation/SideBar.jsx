import React, { memo, useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { UnorderedListOutlined } from "@ant-design/icons";
const { Sider } = Layout;

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type
  };
}

const StyledNavLink = styled(NavLink)`
  text-decoration: none;
`;

const items = [
  {
    label: "List Presentations",
    key: "presentation",
    icon: <UnorderedListOutlined />
  },
  {
    label: "List collaborators",
    key: "collaborator",
    icon: <UnorderedListOutlined />
  }
];
const SideBar = memo((props) => {
  const { currentselected, setcurrentselected } = props;

  const changeItem = (e) => {
    setcurrentselected(e.key);
  };
  return (
    <Sider
      {...props}
      width={200}
      breakpoint="lg"
      collapsedWidth="0"
      style={{
        borderRight: "2px solid rgb(231, 232, 235)",
        paddingTop: "1.6rem",
        backgroundColor: "white"
      }}>
      <Menu
        mode="inline"
        selectedKeys={[currentselected]}
        onClick={(e) => changeItem(e)}
        style={{
          height: "100%"
        }}
        items={items}
      />
    </Sider>
  );
});
export default SideBar;
