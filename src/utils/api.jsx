import axios from "axios";
import { ApiConfig as _ParamConfig } from "../actions/constants";
import { toggleStatusPresentation } from "../pages/Presentation/API";
const URL = _ParamConfig.serverUrl;
export const fetchUsers = async (accessToken) => {
  const { data } = await axios.get(`${URL}/users`, {
    headers: {
      x_authorization: accessToken
    }
  });
  return data;
};
export const registerUser = async (username, email, password) => {
  try {
    const response = await axios
      .post(`${URL}/auth/register`, {
        username: username,
        password: password,
        email: email
      })
      .catch((error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          const objectReturn = {
            data: error.response.data,
            status: error.response.status
          };
          return objectReturn;
        }
      });
    const { data, status } = response;
    const objectReturn = {
      data: data,
      status: status
    };
    return objectReturn;
  } catch (err) {
    console.log("err", err);
  }
};
export const loginUser = async (username, password) => {
  // console.log("URL login ", URL);
  const response = await axios
    .post(`${URL}/auth/login`, {
      username,
      password
    })
    .catch((error) => {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const objectReturn = {
          data: error.response.data,
          status: error.response.status
        };
        return objectReturn;
      }
    });
  const { data, status } = response;
  const objectReturn = {
    data: data,
    status: status
  };
  return objectReturn;
};
export const loginUserWithGoogle = async (tokenId) => {
  const response = await axios
    .post(`${URL}/auth/google`, {
      token: tokenId
    })
    .catch((error) => {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const objectReturn = {
          data: error.response.data,
          status: error.response.status
        };
        return objectReturn;
      }
    });
  const { data, status } = response;
  const objectReturn = {
    data: data,
    status: status
  };
  return objectReturn;
};
export const sendChangePasswordMail = async (email) => {
  const response = await axios
    .post(`${URL}/auth/change-password`, {
      email
    })
    .catch((error) => {
      console.log("error ", error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const objectReturn = {
          data: error.response.data,
          status: error.response.status
        };
        return objectReturn;
      }
    });
  const { data, status } = response;
  const objectReturn = {
    data: data,
    status: status
  };
  console.log("objectReturn ", objectReturn);
  return objectReturn;
  //   return response;
  // } catch (err) {
  //   console.log("Error while send change password ", err);
  // }
};
export const createGroup = async (name, accessToken) => {
  try {
    const response = await axios
      .post(
        `${URL}/group`,
        {
          name: name
        },
        {
          headers: {
            x_authorization: accessToken
          }
        }
      )
      .catch((error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          const objectReturn = {
            data: error.response.data,
            status: error.response.status
          };
          return objectReturn;
        }
      });
    const { data, status } = response;
    const objectReturn = {
      data: data,
      status: status
    };
    return objectReturn;
  } catch (err) {
    console.log("err", err);
  }
};
export const fetchGroup = async (params, accessToken) => {
  const { data } = await axios.get(`${URL}/group` + params, {
    headers: {
      x_authorization: accessToken
    }
  });
  return data;
};
export const addGroupMember = async (email, id, accessToken) => {
  try {
    const response = await axios
      .post(
        `${URL}/group/${id}`,
        {
          email: email
        },
        {
          headers: {
            x_authorization: accessToken
          }
        }
      )
      .catch((error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          const objectReturn = {
            data: error.response.data,
            status: error.response.status
          };
          return objectReturn;
        }
      });
    const { data, status } = response;
    const objectReturn = {
      data: data,
      status: status
    };
    return objectReturn;
  } catch (err) {
    console.log("err", err);
  }
};
export const sharePresentToGroup = async (id, groupId, accessToken) => {
  try {
    const response = await axios
      .put(
        `${URL}/presentation/share/${id}`,
        {
          groupId: groupId
        },
        {
          headers: {
            x_authorization: accessToken
          }
        }
      )
      .catch((error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          const objectReturn = {
            data: error.response.data,
            status: error.response.status
          };
          return objectReturn;
        }
      });
    const { data, status } = response;
    const objectReturn = {
      data: data,
      status: status
    };
    return objectReturn;
  } catch (err) {
    console.log("err", err);
  }
};

export const fetchGroupMember = async (id, accessToken) => {
  const { data } = await axios.get(`${URL}/group/member/${id}`, {
    headers: {
      x_authorization: accessToken
    }
  });
  return data;
};
export const fetchSharingPresent = async (id, accessToken) => {
  const { data } = await axios.get(`${URL}/presentation/share/${id}`, {
    headers: {
      x_authorization: accessToken
    }
  });
  return data;
};

export const fetchListUser = async (accessToken) => {
  const { data } = await axios.get(`${URL}/users/list`, {
    headers: {
      x_authorization: accessToken
    }
  });
  return data;
};
export const fetchMyOwnPresent = async (accessToken) => {
  const { data } = await axios.get(`${URL}/presentation/owner`, {
    headers: {
      x_authorization: accessToken
    }
  });
  return data;
};

export const toggleRole = async (newRole, id, accessToken) => {
  try {
    const response = await axios
      .post(
        `${URL}/group/toggleRole/${id}`,
        {
          newRole: newRole
        },
        {
          headers: {
            x_authorization: accessToken
          }
        }
      )
      .catch((error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          const objectReturn = {
            data: error.response.data,
            status: error.response.status
          };
          return objectReturn;
        }
      });
    const { data, status } = response;
    const objectReturn = {
      data: data,
      status: status
    };
    return objectReturn;
  } catch (err) {
    console.log("err", err);
  }
};
export const findGroupPresentation = async (id) => {
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await axios.get(`${URL}/groupPresentation/${id}`, {
      headers: {
        x_authorization: accessToken
      }
    });
    console.log("response ", response);
    const { data, status } = response;
    const objectReturn = {
      data: data,
      status: status
    };
    return objectReturn;
  } catch (error) {
    console.log("error", error);

    if (error.response) {
      const objectReturn = {
        data: error.response.message,
        status: error.response.status
      };
      return objectReturn;
    }
  }
};
export const presentGroup = async (id) => {
  try {
    const response = await toggleStatusPresentation(id, 2);
    const { data, status } = response;
    const objectReturn = {
      data: data,
      status: status
    };
    return objectReturn;
  } catch (error) {
    if (error.response) {
      const objectReturn = {
        data: error.response.data,
        status: error.response.status
      };
      return objectReturn;
    }
  }
};
export const removeSharingPresent = async (id, accessToken) => {
  const response = await axios
    .delete(`${URL}/presentation/share/${id}`, {
      headers: {
        x_authorization: accessToken
      }
    })
    .catch((error) => {
      if (error.response) {
        const objectReturn = {
          data: error.response.data,
          status: error.response.status
        };
        return objectReturn;
      }
    });
  const { data, status } = response;
  const objectReturn = {
    data: data,
    status: status
  };
  return objectReturn;
};

export const exitsGroup = async (id, accessToken) => {
  try {
    const response = await axios
      .get(`${URL}/group/escape/${id}`, {
        headers: {
          x_authorization: accessToken
        }
      })
      .catch((error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          const objectReturn = {
            data: error.response.data,
            status: error.response.status
          };
          return objectReturn;
        }
      });
    const { data, status } = response;
    const objectReturn = {
      data: data,
      status: status
    };
    return objectReturn;
  } catch (err) {
    console.log("err", err);
  }
};
export const sendInvitationMail = async (email, id, link, accessToken) => {
  try {
    const response = await axios
      .post(
        `${URL}/group/sendInvitation/${id}`,
        {
          email: email,
          URL: link
        },
        {
          headers: {
            x_authorization: accessToken
          }
        }
      )
      .catch((error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          const objectReturn = {
            data: error.response.data,
            status: error.response.status
          };
          return objectReturn;
        }
      });
    const { data, status } = response;
    const objectReturn = {
      data: data,
      status: status
    };
    return objectReturn;
  } catch (err) {
    console.log("err", err);
  }
};
export const getAGroup = async (id, accessToken) => {
  const { data } = await axios.get(`${URL}/group/${id}`, {
    headers: {
      x_authorization: accessToken
    }
  });
  return data;
};
export const confirmGroupInvitation = async (id, accessToken) => {
  const { data } = await axios.get(`${URL}/group/confirmMail/${id}`, {
    headers: {
      x_authorization: accessToken
    }
  });
  return data;
};
export const findUserByResetPasswordCode = async (resetPasswordCode) => {
  const { data } = await axios.get(`${URL}/auth/user/${resetPasswordCode}`);
  return data;
};
export const changePassword = async (password, resetPasswordCode) => {
  const { data } = await axios.post(`${URL}/auth/user/change-new-password`, {
    resetPasswordCode: resetPasswordCode,
    password: password
  });
  return data;
};
