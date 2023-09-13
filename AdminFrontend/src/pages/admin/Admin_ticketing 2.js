
import React, { useState } from 'react';
import "./css/admin_login.css";
import SideNavBar from '../../Components/admin/SideNavBar'
import AdminAddMenu from '../../Components/admin/Admin_add_menu'
import AdminUpdateMenu from '../../Components/admin/Admin_update_menu'
import { Tabs, TabList, Tab, TabPanels, TabPanel, Box, IconButton, VStack } from "@chakra-ui/react";
import { AddIcon, EditIcon } from '@chakra-ui/icons'; // Equivalent icons in Chakra


function Admin_ticketingpage() {


    // const [username, setUsername] = useState('');
    // const [password, setPassword] = useState('');
    

        

    
        return (
            <div className='container_order_container'  >
                <SideNavBar></SideNavBar>
            </div>
        );
}

export default Admin_ticketingpage;