import React, { useState, createContext, useEffect, useMemo } from "react";
import { isAuthenticated } from "./AuthService";
import { useNavigate } from "react-router-dom";
const UserContext = createContext();

const userDefault = {
  id: "",
  username: "",
  email: "",
  name: ""
};

export const UserProvider = ({ children }) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState();
  useEffect(() => {
    // console.log("vao useEffect: " + currentUser);
    const checkLoggedIn = async () => {
      const cuser = await isAuthenticated();
      if (cuser?.user != undefined) {
        setCurrentUser(cuser.user);
      }
    };

    checkLoggedIn();
  }, []);

  let values = useMemo(() => [currentUser, setCurrentUser], [currentUser]);
  return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
};
export default UserContext;
