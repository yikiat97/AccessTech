

import React, { useState } from 'react';
import "./css/admin_login.css";
import SideNavBar from '../../Components/admin/SideNavBar'
import AdminAddMenu from '../../Components/admin/Admin_add_menu'
import AdminUpdateMenu from '../../Components/admin/Admin_update_menu'
import { Tabs, TabList, Tab, TabPanels, TabPanel, Box, IconButton, VStack } from "@chakra-ui/react";
import { AddIcon, EditIcon } from '@chakra-ui/icons'; // Equivalent icons in Chakra

const ItemMenuForm = () =>{
  const [value, setValue] = useState(0);

  const handleChange = (index) => {
    setValue(index);
  };


  
  return(      
    <div className="overlay">
      <div className="centerContent">        
        <Tabs index={value} onChange={handleChange}>
            <TabList borderBottom="1px" borderColor="gray.200">
              <Tab>
                <IconButton aria-label="Add" icon={<AddIcon />} />
                Add new menu
              </Tab>
              <Tab>
                <IconButton aria-label="Edit" icon={<EditIcon />} />
                Update menu
              </Tab>
            </TabList>

            <TabPanels>
              <TabPanel p={3}>
                <AdminAddMenu />
              </TabPanel>
              <TabPanel p={3}>
                <AdminUpdateMenu />
              </TabPanel>
            </TabPanels>
          </Tabs>
      </div>
    </div>

  )
}


function Admin_orderpage() {


  // const [username, setUsername] = useState('');
  // const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(process.env.REACT_APP_API_URL+'/userAuth', {
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
    <div className='container_order_container'  >
      <SideNavBar children={<ItemMenuForm />}/>
    </div>
  );
}

export default Admin_orderpage;











