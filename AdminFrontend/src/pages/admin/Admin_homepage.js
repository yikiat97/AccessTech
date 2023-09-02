import React, { useState } from 'react';
import "./css/admin_login.css";
import logo from '../../assets/logo/logo.png'; // adjust the path as needed
import SideNavBar from '../../Components/admin/SideNavBar'
import AdminCRUDuser from '../../Components/admin/Admin_CRUD_user'
import { LinkBox, LinkOverlay,Box,Heading,Text,Card,CardHeader,Flex,Avatar,Button,Image,CardBody,CardFooter } from '@chakra-ui/react'
import backgroundImage from '../../assets/adminBackground/adminWallpaper.jpg'
import {SimpleGrid} from '@chakra-ui/react'
import { Link } from 'react-router-dom';
import '../../css/adminHomePage.css'

function AdminHomePage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    
  };

  return (
    <div className="container" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="overlay">
        <div className="centerContent">
          <SimpleGrid columns={2} spacing={10}>
            <Box>
              <Link to="/AccessTech/AdminManagement">
                <Card maxW='md' bg="#E0DCDC">
                  <CardHeader>
                    <Avatar src='https://bit.ly/broken-link' />
                  </CardHeader>
                  <CardBody>
                    <Text>
                      Admin Management
                    </Text>
                  </CardBody>
                </Card>          
              </Link>
            </Box>
            <Box>
              <Link to="/your-route">
                <Card maxW='md' bg="#E0DCDC">
                  <CardHeader>
                    <Avatar src='https://bit.ly/broken-link' />
                  </CardHeader>
                  <CardBody>
                    <Text>
                      Ingredients/Menu Management
                    </Text>
                  </CardBody>
                </Card>          
              </Link>
            </Box>
            <Box>
              <Link to="/your-route">
                <Card maxW='md' bg="#E0DCDC">
                  <CardHeader>
                    <Avatar src='https://bit.ly/broken-link' />
                  </CardHeader>
                  <CardBody>
                    <Text>
                      Dashboard Page
                    </Text>
                  </CardBody>
                </Card>          
              </Link>
            </Box>
            <Box>
              <Link to="/your-route">
                <Card maxW='md' bg="#E0DCDC">
                  <CardHeader>
                    <Avatar src='https://bit.ly/broken-link' />
                  </CardHeader>
                  <CardBody>
                    <Text>
                      Transaction Overview
                    </Text>
                  </CardBody>
                </Card>          
              </Link>
            </Box>
            <Box>
              <Link to="/your-route">
                <Card maxW='md' bg="#E0DCDC">
                  <CardHeader>
                    <Avatar src='https://bit.ly/broken-link' />
                  </CardHeader>
                  <CardBody>
                    <Text>
                      Discount Management 
                    </Text>
                  </CardBody>
                </Card>          
              </Link>
            </Box>
          </SimpleGrid>
        </div>
      </div>
    </div>
  );
}

export default AdminHomePage;