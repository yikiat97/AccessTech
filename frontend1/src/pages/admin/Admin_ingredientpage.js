import React, { useState } from 'react';
import "./css/admin_login.css";
import SideNavBar from '../../Components/admin/SideNavBar'
import AdminAddIngredients from '../../Components/admin/Admin_add_ingredients'
import AdminUpdateMenu from '../../Components/admin/Admin_update_menu'

import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import AddBoxIcon from '@mui/icons-material/AddBox';
import EditNoteIcon from '@mui/icons-material/EditNote';



function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


function Admin_orderpage() {

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // const [username, setUsername] = useState('');
  // const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://127.0.0.1:5000/userAuth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "username": "admin1",
        "password": "password"
    }),
    });
    
    const data = await response.json();
    console.log(data); // it will log the response to console
  };

  return (
    <div className='container_order_container '>
     <div><SideNavBar></SideNavBar></div>

     <div style={{marginLeft:"350px",marginTop:"65px"}}>
      <Box sx={{ width: '100%' }}>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab icon={<AddBoxIcon />} label="Add new ingredients" {...a11yProps(0)} />
          <Tab icon={<EditNoteIcon />} label="Update ingredients" {...a11yProps(1)} />
          {/* <Tab label="Item Three" {...a11yProps(2)} /> */}
        </Tabs>
      </Box>

      <CustomTabPanel value={value} index={0}>
        <AdminAddIngredients/>
      </CustomTabPanel>
      
      <CustomTabPanel value={value} index={1}>
        <AdminUpdateMenu/>
      </CustomTabPanel>
      {/* <CustomTabPanel value={value} index={2}>
        Item Three
      </CustomTabPanel> */}

    </Box>
    </div>
     
    </div>
  );
}

export default Admin_orderpage;










