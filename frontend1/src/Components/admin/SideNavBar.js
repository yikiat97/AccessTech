import logo from '../../assets/logo/logo_horizon.png';
import './css/admin.css';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import Paper from "@mui/material/Paper";

import GroupIcon from '@mui/icons-material/Group';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import PercentIcon from '@mui/icons-material/Percent';



function SideNavBar() {

  const [activeLink, setActiveLink] = useState("");
  console.log(activeLink);

  return (
    <Paper elevation={3}>
    <div className="sidebar">
       <img style={{width:"100%", height:"60px"}} src={logo} alt="Logo" />
      <ul className="sidebarList">
      <li className={`sidebarListItem ${activeLink === "/AccessTech/AdminHomepage" ? "active_link" : ""}`}>
          <GroupIcon className="icon"></GroupIcon>
          <NavLink 
            to="/AccessTech/AdminHomepage" 
            className="text_sidebar" 
            // isActive={(match, location) => {
            //   if(match) {
            //     setActiveLink("/AccessTech/AdminHomepage");
            //   }
            //   return match;
            // }}
          >
            Master Admin Overview
          </NavLink>
        </li>
      <li className={`sidebarListItem ${activeLink === "/AccessTech/AdminOrderpage" ? "active_link" : ""}`}>
          <MenuBookIcon className="icon"></MenuBookIcon>
          <NavLink 
            to="/AccessTech/AdminOrderpage" 
            className="text_sidebar" 
            // isActive={(match, location) => {
            //   if(match) {
            //     setActiveLink("/AccessTech/AdminOrderpage");
            //   }
            //   return match;
            // }}
          >
            Item Menu Dashboard
          </NavLink>
        </li>
        <li className="sidebarListItem">
          <LocalDiningIcon className="icon"></LocalDiningIcon>
          <NavLink to="/AccessTech/AdminIngredientpage" className="text_sidebar">Inventory Management</NavLink>
        </li>
        <li className="sidebarListItem">
          <PercentIcon className="icon"></PercentIcon>
          <NavLink to="/home" className="text_sidebar" >Discount Management</NavLink>
        </li>
      </ul>
    </div>
    </Paper>
  );
}

export default SideNavBar;



