import React, { useEffect, useContext } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { createGroup, fetchGroup } from "../../../utils/api";
import AddIcon from "@mui/icons-material/Add";
import GroupsIcon from "@mui/icons-material/Groups";
import {
  Box,
  Button,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography
} from "@mui/material";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from "yup";
import { Styled, StyledNavLink } from "./style";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import UserContext from "../../../utils/UserContext";
import { Menu } from "antd";
import { Header } from "../../../components/Header";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3
};

const queryClient = new QueryClient();
export default function ListGroup() {
  const [currentUser, setCurrentUser] = useContext(UserContext);
  // console.log("currentUser", currentUser);
  return (
    <QueryClientProvider client={queryClient}>
      <GroupsPage />
    </QueryClientProvider>
  );
}

const drawerWidth = 240;


function GroupsPage() {
  const [open, setOpen] = React.useState(false);
  const [data, setData] = React.useState([]);
  const accessToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    formik.setFieldValue("name", "");
  };
  const GroupSchema = Yup.object({
    name: Yup.string().max(20, "Maximine 20 characters").required("Name required")
  });

  const formik = useFormik({
    initialValues: {
      name: ""
    },
    validationSchema: GroupSchema,
    onSubmit: async (value) => {
      // console.log("accessToken=", accessToken);
      const data = await createGroup(value.name, accessToken);
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
      handleClose();
      reloadGroup("");
      const msg = `Group ${data.data.group.name} have successfully create`;
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
  const reloadGroup = async (params) => {
    const list = await fetchGroup(params, accessToken);
    setData(list.groups);
  };
  useEffect(() => {
    document.title = "My Groups - KKahoot";
    document.getElementById("root").style.backgroundImage = "none";
  }, []);
  
  const verifyToken = async () => {
    if (!accessToken) {
      navigate("/signin");
    }
  };

  useEffect(() => {
    verifyToken();
    reloadGroup("");
  }, []);

  const getGroupDetail = (groupId) => {
    // console.log(groupId);
    navigate("/group-detail", { state: { id: groupId } });
  };
  var MenuItemList = [
    getItem(
      <Button onClick={() => {reloadGroup("");}}>
        <GroupsIcon style={{ fontSize: "2rem" }} />
        <p style={{ marginLeft: "1rem" }}></p>
        Group I've joined
      </Button>,
      "menuitem_1"
    ),
    getItem(
      <Button onClick={() => {reloadGroup("/owner");}}>
        <GroupsIcon style={{ fontSize: "2rem" }} />
        <p style={{ marginLeft: "1rem" }}></p>
        Group I manage
      </Button>,
      "menuitem_2"
    )
];


  return (
    <>
      <Header />
      <Menu
        style={{
          width: drawerWidth,
          position: "absolute",
          left: 0,
          top: "6.4rem",
          bottom: 0,
          fontSize: "1.4rem",
          paddingTop: "2.4rem",
          boxShadow: "rgb(0 0 0 / 5%) 4px 0px 8px 0px"
        }}
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["menuitem_1"]}
        mode="inline"
        items={MenuItemList}
      />
      <Styled>
        <Box sx={{ display: "block", width: "100%" }}>
          <Modal hideBackdrop open={open} onClose={handleClose}>
            <Box sx={{ ...style, width: 200 }}>
              <form className="form" method="post" onSubmit={formik.handleSubmit} autoComplete="on">
                <div className="input-box">
                  <label htmlFor="name" className="input-label">
                    Tên
                  </label>
                  <input
                    className="input-text"
                    id="name"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    type="text"
                    placeholder="Nhập Tên"
                  />
                  {formik.errors.name && formik.touched.name && (
                    <p className="error-message">{formik.errors.name}</p>
                  )}
                </div>

                <Button variant="contained" type="submit">
                  Tạo Nhóm
                </Button>
                <Button variant="contained" onClick={handleClose}>
                  Hủy
                </Button>
              </form>
            </Box>
          </Modal>
          <div className="group-list-top-bar">
            <button type="button" onClick={handleOpen} className="create-group-button">
              Create group
            </button>
          </div>
          <Box
            component="main"
            sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
            <Toolbar />
            <TableContainer className="table-container" component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableBody>
                  {data.map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                      onClick={() => getGroupDetail(row.id)}>
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Styled>
    </>
  );
}

// #region Create Dynamic Menu Item

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type
  };
}


// #endregion
