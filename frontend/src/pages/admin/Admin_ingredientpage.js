import React from 'react';
import "./css/admin_login.css";
import SideNavBar from '../../Components/admin/SideNavBar';
import AdminAddIngredients from '../../Components/admin/Admin_add_ingredients';
import AdminUpdateMenu from '../../Components/admin/Admin_update_menu';

import { Box, Tabs, TabList, Tab, TabPanels, TabPanel, Icon, VStack, Divider } from '@chakra-ui/react';
import { AddIcon, EditIcon } from '@chakra-ui/icons';

function Admin_orderpage() {
  const [value, setValue] = React.useState(0);

  const handleChange = (index) => {
    setValue(index);
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
      <div><SideNavBar /></div>
      <div style={{ marginLeft: "150px", marginTop: "65px" , top:0, position:"fixed"}}>
      <VStack spacing={4} ml="350px" mt="65px" w="100%">
        <Tabs index={value} onChange={handleChange}>
          <TabList borderBottom="1px" borderColor="gray.300">
            <Tab><Icon as={AddIcon} /> Add new ingredients</Tab>
            <Tab><Icon as={EditIcon} /> Update ingredients</Tab>
          </TabList>
          <Divider />
          <TabPanels>
            <TabPanel p={3}>
              <AdminAddIngredients />
            </TabPanel>
            <TabPanel p={3}>
              <AdminUpdateMenu />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
      </div>
    </div>
  );
}

export default Admin_orderpage;
