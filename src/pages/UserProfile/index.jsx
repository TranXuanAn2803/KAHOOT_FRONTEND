import React, { useContext, useEffect, useState } from "react";
import {
  Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  Outlet,
  useNavigate
} from "react-router-dom";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import styled from "styled-components";

import { EditProfileScreen } from "./EditProfile";
import { ChangePassWordScreen } from "./ChangePassword";
import UserContext from "../../utils/UserContext";

export const UserProfile = function (props) {
  return (
    <>
      <Outlet />
    </>
  );
};

export const DefaultProfile_ = function (props) {
  useEffect(() => {
    document.title = "Your Profile";
    document.getElementById("root").style.backgroundImage = "none";
  }, []);
  return <h2>This is user Profile</h2>;
};

const handleChange = (event, newValue) => {
  setValue(newValue);
};

export const ProfileSetting = function (props) {
  const [value, setValue] = useState("1");
  const [currentUser, setCurrentUser] = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Your Profile";
    document.getElementById("root").style.backgroundImage = "none";
  }, []);
  // useEffect(() => {
  //   console.log("currentUser ", currentUser);
  // }, [currentUser]);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <div style={{ minHeight: "80rem" }}>
      <h3 className="my-5" style={{ fontSize: "2.8rem", fontWeight: "600" }}>
        Settings
      </h3>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <StyledTabList
              onChange={handleChange}
              aria-label="lab API tabs example"
              textColor="secondary"
              indicatorColor="secondary">
              <StyledTab
                // style={{ color: "#009e58 !important", fontSize: "1.6rem !important" }}
                label="Edit profile"
                value="1"
              />
              <StyledTab label="Privacy" value="2" />
              <StyledTab label="Change password" value="3" />
            </StyledTabList>
          </Box>
          <StyledTabPanel value="1" sx={{ fontSize: "1.4rem" }}>
            <EditProfileScreen />
          </StyledTabPanel>
          <StyledTabPanel value="2">Your Privacy</StyledTabPanel>
          <StyledTabPanel value="3">
            <ChangePassWordScreen />
          </StyledTabPanel>
        </TabContext>
      </Box>
    </div>
  );
};

const StyledTabList = styled(TabList)`
& .MuiTabs-indicator {
  background-color: #584491 !important;
}`;

const StyledTab = styled(Tab)`
  font-size: 1.6rem !important;
  font-weight: 700 !important;
  text-transform: capitalize !important;
  &.Mui-selected {
    color: #584491 !important;
  }
`;

const StyledTabPanel = styled(TabPanel)`
  fontsize: 1.4rem !important;
`;
