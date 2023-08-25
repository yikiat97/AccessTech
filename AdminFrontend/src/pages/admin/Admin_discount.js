
import React, { useState } from 'react';
import "./css/admin_login.css";
import SideNavBar from '../../Components/admin/SideNavBar'
import AdminAddMenu from '../../Components/admin/Admin_add_menu'
import AdminUpdateMenu from '../../Components/admin/Admin_update_menu'
import { Tabs, TabList, Tab, Icon,Divider,TabPanels, TabPanel, Box, IconButton, VStack } from "@chakra-ui/react";
import { AddIcon, EditIcon } from '@chakra-ui/icons'; // Equivalent icons in Chakra
import AdminAddDiscount from '../../Components/admin/Admin_add_discount';
import DiscountTable from '../../Components/admin/Admin_discount_table';
const DiscountForm = () =>{
    const [value, setValue] = React.useState(0);

    const handleChange = (index) => {
      setValue(index);
    }; 


    return (

      <div className="overlay">
        <div className="centerContent">           
          <Tabs index={value} onChange={handleChange}>
            <TabList borderBottom="1px" borderColor="gray.300">
              <Tab><Icon as={AddIcon} /> Add new discount code</Tab>
              <Tab><Icon as={EditIcon} /> View discounts</Tab>
            </TabList>
            <Divider />
            <TabPanels>
              <TabPanel p={3}>
                <AdminAddDiscount />
              </TabPanel>
              <TabPanel p={3}>
                <DiscountTable />
              </TabPanel>
            </TabPanels>
          </Tabs>
          </div>
      </div>

    )
}
function Admin_discountpage() {


    // const [username, setUsername] = useState('');
    // const [password, setPassword] = useState('');
    

        

    
        return (
            <div className='container_order_container'  >
                <SideNavBar children={<DiscountForm/>}></SideNavBar>
            </div>
        );
}

export default Admin_discountpage;