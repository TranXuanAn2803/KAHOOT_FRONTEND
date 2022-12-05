import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useLocation } from 'react-router'
import {  Divider  } from '@mui/material';
import { useNavigate } from "react-router-dom";
import LogoutIcon from '@mui/icons-material/Logout';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { exitsGroup} from "../../../utils/api";
import { toast } from "react-toastify";
import { useEffect } from "react";

export default function GroupSile() {
  const {state} = useLocation();
  const [ id, setId] = React.useState(); 

  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");
  const leaveGroup = async() => {
    const data = await exitsGroup(id, accessToken );
    if (data.status != 200) {
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
    navigate('/groups')

    const msg = `Leaving group is successful `;
    toast.success(msg, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "light"
    });
  };
  const getMemeber = () => {
    navigate('/group-members', { state: { id: id } });
  };
  const getSlide = () => {
    navigate('/group-slides', { state: { id: id } });
  };
  const back = () => {
    navigate('/groups');
  };
  const verifyToken = async () => {
      // console.log("jdjnfsdj:", accessToken)
      if (!accessToken) {
          navigate("/signin");
      }
  };
  useEffect(() => {
      if(!state||!state.id) 
      {
        navigate("/groups");
        const msg = `Group is undefined `;
        toast.error(msg, {
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
      setId(state.id)
    

      verifyToken();
  }, []);

  return (
    <div>
        <Toolbar>
            <Typography variant="h6" component="div" style={{ color: 'black' }}>
            Danh Sách Nhóm
            </Typography>
            <Box sx={{ marginLeft: "auto" }}>
            <Button variant="contained" startIcon={<ArrowBackIcon /> } onClick={back}></Button>
            <Button variant="contained" startIcon={<LogoutIcon /> } onClick={leaveGroup}>Rời Nhóm</Button>
            </Box>
        </Toolbar>
        <Box sx={{ flexGrow: 1 }}>
            
            <Toolbar>
            <Button key="members" sx={{ color: 'black', p: 2, mr: 6 }} onClick={getMemeber}>
            Danh sách Thành Viên
            </Button>
            <Button key="slides" sx={{ color: 'black', p: 2 }} onClick={getSlide}>
            Chia sẻ Bộ Câu Hỏi
            </Button>
        </Toolbar>

        </Box>
        <Toolbar>
            <Card sx={{ minWidth: 275 }}>
                <CardContent>
                    <Typography variant="h5" component="div">
                        Chia Sẻ Các Bộ Câu Hỏi
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small">Chia Sẻ</Button>
                    <Button size="small">Tạo Bộ Câu Hỏi Mới</Button>

                </CardActions>
            </Card>

        </Toolbar>

    </div>
  );
}