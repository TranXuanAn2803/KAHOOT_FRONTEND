import { Layout, Table, Space, Dropdown, Button } from "antd";
import React from "react";
import SideBar from "../SideBar";
import { MoreOutlined, DeleteOutlined } from "@ant-design/icons";
import Styled from "../style";
const { Content } = Layout;

const ActionMenu = (props) => {
  const { deleteCollaborator, data } = props;
  const items = [
    {
      label: (
        <div className="on-row d-flex align-items-center" onClick={() => deleteCollaborator(data)}>
          <DeleteOutlined style={{ fontSize: "2rem", paddingRight: "1rem !important" }} />
          <p className="pl-3" style={{ marginLeft: "1.6rem" }}>
            Delete
          </p>
        </div>
      ),
      key: "1"
    }
  ];

  return (
    <Dropdown
      menu={{
        items,
        selectable: true
      }}
      trigger={["click"]}
      placement="bottomRight"
      arrow>
      <a role="button">
        <Space>
          <MoreOutlined
            style={{
              fontSize: "2rem",
              fontWeight: "bolder",
              color: "black",
              transform: "rotate(90deg)"
            }}
          />
        </Space>
      </a>
    </Dropdown>
  );
};
const Collaborators = (props) => {
  const { collaboratorsList, deleteCollaborator } = props;
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text) => <p>{text}</p>
    },
    {
      title: "Owner",
      dataIndex: "owner",
      render: (text) => <p>{text}</p>
    },
    {
      title: "Collaborator",
      dataIndex: "collaborator",
      render: (text) => <p>{text}</p>
    },
    {
      title: "action",
      key: "action",
      width: "100",
      render: (_, data) => {
        return <ActionMenu data={data} deleteCollaborator={deleteCollaborator} />;
      }
    }
  ];
  return (
    <Styled>
      <div className="d-flex justify-content-between mb-5">
        <Table scroll={{ x: 400, y: 400 }} dataSource={collaboratorsList} columns={columns}></Table>
      </div>
    </Styled>
  );
};

export default Collaborators;
