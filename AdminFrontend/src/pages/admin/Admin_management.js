import React, { useState } from 'react';
import "./css/admin_login.css";
import logo from '../../assets/logo/logo.png'; // adjust the path as needed
import SideNavBar from '../../Components/admin/SideNavBar'
import AdminCRUDuser from '../../Components/admin/Admin_CRUD_user'
import { LinkBox, LinkOverlay,Box,Heading,Text,Card,CardHeader,Flex,Avatar,Button,Image,CardBody,CardFooter,ButtonGroup } from '@chakra-ui/react'
import backgroundImage from '../../assets/adminBackground/adminWallpaper.jpg'
import {SimpleGrid} from '@chakra-ui/react'
import { Link } from 'react-router-dom';
import { Table,Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import '../../css/adminHomePage.css';
import {EditIcon,DeleteIcon} from '@chakra-ui/icons'
const hardcodedData = [
  { name: 'John Doe', age: 25, location: 'New York' },
  { name: 'Jane Smith', age: 32, location: 'Los Angeles' },
  { name: 'Alex Johnson', age: 28, location: 'Chicago' },
  { name: 'Emily Brown', age: 22, location: 'Houston' },
  { name: 'Michael Lee', age: 35, location: 'San Francisco' },
];

function AdminManagementPage() {


  return (
    <div className="container" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="overlay">
        <div className="centerContent">
          <Table variant="striped" size='md' border='1px' borderColor='gray.200'>
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Username</Th>
                <Th>Password</Th>
                <Th>Role</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {hardcodedData.map((item, index) => (
                <Tr key={index}>
                  <Td>{item.name}</Td>
                  <Td>{item.age}</Td>
                  <Td>{item.location}</Td>
                  <Td></Td>
                  <Td>
                    <Button colorScheme='blue' m={2}><EditIcon href="test"></EditIcon>Update</Button>      
                    <Button colorScheme='red' m={2}><DeleteIcon></DeleteIcon>Delete</Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default AdminManagementPage;