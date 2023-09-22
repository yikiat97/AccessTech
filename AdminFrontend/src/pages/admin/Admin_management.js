import React, { useState,useEffect } from 'react';
import "./css/admin_login.css";
import logo from '../../assets/logo/logo.png'; // adjust the path as needed
import SideNavBar from '../../Components/admin/SideNavBar'
import AdminCRUDuser from '../../Components/admin/Admin_CRUD_user'
import {Select,FormControl,FormLabel,Input,useDisclosure,Modal,ModalOverlay,ModalContent,ModalHeader,ModalCloseButton,ModalBody,ModalFooter,Button } from '@chakra-ui/react'
import backgroundImage from '../../assets/adminBackground/adminWallpaper.jpg'
import {SimpleGrid} from '@chakra-ui/react'
import { Link } from 'react-router-dom';
import { Table,Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import '../../css/adminHomePage.css';
import {EditIcon,DeleteIcon} from '@chakra-ui/icons'
import DataTable from '../../Components/admin/Admin_CRUD_user';


const hardcodedData = [
  { name: 'John Doe', age: 25, location: 'New York' },
  { name: 'Jane Smith', age: 32, location: 'Los Angeles' },
  { name: 'Alex Johnson', age: 28, location: 'Chicago' },
  { name: 'Emily Brown', age: 22, location: 'Houston' },
  { name: 'Michael Lee', age: 35, location: 'San Francisco' },
];

const AdminManagementTable = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalAction, setModalAction] = useState(""); // Use this to track whether it's an "Edit" or "Delete" action
  const [selectedItem, setSelectedItem] = useState(null);
  const [adminDetails, setAdminDetails] = useState([]); // State to store the fetched data
  const handleEditClick = (item) => {
    setModalAction("Edit");
    console.log(item)
    setSelectedItem(item); // Store the selected item in state
    onOpen();
  };
  
  const handleDeleteClick = (item) => {
    setModalAction("Delete");
    setSelectedItem(item); // Store the selected item in state
    onOpen();
  };
  
  useEffect(() => {
    // Make a GET request using fetch
    fetch(process.env.REACT_APP_API_URL+'/getAllAdminDetails')
      .then(response => response.json())
      .then(data => {
        // Handle the response data and set it in the state
        setAdminDetails(data);
      })
      .catch(error => {
        // Handle any errors
        console.error('Error:', error);
      });
  }, []); // Empty dependency array means this effect runs once when the component mounts
  return(
    <Table variant="striped" size="md" >
    <Thead>
      <Tr>
        <Th>Admin ID</Th>
        <Th>Name</Th>
        <Th>Password</Th>
        <Th>Role</Th>
        <Th></Th>
      </Tr>
    </Thead>
    <Tbody>
      {adminDetails.user_details && adminDetails.user_details.length > 0 ? (
        (() => {
          const rows = [];
          for (let index = 0; index < adminDetails.user_details.length; index++) {
            const item = adminDetails.user_details[index];
            rows.push(
              <Tr key={item.admin_id}>
                <Td>{item.admin_id}</Td>
                <Td>{item.name}</Td>
                <Td>{item.password}</Td>
                <Td>{item.role}</Td>
                <Td>
                <Button colorScheme="blue" m={2} onClick={() => handleEditClick(item)}>
                  <EditIcon />
                  Edit
                </Button>
                <Button colorScheme="red" m={2} onClick={() => handleDeleteClick(item)}>
                  <DeleteIcon />
                  Delete
                </Button>
                  <Modal isOpen={isOpen} onClose={onClose}>
                      <ModalOverlay />
                      <ModalContent>
                        <ModalHeader>{modalAction === "Edit" ? "Edit Item" : "Delete Item"}</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                          {/* Your modal content goes here */}
                          {selectedItem && (
                            <div>
                              {modalAction === "Edit" ? 
                              <FormControl>
                                <FormLabel>Admin ID</FormLabel>
                                <Input placeholder={selectedItem.admin_id} disabled />
                                <FormLabel>Name</FormLabel>
                                <Input placeholder={selectedItem.name}/>
                                <FormLabel>Password</FormLabel>
                                <Input placeholder={selectedItem.password}/>
                                <FormLabel>Role</FormLabel>
                                <Select placeholder="Select Role" value={selectedItem.role}>
                                  <option value="master_admin">Master Admin</option>
                                  <option value="general_admin">General Admin</option>
                                </Select>

                              </FormControl>: 
                              <FormControl>
                                
                                <FormLabel>Admin ID</FormLabel>
                                <Input placeholder={selectedItem.admin_id} disabled />
                                <FormLabel>Name</FormLabel>
                                <Input placeholder={selectedItem.name} disabled/>
                                <FormLabel>Password</FormLabel>
                                <Input placeholder={selectedItem.password} disabled/>
                                <FormLabel>Role</FormLabel>
                                <Select placeholder="Select Role" value={selectedItem.role} disabled>
                                  <option value="master_admin">Master Admin</option>
                                  <option value="general_admin">General Admin</option>
                                </Select>

                              </FormControl>}
                            </div>
                          )}
                        </ModalBody>
                        <ModalFooter>
                          <Button colorScheme="blue" mr={3} onClick={onClose}>
                            Close
                          </Button>
                          {modalAction === "Edit" ? (
                            <Button colorScheme="green">
                              Save Changes
                            </Button>
                          ) : (
                            <Button colorScheme="red">
                              Delete
                            </Button>
                          )}
                        </ModalFooter>
                      </ModalContent>
                    </Modal>
                </Td>
              </Tr>
            );
          }
          return rows;
        })()
      ) : (
        <Tr>
          <Td colSpan="5">No data available</Td>
        </Tr>
      )}
    </Tbody>
  </Table>
  )

};

function AdminManagementPage() {
  return (
    <div className="container" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <SideNavBar children={<AdminManagementTable />} />
    </div>
  );
}

export default AdminManagementPage;