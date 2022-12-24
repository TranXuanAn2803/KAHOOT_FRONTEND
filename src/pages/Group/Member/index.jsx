import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  fetchUsers,
  addGroupMember,
  fetchGroupMember,
  toggleRole,
  fetchListUser,
  exitsGroup
} from "../../../utils/api";
import { useQuery, QueryClient, QueryClientProvider } from "react-query";
// import { onLogout } from "../../utils/method";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router";

import { Layout, Space, Table, Button, Form, Input, Modal, Select, Tabs } from "antd";
import { Header } from "../../../components/Header";
import SideBar from "../SideBar";
const { Column } = Table;

const queryClient = new QueryClient();
export default function GroupMember() {
  return (
    <QueryClientProvider client={queryClient}>
      <MemberPage />
    </QueryClientProvider>
  );
}
const userRole = [
  {
    value: "owner",
    label: "owner"
  },
  {
    value: "co-owner",
    label: "co-owner"
  },
  {
    value: "member",
    label: "member"
  }
];
const items = [
  {
    label: `Sharing Slide`,
    key: "1"
  },
  {
    label: `Group Member`,
    key: "2"
  }
];

function MemberPage() {
  const [openRoleForm, setOpenRoleForm] = React.useState(false);
  const [openAddForm, setOpenAddForm] = React.useState(false);
  const [addForm] = Form.useForm();
  const [roleForm] = Form.useForm();

  const [data, setData] = React.useState([]);
  const [currentMember, setCurrentMember] = React.useState(null);
  const [listUser, setListUser] = React.useState();

  const { state } = useLocation();
  const [id, setId] = React.useState();
  const accessToken = localStorage.getItem("accessToken");

  const handleOpenRoleForm = (rowId) => {
    setCurrentMember(rowId);
    setOpenRoleForm(true);
  };
  const handleCloseRoleForm = () => {
    setOpenRoleForm(false);
    roleFormik.setFieldValue("role", "");
    roleForm.resetFields();
  };
  const handleOpenAddForm = () => {
    setOpenAddForm(true);
  };
  const handleCloseAddForm = () => {
    setOpenAddForm(false);
    addFormik.setFieldValue("email", "");
    addForm.resetFields();
  };

  const RoleSchema = Yup.object({
    role: Yup.string().required("Role required")
  });
  const verifyToken = async () => {
    // console.log("jdjnfsdj:", accessToken)
    if (!accessToken) {
      navigate("/signin");
    }
  };

  const roleFormik = useFormik({
    initialValues: {
      role: ""
    },
    validationSchema: RoleSchema,
    onSubmit: async (value) => {
      // console.log("submit ", value);
      const data = await toggleRole(value.role, currentMember, accessToken);
      if (data.status != 200) {
        // alert(data.data);
        toast.error(data.data, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          theme: "light"
        });
        return;
      }
      handleCloseRoleForm();
      reloadMember();

      const msg = `Updating new role is successful`;
      toast.success(msg, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "light"
      });
    }
  });
  const AddSchema = Yup.object({
    email: Yup.string()
      .email("Not a proper email")
      .min(10, "Minimum 10 characters")
      .required("Email required")
  });

  const addFormik = useFormik({
    initialValues: {
      email: ""
    },
    validationSchema: AddSchema,
    onSubmit: async (value) => {
      // console.log("submit ", value);
      const data = await addGroupMember(value.email, id, accessToken);
      // console.log("data register ", data);
      if (data.status != 200) {
        // alert(data.data);
        toast.error(data.data, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          theme: "light"
        });
        return;
      }
      reloadMember();
      handleCloseAddForm();
      const msg = `Adding member ${value.email} is successful `;
      toast.success(msg, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "light"
      });
    }
  });

  const navigate = useNavigate();

  const leaveGroup = async () => {
    const data = await exitsGroup(id, accessToken);
    if (data.status != 200) {
      toast.error(data.data, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "light"
      });
      return;
    }
    navigate("/groups");
    const msg = `Leaving group is successful `;
    toast.success(msg, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      theme: "light"
    });
  };
  const reloadMember = async () => {
    const list = await fetchGroupMember(state.id, accessToken);
    for (let user of list.users) {
      user.key = user.id;
    }
    setData(list.users);
  };
  const loadUser = async () => {
    const list = await fetchListUser(accessToken);
    let users = list.users;
    for (let u of users) {
      u.label = u.email;
      u.value = u.email;
    }

    setListUser(users);
  };

  useEffect(() => {
    if (!state || !state.id) {
      navigate("/groups");
      const msg = `Group is undefined `;
      toast.error(msg, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "light"
      });
      return;
    }
    setId(state.id);
    verifyToken();
    reloadMember();
    loadUser();
  }, []);
  const onChange = (key) => {
    switch (key) {
      case "1":
        navigate("/group-detail", { state: { id: id } });
        break;
    }
  };

  return (
    <>
      <Layout width="100%">
        <Header />
        <SideBar selectedKey="" />
        <Layout>
          <Styled>
            <div className="group-list-top-bar">
              <button type="button" onClick={handleOpenAddForm} className="create-group-button">
                Add member
              </button>
              <button type="button" onClick={leaveGroup} className="create-group-button">
                Leave Group
              </button>
            </div>
            <div>
              <Tabs
                defaultActiveKey="2"
                onChange={onChange}
                className="main-content"
                style={{ left: 300, position: "relative" }}
                items={items}
              />
              <Table
                dataSource={[...data]}
                style={{
                  left: 300,
                  position: "relative",
                  width: "75%"
                }}>
                <Column title="Email" dataIndex="email" key="email" width="50%" />
                <Column title="Role" dataIndex="role" key="role" width="20%" />

                <Column
                  title="Action"
                  key="id"
                  dataIndex="id"
                  render={(record) => (
                    <Space size="middle">
                      <Button
                        type="primary"
                        onClick={() => {
                          handleOpenRoleForm(record);
                        }}>
                        Change Role
                      </Button>
                    </Space>
                  )}
                />
              </Table>
            </div>
            <Modal title="Invited Member" open={openAddForm} footer={null}>
              <Form name="basic" onSubmit={addFormik.handleSubmit} form={addForm}>
                <Form.Item label="Email" name="email">
                  <Select
                    showSearch
                    placeholder="Select a person"
                    optionFilterProp="children"
                    onChange={(e) => {
                      console.log(e);
                      addFormik.setFieldValue("email", e);
                    }}
                    filterOption={(input, option) =>
                      (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                    }
                    options={listUser}
                  />
                </Form.Item>
                {addFormik.errors.email && addFormik.touched.email && (
                  <p className="error-message">{addFormik.errors.email}</p>
                )}
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                  <Button
                    type="primary"
                    onClick={addFormik.handleSubmit}
                    style={{ margin: "10px" }}
                    htmlType="submit">
                    Submit
                  </Button>
                  <Button style={{ margin: "10px" }} onClick={handleCloseAddForm} htmlType="button">
                    Cancel
                  </Button>
                </Form.Item>
              </Form>
            </Modal>
            <Modal title="Change Member's Role" open={openRoleForm} footer={null}>
              <Form name="basic" onSubmit={roleFormik.handleSubmit} form={roleForm}>
                <Form.Item label="Email" name="email">
                  <Select
                    showSearch
                    placeholder="Select a person"
                    optionFilterProp="children"
                    onChange={(e) => {
                      roleFormik.setFieldValue("role", e);
                    }}
                    filterOption={(input, option) =>
                      (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                    }
                    options={userRole}
                  />
                </Form.Item>
                {roleFormik.errors.email && roleFormik.touched.email && (
                  <p className="error-message">{roleFormik.errors.email}</p>
                )}
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                  <Button
                    type="primary"
                    onClick={roleFormik.handleSubmit}
                    style={{ margin: "10px" }}
                    htmlType="submit">
                    Submit
                  </Button>
                  <Button
                    style={{ margin: "10px" }}
                    onClick={handleCloseRoleForm}
                    htmlType="button">
                    Cancel
                  </Button>
                </Form.Item>
              </Form>
            </Modal>
          </Styled>
        </Layout>
      </Layout>
    </>
  );
}
