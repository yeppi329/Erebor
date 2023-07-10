import * as React from 'react';
import { useNavigate } from "react-router-dom";
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FolderIcon from '@mui/icons-material/Folder';
import List from '@mui/material/List';


function MainListItems (){
  
const navigate = useNavigate();

const onClickDashboard = () => {
  navigate("/dashboard");
};
const onClickNas = () => {
  navigate("/nasdata");
};


  return (
    <div>
    <List component="nav">
    <ListItemButton onClick={onClickDashboard}>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItemButton>
    <ListItemButton onClick={onClickNas}>
      <ListItemIcon>
        <FolderIcon />
      </ListItemIcon>
      <ListItemText primary="NasData" />
    </ListItemButton>
    </List>
  </div>
);
}
export default MainListItems;