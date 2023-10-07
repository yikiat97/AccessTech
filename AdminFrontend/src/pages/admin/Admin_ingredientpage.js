import React from 'react';
import "./css/admin_login.css";
import SideNavBar from '../../Components/admin/SideNavBar';
import AdminAddIngredients from '../../Components/admin/Admin_add_ingredients';
import AdminUpdateIngredients from '../../Components/admin/Admin_update_ingredient';

import { Box, Tabs, TabList, Tab, TabPanels, TabPanel, Icon, VStack, Divider } from '@chakra-ui/react';
import { AddIcon, EditIcon } from '@chakra-ui/icons';


const ItemIngredientsForm = () =>{
    const [value, setValue] = React.useState(0);

    const handleChange = (index) => {
      setValue(index);
    }; 


    return (

      <div className="overlay">
        <div className="centerContent">           
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
                <AdminUpdateIngredients />
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
    const response = await fetch(process.env.REACT_APP_API_URL+'userAuth', {
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
      <SideNavBar children={<ItemIngredientsForm/>}/>
    </div>
  );
}

export default Admin_orderpage;
