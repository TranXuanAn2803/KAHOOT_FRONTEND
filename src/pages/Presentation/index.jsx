import * as React from "react";
import { SideBar } from "./SideBar";
import AddIcon from "@mui/icons-material/Add";
import { Table, Layout, Dropdown, Space, Form, Input, Modal } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  MoreOutlined,
  PlayCircleOutlined,
  ShareAltOutlined,
  SmallDashOutlined,
  UsergroupAddOutlined
} from "@ant-design/icons";
import { MenuItem, StyledButton } from "./style";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { GetAllPresentations } from "./API";

const { Content } = Layout;
const { Search } = Input;
const { Column, ColumnGroup } = Table;

export const Presentation = (props) => {
  return <Outlet />;
};

export const MyPresentations = (props) => {
  const onSearch = (value) => console.log(value);
  React.useEffect(() => {
    document.title = "My Presentations - Realtime quiz-based learning";
  });
  const [hasSelectedPresentation, setHasSelectedPresentation] = React.useState(false);
  return (
    <>
      <Layout style={{ height: "fit-content", minHeight: "100%" }}>
        <SideBar />
        <Layout
          style={{
            backgroundColor: "white",
            padding: "0 2.4rem 2.4rem"
          }}>
          <Content
            style={{
              margin: "0 1.6rem 2rem"
            }}>
            <div className="d-flex flex-column" style={{ padding: "3rem 3.2rem" }}>
              <p className="mb-5" style={{ fontWeight: "600", fontSize: "1.6rem" }}>
                My presentations
              </p>
              <div className="mb-5">
                <TableOfPresentations handleHasSelectedPresentation={setHasSelectedPresentation} />
              </div>
            </div>
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

// #region Table of Presentations

// Giả lập dữ liệu

const TableOfPresentations = (props) => {
  const [presentationList, setPresentationList] = React.useState([]);
  const [hasSelectedPresentation, setHasSelectedPresentation] = React.useState(false);
  const onSearch = (value) => console.log(value);
  React.useEffect(() => {
    const getAllPresentation = async () => {
      var response = await GetAllPresentations();
      return response;
    };

    var response = getAllPresentation();
    var data = [];
    for (let i = 0; i < 20; i++) {
      data.push({
        key: i,
        id: i,
        name: `Slide ${i}`,
        owner: "me",
        modifiedDate: new Date(),
        createdDate: new Date()
      });
    }
    // setPresentationList((arr) => [...arr, data]);
  });
  const [selectedRowKeys, setSelectedRowKeys] = React.useState([]);
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      // console.log(`selectedRowKeys: ${selectedRowKeys}`, "selectedRows: ", selectedRows);
      if (selectedRowKeys.length == 0) {
        setHasSelectedPresentation(false);
      } else {
        setHasSelectedPresentation(true);
      }
    }
  };
  return (
    <>
      <div className="d-flex justify-content-between mb-5">
        <div className="d-flex">
          {hasSelectedPresentation ? (
            <StyledButton
              variant="danger"
              className="d-flex align-items-center"
              onClick={() => setModalShow(true)}>
              <p>Delete</p>
            </StyledButton>
          ) : (
            <AddPresentations />
          )}
        </div>
        <div className="d-flex">
          <Search placeholder="Type to search" size="large" onSearch={onSearch} />
        </div>
      </div>
      <Table rowSelection={{ ...rowSelection }} dataSource={presentationList} pagination={false}>
        <Column
          title="Name"
          dataIndex="name"
          key="name"
          sorter={(a, b) => a.name.localeCompare(b.name)}
          render={(_, record) => {
            return (
              <div className="d-flex align-items-center">
                <NavLink
                  to={`/presentations/${record.id}/show`}
                  className="text-decoration-none text-dark d-none d-md-inline">
                  <PlayCircleOutlined
                    style={{ fontSize: "2rem", paddingRight: "1rem !important" }}
                  />
                </NavLink>
                <NavLink
                  to={`/presentations/${record.id}/edit`}
                  className="text-decoration-none text-dark">
                  <p className="pl-3" style={{ marginLeft: "1rem" }}>
                    {record.name}
                  </p>
                </NavLink>
              </div>
            );
          }}
        />
        <Column title="Owner" dataIndex="owner" key="owner" sorter={true} />
        <Column
          title="Modified"
          dataIndex="modifiedDate"
          key="modifiedDate"
          sorter={true}
          render={(_, record) =>
            record.modifiedDate.toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric"
            })
          }
        />
        <Column
          title="Created"
          dataIndex="createdDate"
          key="createdDate"
          sorter={true}
          render={(_, record) =>
            record.modifiedDate.toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric"
            })
          }
        />
        <Column
          title=""
          key="action"
          render={(_, record) => {
            return <ActionMenu data={record} />;
          }}
        />
      </Table>
    </>
  );
};

const ActionMenu = (props) => {
  const data = props.data;
  const items = [
    {
      label: (
        <MenuItem to={`/presentations/${data.id}/present`}>
          <PlayCircleOutlined style={{ fontSize: "2rem", paddingRight: "1rem !important" }} />
          <p className="pl-3" style={{ marginLeft: "1.6rem" }}>
            Present
          </p>
        </MenuItem>
      ),
      key: "0"
    },
    {
      type: "divider"
    },
    {
      label: (
        <MenuItem to={`/presentations`}>
          <UsergroupAddOutlined style={{ fontSize: "2rem", paddingRight: "1rem !important" }} />
          <p className="pl-3" style={{ marginLeft: "1.6rem" }}>
            Invite Collaborators
          </p>
        </MenuItem>
      ),
      key: "1",
      disabled: true
    },
    {
      label: (
        <MenuItem to={`/presentations`}>
          <ShareAltOutlined style={{ fontSize: "2rem", paddingRight: "1rem !important" }} />
          <p className="pl-3" style={{ marginLeft: "1.6rem" }}>
            Share
          </p>
        </MenuItem>
      ),
      key: "2",
      disabled: true
    },
    {
      type: "divider"
    },
    {
      label: (
        <MenuItem to={`/presentations/${data.id}/share`}>
          <EditOutlined style={{ fontSize: "2rem", paddingRight: "1rem !important" }} />
          <p className="pl-3" style={{ marginLeft: "1.6rem" }}>
            Rename
          </p>
        </MenuItem>
      ),
      key: "3"
    },
    {
      type: "divider"
    },
    {
      label: (
        <MenuItem to={`/presentations/${data.id}/delete`} className="text-danger">
          <DeleteOutlined style={{ fontSize: "2rem", paddingRight: "1rem !important" }} />
          <p className="pl-3" style={{ marginLeft: "1.6rem" }}>
            Delete
          </p>
        </MenuItem>
      ),
      key: "4"
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

// #endregion

// #region Add new Presentations

const AddPresentations = (props) => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [modal, contextHolder] = Modal.useModal();
  const showModal = () => {
    setOpen(true);
  };
  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 3000);
  };
  const handleCancel = () => {
    setOpen(false);
  };

  const handleSubmit = (values) => {
    var { presentationName } = values;
    console.log(`Submit ${presentationName}`);
    // #region Send request to server
    // Gỉả lập
    var success = true;
    var responseData = { id: presentationName };
    var { id } = responseData;

    // #endregion

    if (!success) {
      const modal = Modal.error();
      console.log(success);
      modal.update({
        title: "Notifications",
        content: (
          <>
            <p>{`Create new presentations ${presentationName} failed.`}</p>
            {contextHolder}
          </>
        )
      });
      //   modal.destroy();
    } else {
      navigate(`/presentations/${id}/edit`);
    }
  };
  return (
    <>
      <StyledButton variant="primary" className="d-flex align-items-center" onClick={showModal}>
        <AddIcon fontSize="large" className="" />
        <p>New Presentation</p>
      </StyledButton>

      <Modal
        width={800}
        open={open}
        title={<p style={{ fontSize: "2rem" }}>Create new presentation</p>}
        onCancel={handleCancel}
        footer={null}>
        <Form
          name="addNewPresentationForm"
          initialValues={{
            remember: true
          }}
          autoComplete="off"
          size="large"
          onFinish={handleSubmit}>
          <Form.Item
            name="presentationName"
            rules={[
              {
                required: true,
                message: "Enter a name for your presentation."
              }
            ]}
            style={{ marginBottom: "4rem" }}>
            <Input placeholder="Presentation name" />
          </Form.Item>
          <Form.Item className="text-center text-md-end">
            <StyledButton
              key="back"
              variant="secondary"
              onClick={handleCancel}
              style={{ marginRight: "1rem" }}>
              Cancel
            </StyledButton>
            <StyledButton key="submit" variant="primary" type="submit">
              Create presentation
            </StyledButton>
          </Form.Item>
        </Form>
      </Modal>
      {contextHolder}
    </>
  );
};
// #endregion

// #region Delete Presentation

const DeletePresentation = (props) => {
  const selectedPresentationList = props.selectedPresentationList;
  if (selectedPresentationList == null || selectedPresentationList.length == 0) {
    return;
  }
  return;
  <>
    <StyledButton
      variant="danger"
      className="d-flex align-items-center"
      onClick={() => setModalShow(true)}>
      <p>Delete</p>
    </StyledButton>
    <Modal
      width={800}
      open={open}
      title={<p style={{ fontSize: "2rem" }}>Create new presentation</p>}
      onCancel={handleCancel}
      footer={null}>
      <Form
        name="addNewPresentationForm"
        initialValues={{
          remember: true
        }}
        autoComplete="off"
        size="large"
        onFinish={handleSubmit}>
        <Form.Item
          name="presentationName"
          rules={[
            {
              required: true,
              message: "Enter a name for your presentation."
            }
          ]}
          style={{ marginBottom: "4rem" }}>
          <Input placeholder="Presentation name" />
        </Form.Item>
        <Form.Item className="text-center text-md-end">
          <StyledButton
            key="back"
            variant="secondary"
            onClick={handleCancel}
            style={{ marginRight: "1rem" }}>
            Cancel
          </StyledButton>
          <StyledButton key="submit" variant="primary" type="submit">
            Create presentation
          </StyledButton>
        </Form.Item>
      </Form>
    </Modal>
  </>;
};

// #endregion
