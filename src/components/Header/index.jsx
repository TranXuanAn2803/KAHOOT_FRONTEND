import React, { useContext, useState } from "react";
import Container from "react-bootstrap/Container";
import Avatar from "@mui/material/Avatar";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import { Styled, MenuItem as MenuBarItem, MenuBar, MenuList } from "./style.jsx";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import LogoutIcon from "@mui/icons-material/Logout";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import PersonIcon from "@mui/icons-material/Person";
import { Link } from "react-router-dom";
import { onLogout } from "../../utils/method.jsx";
import UserContext from "../../utils/UserContext.jsx";

// Lấy 2 chữ cái đầu của tên cho Avatar.
function stringAvatar(name) {
  if (name !== undefined && name !== null) {
    const wordArr = name.trim().split(" ");
    if (!wordArr || wordArr.length < 0) {
      return { children: "Ig" };
    }
    if (wordArr.length == 1) {
      var word = wordArr[0];
      if (word.length == 1) return { children: word };
      return { children: word.substring(0, 2) };
    }
    return {
      children: `${wordArr[0][0]}${wordArr[1][0]}`
    };
  }
}

export const Header = function(props) {
  const [currentUser, setCurrentUser] = useContext(UserContext);

  return (
    <>
      <MenuBar id="menubar-horizontal" bg="light" className="d-flex">
        <Container fluid style={{ height: "inherit" }}>
          <MenuBar.Brand href="/">
            <img id="logo" style={{ width: "4rem" }} src="/assets/images/google-classroom.png" />
          </MenuBar.Brand>
          {/* <MenuBar.Toggle aria-controls="navbar-nav" /> */}
          <MenuList className="me-auto">
            <MenuBarItem to="/home">Home</MenuBarItem>
            <MenuBarItem to="/groups">Groups</MenuBarItem>
          </MenuList>
          <MenuList className="d-flex align-items-center justify-content-evenly">
            <CreatingButton variant="contained" id="create-btn" className="m-2 expanded">
              <AddIcon className="d-lg-none" fontSize="large" />
              <p className="d-none d-lg-block mb-0">Create</p>
            </CreatingButton>
            <AvatarButton>
              <Avatar
                {...stringAvatar(currentUser?.name || currentUser?.username)}
                className="bg-success"
                role="button"
                sx={{ fontSize: "1.6rem" }}
              />
            </AvatarButton>
            <NotificationsOutlinedIcon
              className="m-2"
              sx={{ width: "4rem", height: "4rem" }}
              role="button"
            />
          </MenuList>
        </Container>
      </MenuBar>
    </>
  );
};

const DefaultHeader = props => {
  return (
    <>
      <MenuBar id="menubar-horizontal" bg="light" className="d-none d-md-flex">
        <Container fluid style={{ height: "inherit" }}>
          <MenuBar.Brand href="/">
            <img id="logo" style={{ width: "4rem" }} src="/assets/images/google-classroom.png" />
          </MenuBar.Brand>
        </Container>
      </MenuBar>
    </>
  );
};

const FullHeader = props => {
  return (
    <>
      <MenuBar id="menubar-horizontal" bg="light" className="d-none d-md-flex">
        <Container fluid style={{ height: "inherit" }}>
          <MenuBar.Brand href="/">
            <img id="logo" style={{ width: "4rem" }} src="/assets/images/google-classroom.png" />
          </MenuBar.Brand>
          {/* <MenuBar.Toggle aria-controls="navbar-nav" /> */}
          <MenuList className="me-auto">
            <MenuBarItem to="/home">Home</MenuBarItem>
            <MenuBarItem to="/groups">Groups</MenuBarItem>
          </MenuList>
          <MenuList className="d-flex align-items-center justify-content-evenly">
            <CreatingButton variant="contained" id="create-btn" className="m-2 expanded">
              <AddIcon className="d-lg-none" fontSize="large" />
              <p className="d-none d-lg-block mb-0">Create</p>
            </CreatingButton>
            <AvatarButton>
              <Avatar
                {...stringAvatar("Kent Dodds")}
                className="bg-success"
                role="button"
                sx={{ fontSize: "1.6rem" }}
              />
            </AvatarButton>
            <NotificationsOutlinedIcon
              className="m-2"
              sx={{ width: "4rem", height: "4rem" }}
              role="button"
            />
          </MenuList>
        </Container>
      </MenuBar>
    </>
  );
};

//#region Create Button

function CreatingButton(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="create-btn"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        variant="contained"
        className="m-2 expanded"
        sx={{
          fontSize: "1.4rem",
          boxShadow: "rgb(0 0 0 / 25%) 0px -4px inset",
          "&:hover": { boxShadow: "rgb(0 0 0 / 25%) 0px -2px inset" }
        }}>
        {props.children}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
        MenuListProps={{
          "aria-labelledby": "create-btn"
        }}
        sx={{ zIndex: "9999" }}>
        <MenuItem className="button-creator-container" onClick={handleClose}>
          <a className="text-decoration-none text-dark" href="/groups/create">
            <span style={{ fontSize: "1.4rem" }}>Create new group</span>
          </a>
        </MenuItem>
        <MenuItem>
          <a className="text-decoration-none text-dark" href="/presentation/creator">
            <span style={{ fontSize: "1.4rem" }}>Create new presentation</span>
          </a>
        </MenuItem>
      </Menu>
    </div>
  );
}

//#endregion

//#region Avatar Button
function AvatarButton(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        id="avatar-btn"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        className="p-0 m-2">
        {props.children}
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
        MenuListProps={{
          "aria-labelledby": "basic-button"
        }}
        sx={{ zIndex: "9999" }}>
        <Link className="text-decoration-none text-dark" to="/user/profile">
          <MenuItem onClick={handleClose} sx={{ minWidth: "4rem" }}>
            <ListItemIcon>
              <PersonIcon fontSize="large" />
            </ListItemIcon>
            <ListItemText>
              <span style={{ fontSize: "1.4rem" }}>My Profile</span>
            </ListItemText>
          </MenuItem>
        </Link>
        <div
          className="text-decoration-none text-dark"
          onClick={() => onLogout()}
          sx={{ fontSize: "1.4rem" }}>
          <MenuItem onClick={handleClose} sx={{ minWidth: "4rem" }}>
            <ListItemIcon>
              <LogoutIcon fontSize="large" />
            </ListItemIcon>
            <ListItemText>
              <span style={{ fontSize: "1.4rem" }}>Log out</span>
            </ListItemText>
          </MenuItem>
        </div>
      </Menu>
    </>
  );
}
//#endregion
