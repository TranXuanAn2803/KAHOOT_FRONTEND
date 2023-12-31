import React, { useEffect, useState } from "react";
import SideBar from "./SideBar";
import AddIcon from "@mui/icons-material/Add";
import { Table, Layout, Dropdown, Space, Form, Input, Modal, Button } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  MoreOutlined,
  PlayCircleOutlined,
  ShareAltOutlined,
  SmallDashOutlined,
  UsergroupAddOutlined
} from "@ant-design/icons";
import Styled, { MenuItem, StyledButton } from "./style";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  AddPresentation,
  GetAllPresentations,
  DeletePresentation,
  DeleteManyPresentation,
  CreateSlide,
  addCollaboratorAPI,
  GetAllCollaboratorsAPI,
  deleteCollaboratorAPI
} from "./api/Presentation.Api";
import * as Yup from "yup";
import { useFormik } from "formik";
import Collaborators from "./Collaborators/Collaborators";

const { Content } = Layout;
const { Search } = Input;
const { Column, ColumnGroup } = Table;
let initialialPresentationList = [];
export const Presentation = (props) => {
  return <Outlet />;
};
export const MyPresentations = (props) => {
  const [currentselected, setCurrentselected] = useState("presentation");
  const [addCollaborators, setAddCollaborators] = useState(false);
  const [currentPresentation, setCurrentPresentation] = useState("");
  const [collaboratorsList, setCollaboratorsList] = useState([]);

  const addCollaboratorsSchema = Yup.object({
    email: Yup.string()
      .email("Not a proper email")
      .min(10, "Minimum 10 characters")
      .required("Email required")
  });
  const formik = useFormik({
    initialValues: {
      email: ""
    },
    validationSchema: addCollaboratorsSchema,
    onSubmit: async (value) => {
      console.log("value submit ", value, "presentation", currentPresentation);
      const dataSubmit = {
        idPresentation: currentPresentation,
        email: value.email
      };
      addCollaboratorAPI(dataSubmit).then((values) => {
        console.log("values return ", values);
      });
    }
  });
  const handleOpenAddCollaborators = (id) => {
    setCurrentPresentation(id);
    setAddCollaborators(true);
  };

  const handleCloseAddCollaborators = () => {
    setAddCollaborators(false);
  };
  const deleteCollaborator = (data) => {
    console.log("deleteCollaborator ", data);
    deleteCollaboratorAPI(data._id, data.collaborator).then((value) => {
      console.log("value return ", value);
    });
  };
  useEffect(() => {
    document.title = "List Presentations - Realtime quiz-based learning";
    GetAllCollaboratorsAPI().then((values) => {
      const data = values.data;
      const newArr = [];
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].collaborators.length; j++) {
          const newObj = {
            ...data[i],
            collaborator: data[i].collaborators[j].username,
            key: data[i]._id + j,
            owner: data[i].created_by.username
          };
          newArr.push(newObj);
        }
      }
      setCollaboratorsList(newArr);
    });
  }, []);

  // const [hasSelectedPresentation, setHasSelectedPresentation] = React.useState(false);
  return (
    <>
      <Layout style={{ height: "100%", width: "100%" }}>
        <Modal
          title="Add collaborators"
          open={addCollaborators}
          onOk={handleCloseAddCollaborators}
          onCancel={handleCloseAddCollaborators}
          okButtonProps={<></>}
          footer={null}>
          <Styled>
            <form
              method="POST"
              className="form-add-collaborators"
              autoComplete="on"
              onSubmit={formik.handleSubmit}>
              <div className="input-box">
                <label htmlFor="email" className="input-label">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  type="email"
                  placeholder="Input email address..."
                  className="input-text"
                  autoComplete="true"
                />
                {formik.errors.email && formik.touched.email && (
                  <p className="error-message">{formik.errors.email}</p>
                )}
              </div>
              <Button type="primary" htmlType="submit">
                Add collaborator
              </Button>
            </form>
          </Styled>
        </Modal>
        <SideBar currentselected={currentselected} setcurrentselected={setCurrentselected} />
        <Layout
          style={{
            backgroundColor: "white",
            padding: "0 2.4rem 2.4rem"
          }}>
          <Content
            style={{
              margin: "0 1.6rem 2rem"
            }}>
            {currentselected == "presentation" ? (
              <div className="d-flex flex-column" style={{ padding: "3rem 3.2rem" }}>
                <p className="mb-5" style={{ fontWeight: "600", fontSize: "1.6rem" }}>
                  List presentations
                </p>
                <div className="mb-5">
                  <TableOfPresentations
                    setCollaboratorsList={setCollaboratorsList}
                    handleOpenAddCollaborators={handleOpenAddCollaborators}
                    // handleHasSelectedPresentation={setHasSelectedPresentation}
                  />
                </div>
              </div>
            ) : (
              <div>
                <p className="mb-5" style={{ fontWeight: "600", fontSize: "1.6rem" }}>
                  List collaborators
                </p>
                <div className="mb-5">
                  <Collaborators
                    collaboratorsList={collaboratorsList}
                    deleteCollaborator={deleteCollaborator}
                  />
                </div>
              </div>
            )}
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

// #region Table of Presentations

const TableOfPresentations = (props) => {
  const handleOpenAddCollaborators = props.handleOpenAddCollaborators;
  const { setCollaboratorsList } = props;
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

    GetAllCollaboratorsAPI().then((values) => {
      console.log("collaborators ", values);
      const data = values.data;
      const newArr = [];
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].collaborators.length; j++) {
          const newObj = {
            ...data[i],
            collaborators: data[i].collaborators[j].username
          };
          newArr.push(newObj);
        }
      }
      setCollaboratorsList(newArr);
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
            return (
              <ActionMenu
                data={record}
                handleDelete={deletePresentation}
                handleOpenAddCollaborators={handleOpenAddCollaborators}
              />
            );
          }}
        />
      </Table>
      {contextHolder}
    </>
  );
};

const ActionMenu = (props) => {
  const { data, handleOpenAddCollaborators } = props;
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
        <MenuItem onClick={() => handleOpenAddCollaborators(data.id)}>
          <UsergroupAddOutlined style={{ fontSize: "2rem", paddingRight: "1rem !important" }} />
          <span className="pl-3" style={{ marginLeft: "1.6rem" }}>
            Invite Collaborators
          </span>
        </MenuItem>
      ),
      key: "1"
      // disabled: true
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
        const { data: presentation, message, status } = response;
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
              const { data: slide, message, status } = values;
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