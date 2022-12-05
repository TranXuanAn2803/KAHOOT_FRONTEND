import { toast } from "react-toastify";
import { BroadcastChannel } from "broadcast-channel";

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
// export const logoutAllTabs = () => {
//   console.log("go to logout channel");
//   logoutChannel.onmessage = () => {
//     onLogout();
//     logoutChannel.close();
//   };
// };
