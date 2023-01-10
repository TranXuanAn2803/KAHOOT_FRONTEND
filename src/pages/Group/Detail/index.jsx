import React, { useEffect, useState, useCallback, useContext } from "react";
import AppBar from "@mui/material/AppBar";
import {
  exitsGroup,
  sendInvitationMail,
  fetchMyOwnPresent,
  sharePresentToGroup,
  fetchSharingPresent,
  removeSharingPresent,
  presentGroup,
  findGroupPresentation
} from "../../../utils/api";
import Toolbar from "@mui/material/Toolbar";
import { useLocation } from "react-router";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { toast } from "react-toastify";
import GroupsIcon from "@mui/icons-material/Groups";
import { Styled } from "./style";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Header } from "../../../components/Header";
import SideBar from "../SideBar";
import { Tabs, Form, Button, Modal, Input, Card, Table, Space, Select } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import { getPresentingRole, getSessionId, toggleStatusPresentation } from "../../Presentation/API";
import { printMessage } from "../../../utils/method";
import { SocketContext } from "../../../components/Socket/socket-client";
import UserContext from "../../../utils/UserContext";
const { Column } = Table;
const { Meta } = Card;

export default function GroupDetail() {
  const [open, setOpen] = React.useState(false);
  const [openShareForm, setOpenShareForm] = React.useState(false);
  const { state } = useLocation();
  const [id, setId] = React.useState();
  const [shareForm] = Form.useForm();
  const [data, setData] = React.useState([]);
  const [listPresent, setListPresent] = React.useState([]);
  const [form] = Form.useForm();
  const currentUrl = window.location.href;
  const URL = currentUrl.slice(0, currentUrl.lastIndexOf("/"));
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
  const [groupId, setGroupId] = useState("");
  const [sessionId, setSessionId] = useState("");
  const socket = useContext(SocketContext);
  const [currentUser, setCurrentUser] = useContext(UserContext);
  const [currentPresentation, setCurrentPresentation] = useState("");
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    formik.setFieldValue("email", "");
    setOpen(false);
    form.resetFields();
  };

  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");
  const handleOpenShareForm = () => {
    setOpenShareForm(true);
    console.log(openShareForm);
  };
  const handleCloseShareForm = () => {
    setOpenShareForm(false);
    shareFormik.setFieldValue("presentId", "");
    shareForm.resetFields();
  };

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
  const UserSchema = Yup.object({
    email: Yup.string()
      .email("Not a proper email")
      .min(10, "Minimum 10 characters")
      .required("Email required")
  });
  const verifyToken = async () => {
    if (!accessToken) {
      navigate("/signin");
    }
  };
  const ShareSchema = Yup.object({
    presentId: Yup.string().required("Name required")
  });

  const shareFormik = useFormik({
    initialValues: {
      presentId: ""
    },
    validationSchema: ShareSchema,
    onSubmit: async (value) => {
      console.log("submit ", value);
      const data = await sharePresentToGroup(value.presentId, id, accessToken);
      // // console.log("data register ", data);
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
      reloadPresent();
      handleCloseShareForm();
      const msg = `Sharing new present is successful `;
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
    loadPresent();
    verifyToken();
    reloadPresent();
  }, []);
  useEffect(() => {
    socket.on("new-session-for-game", (data) => {
      console.log("new sesssion for game ", data);
      if (data.status == 200) {
        printMessage(data.status, data.data.message);
        setSessionId(data.data.current_session);
      }
    });
    return () => {
      socket.off("new-session-for-game");
    };
  }, [socket]);

  const formik = useFormik({
    initialValues: {
      email: ""
    },
    validationSchema: UserSchema,
    onSubmit: async (value) => {
      console.log(value);
      const data = await sendInvitationMail(value.email, id, URL, accessToken);
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
      handleClose();
      const msg = `You have send mail for ${value.email} successfully `;
      toast.success(msg, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "light"
      });
      reloadGroup("");
    }
  });
  const onChange = (key) => {
    switch (key) {
      case "2":
        navigate("/group-members", { state: { id: id } });
        break;
    }
  };
  const loadPresent = async () => {
    const data = await fetchMyOwnPresent(accessToken);
    let list = data.data;
    for (let p of list) {
      p.label = p.name;
      p.value = p._id;
      p.username = p.created_by.username;
    }
    setListPresent(list);
  };
  const reloadPresent = async () => {
    const list = await fetchSharingPresent(state.id, accessToken);
    console.log("reloadPresent list", list);
    let present = [];
    for (let data of list.data) {
      let p = data.present;
      p.id = data._id;
      p.key = data._id;
      p.username = p.created_by.username;
      p.current_session=data.current_session;
      present.push(p);
      if (p.status === 2) {
        setCurrentPresentation(p._id);
        setSessionId(data.current_session);
        setGroupId(data.group_id);
      }
    }
    setData(present);
  };

  const handleRemovePresent = async (rowId) => {
    const data = await removeSharingPresent(rowId);
    console.log("data ", data);
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
    reloadPresent();
    const msg = `Removing present is successful `;
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
  const handleShowPresent = async (rowId) => {
    console.log("rowId ", rowId);
    const groupPresentation = await findGroupPresentation(rowId);
    console.log("groupPresentation ", groupPresentation);
    const presentationId = groupPresentation.data.data.presentation_id;
    const groupId = groupPresentation.data.data.group_id;
    const toggleStatus = await toggleStatusPresentation(presentationId, 2, groupId); // 2: trạng thái chỉ trình chiếu chiếu trong group
    console.log(
      "🚀 ~ file: index.jsx:272 ~ handleShowPresent ~ toggleStatusPresentation",
      toggleStatus
    );
    if (toggleStatus.status === 200) {
      printMessage(toggleStatus.status, toggleStatus.message);
      navigate(`/presentations/${currentPresentation}/show/${groupId}`);

    } else {
      printMessage(toggleStatus.status, toggleStatus.message);
    }
    socket.emit("init-game", { id: presentationId, groupId, user: currentUser });
    setCurrentPresentation(presentationId);
    reloadPresent();
  };
  const PresentCard = () => {
    let cardData = null;
    let description = "";

    for (let i = 0; i < data.length; i++) {

      if (data[i].current_session!=undefined &&data[i].current_session.length>0) {

        cardData = data[i];
        description = `The presentation name ${data[i].name} is starting. Use this code to join ${currentPresentation} `;
      }
    }
    if (!cardData) {
      return <></>;
    } else {
      return (
        <Card
          className="main-content"
          style={{ width: 300, left: 300, margin: 10, position: "relative" }}
          cover={
            <img
              alt="slide"
              src="/assets/images/barchart.jpg"
              onClick={() => presentCardPresentation()}
            />
          }>
          <Meta title="Slide title" description={description} />
        </Card>
      );
    }
  };
  const presentCardPresentation = async () => {
    const response = await getPresentingRole(currentPresentation, sessionId);
    console.log("presentCardPresentation response ", response);
    const role = response.data.role;
    if (role == "admin") {
      // presentationId / groupId
      navigate(`/presentations/${currentPresentation}/show/${groupId}`);
    } else {
      navigate(`/presentations/public/${groupId}/${currentPresentation}`);
    }
  };

  return (
    <>
      <Header />
      <SideBar selectedKey="" />
      <Styled>
        <div className="group-list-top-bar">
          <button type="button" onClick={handleOpenShareForm} className="create-group-button">
            Share Present
          </button>
          <button type="button" onClick={handleOpen} className="create-group-button">
            Invite
          </button>
          <button type="button" onClick={leaveGroup} className="create-group-button">
            Leave Group
          </button>
        </div>
        <div>
          <Tabs
            defaultActiveKey="1"
            onChange={onChange}
            className="main-content"
            style={{ left: 300, position: "relative" }}
            items={items}
          />
          <PresentCard />
          <Table
            dataSource={[...data]}
            style={{
              left: 300,
              position: "relative",
              width: "75%"
            }}>
            <Column title="Name" dataIndex="name" key="name" width="50%" />
            <Column title="Share By" dataIndex="username" key="username" width="20%" />
            <Column
              title="Action"
              key="id"
              dataIndex="id"
              render={(record) => (
                <Space size="middle">
                  <Button
                    type="primary"
                    onClick={() => {
                      handleShowPresent(record);
                    }}>
                    Present
                  </Button>
                  <Button
                    type="primary"
                    danger
                    onClick={() => {
                      handleRemovePresent(record);
                    }}>
                    Remove
                  </Button>
                </Space>
              )}
            />
          </Table>
        </div>
        <Modal title="Invited Member" open={open} footer={null}>
          <Form name="basic" onSubmit={formik.handleSubmit} form={form}>
            <Form.Item
              label="Email"
              name="email"
              onChange={(e) => {
                formik.setFieldValue("email", e.target.value);
              }}>
              <Input placeholder="Input member's email" />
            </Form.Item>
            {formik.errors.email && formik.touched.email && (
              <p className="error-message">{formik.errors.email}</p>
            )}
            <Form.Item label="Link" name="link">
              <Input
                style={{ width: "calc(100% - 40px)" }}
                defaultValue={`${URL}/group-invitation/${id}`}
              />
              <Button
                icon={<CopyOutlined />}
                onClick={() => {
                  navigator.clipboard.writeText(`${URL}/group-invitation/${id}`);
                  toast.success("Coppy link to your clipboard successfully", {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    theme: "light"
                  });
                }}
              />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button
                type="primary"
                onClick={formik.handleSubmit}
                style={{ margin: "10px" }}
                htmlType="submit">
                Submit
              </Button>
              <Button style={{ margin: "10px" }} onClick={handleClose} htmlType="button">
                Cancel
              </Button>
            </Form.Item>
          </Form>
        </Modal>
        <Modal title="Share New Slide" open={openShareForm} footer={null}>
          <Form onSubmit={shareFormik.handleSubmit} form={shareForm}>
            <Form.Item label="Name" name="name">
              <Select
                showSearch
                placeholder="Select a slide"
                optionFilterProp="children"
                onChange={(e) => {
                  console.log(e);
                  shareFormik.setFieldValue("presentId", e);
                }}
                filterOption={(input, option) =>
                  (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                }
                options={listPresent}
              />
            </Form.Item>
            {shareFormik.errors.presentId && shareFormik.touched.presentId && (
              <p className="error-message">{shareFormik.errors.presentId}</p>
            )}
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button
                type="primary"
                onClick={shareFormik.handleSubmit}
                style={{ margin: "10px" }}
                htmlType="submit">
                Submit
              </Button>
              <Button style={{ margin: "10px" }} onClick={handleCloseShareForm} htmlType="button">
                Cancel
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Styled>
    </>
  );
}
