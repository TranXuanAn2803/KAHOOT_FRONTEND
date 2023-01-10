import { BroadcastChannel } from "broadcast-channel";
import { toast } from "react-toastify";
const logoutChannel = new BroadcastChannel("logout");

export const onLogout = () => {
  console.log("call onLogout");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  sessionStorage.clear();
  toast.success("Successfully logged out", {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    theme: "light"
  });
  window.location.href = window.location.origin + "/";
};

export const printMessage = (status, msg) => {
  if (status !== 200) {
    toast.error(msg, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      theme: "light"
    });
  } else {
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
};

// export const logoutAllTabs = () => {
//   console.log("go to logout channel");
//   logoutChannel.onmessage = () => {
//     onLogout();
//     logoutChannel.close();
//   };
// };
