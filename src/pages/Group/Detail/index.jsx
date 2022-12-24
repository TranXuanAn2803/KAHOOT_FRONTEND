import React, { useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import { exitsGroup, sendInvitationMail } from "../../../utils/api";
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
import { Tabs, Form, Button, Modal, Input, Card } from "antd";
import { CopyOutlined, EditOutlined, EllipsisOutlined } from "@ant-design/icons";
const { Meta } = Card;

export default function GroupDetail() {
  const [open, setOpen] = React.useState(false);
  const { state } = useLocation();
  const [id, setId] = React.useState();
  const handleOpen = () => {
    setOpen(true);
  };
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
  const handleClose = () => {
    formik.setFieldValue("email", "");
    setOpen(false);
    form.resetFields();
  };

  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");

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
  }, []);

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
  return (
    <>
      <Header />
      <SideBar selectedKey="" />
      <Styled>
        <div className="group-list-top-bar">
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
          <Card
            className="main-content"
            style={{ width: 300, left: 300, position: "relative" }}
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            actions={[<EditOutlined key="edit" />, <EllipsisOutlined key="ellipsis" />]}>
            <Meta title="Slide title" description="This is the description" />
          </Card>
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
      </Styled>
    </>
  );
}
