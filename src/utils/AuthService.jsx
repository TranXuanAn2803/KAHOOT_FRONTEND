import { fetchUsers } from "./api";

export const isAuthenticated = async () => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    return null;
  }
  const user = await fetchUsers(accessToken);
  return user;
};
