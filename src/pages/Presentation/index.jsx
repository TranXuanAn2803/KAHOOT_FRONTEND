import React, { useEffect } from "react";
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
import {
  AddPresentation,
  GetAllPresentations,
  DeletePresentation,
  DeleteManyPresentation,
  CreateSlide
} from "./API";

const { Content } = Layout;
const { Search } = Input;
const { Column, ColumnGroup } = Table;
let initialialPresentationList = [];
export const Presentation = (props) => {
  return <Outlet />;
};
export const MyPresentations = (props) => {
  React.useEffect(() => {
    document.title = "List Presentations - Realtime quiz-based learning";
  });
  // const [hasSelectedPresentation, setHasSelectedPresentation] = React.useState(false);
  return (
    <>
      <Layout style={{ height: "100%", width: "100%" }}>
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
                List presentations
              </p>
              <div className="mb-5">
                <TableOfPresentations
                // handleHasSelectedPresentation={setHasSelectedPresentation}
                />
              </div>
            </div>
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

// #region Table of Presentations

const TableOfPresentations = (props) => {
  const [modal, contextHolder] = Modal.useModal();
  const [presentationList, setPresentationList] = React.useState([]);
  const [hasSelectedPresentation, setHasSelectedPresentation] = React.useState(false);
  const [selectedRows, setSelectedRows] = React.useState([]);

  const onSearch = (value) => {
    const currValue = value;
    console.log("currValue ", currValue);
    if (currValue !== "") {
      const filteredPresentation = presentationList.filter((presentation) =>
        presentation.name.includes(currValue)
      );
      console.log("filteredPresentation ", filteredPresentation);
      setPresentationList(filteredPresentation);
    } else {
      setPresentationList(initialialPresentationList);
    }
  };
  //delete one presentation
  const deletePresentation = (presentationId) => {
    DeletePresentation({ presentationId })
      .then((values) => {
      .then((values) => {
        console.log(values);
        if (values && values.status == 200) {
          // Gỉa sử delete thành công
          modal.info({
            title: "Notifications",
            content: (
              <>
                <p>{`Delete presentations successfully.`}</p>
              </>
            )
          });
          var newPresentationList = presentationList.filter(
            (presentation) => presentation.id != presentationId
          );
          setPresentationList(newPresentationList);
          initialialPresentationList = newPresentationList;
        } else {
          modal.error({
            title: "Notifications",
            content: (
              <>
                <p>{`Delete presentations failed.`}</p>
              </>
            )
          });
        }
      })
      .catch((error) => {
        modal.error({
          title: "Notifications",
          content: (
            <>
              <p>{`Delete presentations failed. ${error}`}</p>
            </>
          )
        });
      });
  };
  //delete many presentations
  const deleteManyPresentations = () => {
    var presentationIdList = selectedRows.map((row) => row.id);
    DeleteManyPresentation({ presentationIdList: presentationIdList })
      .then((response) => {
        if (response && response.status == 200) {
          modal.info({
            title: "Notifications",
            content: (
              <>
                <p>{`Delete presentations successfully.`}</p>
              </>
            )
          });
          var newPresentationList = presentationList.filter(
            (presentation) => !presentationIdList.includes(presentation.id)
          );
          setPresentationList(newPresentationList);
          setHasSelectedPresentation(false);
          initialialPresentationList = newPresentationList;
        } else {
          modal.error({
            title: "Notifications",
            content: (
              <>
                <p>{`Delete presentations failed.`}</p>
              </>
            )
          });
        }
      })
      .catch((error) => {
        modal.error({
          title: "Notifications",
          content: (
            <>
              <p>{`Delete many presentations failed. ${error}`}</p>
            </>
          )
        });
      });
  };
  useEffect(() => {
    GetAllPresentations()
      .then((values) => {
        if (values && values.status == 200) {
          var presentations = values.data;
          var dataSource = [];
          for (let i = 0; i < presentations.length; i++) {
            presentations[i].key = i;
            dataSource.push({
              key: presentations[i]._id,
              id: presentations[i]._id,
              name: presentations[i].name,
              createdDate: new Date(presentations[i].createdAt),
              modifiedDate: new Date(presentations[i].updatedAt),
              owner: presentations[i].created_by.name || presentations[i].created_by.username
            });
          }
          setPresentationList(dataSource);
          initialialPresentationList = dataSource;
        } else {
          modal.error({
            title: "Notifications",
            content: (
              <>
                <p>{`Has error ${values.message}. Please comeback again.`}</p>
              </>
            )
          });
        }
      })
      .catch((error) => {
        modal.error({
          title: "Notifications",
          content: (
            <>
              <p>{`Has error ${error}. Please comeback again.`}</p>
            </>
          )
        });
      });
  }, []);

  // #region handle cho các sự kiện select rows
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log("selectedRows ", selectedRows);
      setSelectedRows(selectedRows);
      if (selectedRowKeys.length == 0) {
        setHasSelectedPresentation(false);
      } else {
        setHasSelectedPresentation(true);
      }
    }
  };
  //

  return (
    <>
      <div className="d-flex justify-content-between mb-5">
        <div className="d-flex">
          {hasSelectedPresentation ? (
            <StyledButton
              variant="danger"
              className="d-flex align-items-center"
              onClick={() => deleteManyPresentations()}>
              <p>Delete</p>
            </StyledButton>
          ) : (
            <AddPresentations />
          )}
        </div>
        <div className="d-flex">
          <Search
            placeholder="Type to search"
            size="large"
            onSearch={onSearch}
            allowClear={true}
            bordered={true}
            maxLength={10}
          />
        </div>
      </div>
      <Table
        scroll={{ x: 400, y: 400 }}
        rowSelection={{ ...rowSelection }}
        dataSource={presentationList}
        pagination={false}>
        <Column
          width={350}
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
        <Column width={250} title="Owner" dataIndex="owner" key="owner" sorter={true} />
        <Column
          width={150}
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
          width={150}
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
          width={100}
          title=""
          key="action"
          render={(_, record) => {
            return <ActionMenu data={record} handleDelete={deletePresentation} />;
          }}
        />
      </Table>
      {contextHolder}
    </>
  );
};

const ActionMenu = (props) => {
  const data = props.data;

  const items = [
    {
      label: (
        <MenuItem to={`/presentations/${data.id}/show`}>
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
        <MenuItem onClick={() => props.handleDelete(data.id)} className="text-danger">
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
  // const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [modal, contextHolder] = Modal.useModal();
  const showModal = () => {
    setOpen(true);
  };
  const handleCancel = () => {
    setOpen(false);
  };

  const handleSubmit = (values) => {
    var { presentationName } = values;
    AddPresentation({ presentationName })
      .then((response) => {
        console.log(response);
        const {data: presentation, message, status } = response;
        if (presentation == null || status !== 200) {
          modal.info({
            title: "Notifications",
            content: (
              <>
                <p>{`Create new presentations ${presentationName} failed. ${message}`}</p>
              </>
            )
          });
        } else {
          CreateSlide({ presentationId: presentation._id, index: 0 })
            .then((values) => {
              const {data: slide, message, status } = values;
              if (slide == null || status !== 200) {
                modal.info({
                  title: "Notifications",
                  content: (
                    <>
                      <p>{`Create new presentations ${presentationName} failed. ${message}`}</p>
                    </>
                  )
                });
              }
              navigate(`/presentations/${presentation._id}/edit`);
            })
            .catch((error) => {
              modal.error({
                title: "Notifications",
                content: (
                  <>
                    <p>{`Create new slide failed. ${error}`}</p>
                  </>
                )
              });
            });
        }
      })
      .catch((error) => {
        modal.error({
          title: "Notifications",
          content: (
            <>
              <p>{`Create new presentations ${presentationName} failed. ${error}`}</p>
            </>
          )
        });
      });
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
              },
              {
                max: 255,
                message: "PresentationName should be less than 255 character"
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

// const DeletePresentation = (props) => {
//   const selectedPresentationList = props.selectedPresentationList;
//   if (selectedPresentationList == null || selectedPresentationList.length == 0) {
//     return;
//   }
//   return;
//   <>
//     <StyledButton
//       variant="danger"
//       className="d-flex align-items-center"
//       onClick={() => setModalShow(true)}>
//       <p>Delete</p>
//     </StyledButton>
//     <Modal
//       width={800}
//       open={open}
//       title={<p style={{ fontSize: "2rem" }}>Create new presentation</p>}
//       onCancel={handleCancel}
//       footer={null}>
//       <Form
//         name="addNewPresentationForm"
//         initialValues={{
//           remember: true
//         }}
//         autoComplete="off"
//         size="large"
//         onFinish={handleSubmit}>
//         <Form.Item
//           name="presentationName"
//           rules={[
//             {
//               required: true,
//               message: "Enter a name for your presentation."
//             }
//           ]}
//           style={{ marginBottom: "4rem" }}>
//           <Input placeholder="Presentation name" />
//         </Form.Item>
//         <Form.Item className="text-center text-md-end">
//           <StyledButton
//             key="back"
//             variant="secondary"
//             onClick={handleCancel}
//             style={{ marginRight: "1rem" }}>
//             Cancel
//           </StyledButton>
//           <StyledButton key="submit" variant="primary" type="submit">
//             Create presentation
//           </StyledButton>
//         </Form.Item>
//       </Form>
//     </Modal>
//   </>;
// };

// #endregion
