import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Button from "@mui/material/Button";

import { getAGroup, confirmGroupInvitation } from "../../../utils/api";
import { useQuery, QueryClient, QueryClientProvider } from "react-query";
import { onLogout } from "../../../utils/method";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import UserContext from "../../../utils/UserContext";
import { toast } from "react-toastify";

const queryClient = new QueryClient();
export default function GroupInvitation() {
  return (
    <QueryClientProvider client={queryClient}>
      <InvitationPage />
    </QueryClientProvider>
  );
}

function InvitationPage() {
  let { id } = useParams();
  // console.log("parameter:", id )
  const accessToken = localStorage.getItem("accessToken");
  const [group, setGroup] = useState(null);

  const handleClick = async () => {
    const data = await confirmGroupInvitation(id, accessToken);
    // console.log(data);
    toast.success(data, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      theme: "light"
    });
  };

  const verifyToken = async () => {
    // console.log("jdjnfsdj:", accessToken)
    if (!accessToken) {
      navigate("/signin");
    }
  };
  useEffect(() => {
    if (!id || id.length == 0) {
      navigate("/groups");
      const msg = `Group is undefined `;
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
    verifyToken();
    getGroup();
  }, []);
  const getGroup = async () => {
    const data = await getAGroup(id, accessToken);
    // console.log(data);
    setGroup(data.group);
  };

  return (
    <>
      <p className="text-black text-[40px]">
        Hello. Please list this button to join {group ? group.name : ""}
      </p>

      <Button
        id="confirm-btn"
        aria-haspopup="true"
        aria-expanded="true"
        onClick={handleClick}
        variant="contained"
        className="m-2 expanded"
        sx={{
          fontSize: "1.4rem",
          boxShadow: "rgb(0 0 0 / 25%) 0px -4px inset",
          "&:hover": { boxShadow: "rgb(0 0 0 / 25%) 0px -2px inset" }
        }}>
        Join Group
      </Button>
    </>
  );
}
