import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./style.css";
import "./toast.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.minimal.css";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ToastContainer />
    <App />
  </React.StrictMode>
);