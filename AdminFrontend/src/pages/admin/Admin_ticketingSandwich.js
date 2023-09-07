
import React, { useState,useEffect } from 'react';
import "./css/admin_login.css";
import SideNavBar from '../../Components/admin/SideNavBar'
import AdminAddMenu from '../../Components/admin/Admin_add_menu'
import AdminUpdateMenu from '../../Components/admin/Admin_update_menu'
import { Tabs, TabList, Tab, TabPanels, TabPanel, Box, IconButton, VStack } from "@chakra-ui/react";
import { AddIcon, EditIcon,CheckIcon,CloseIcon } from '@chakra-ui/icons'; // Equivalent icons in Chakra
import {LinkBox,Card,CardBody,Stack,Divider,CardFooter,ButtonGroup,Button,Heading,Center,LinkOverlay,Text,SimpleGrid,Image} from '@chakra-ui/react'
import { useColorMode } from "@chakra-ui/react";



const TicketingSandwich = () =>{
    const [sandwichList, setSandwichList] = useState([]); // State to store the fetched data

    const { colorMode } = useColorMode();

    const borderColor = colorMode === "dark" ? "red.500" : "pink.200"; // Change color based on color mode
    const buttonTextColor = colorMode === "dark" ? "#FFFFFF" : "#FFFFFF"; // Change color based on color mode
    const textColor = colorMode === "dark" ? "#ECC94B" : "#000000"; // Change color based on color mode
    useEffect(() => {
        // Make a GET request using fetch
        fetch('http://127.0.0.1:5000/admin/fetch_invoice_parameter?invoice_status=pending&dish_type=Sandwich')
            .then(response => response.json())
            .then(data => {
            // Handle the response data and set it in the state
            setSandwichList(data);
            })
            .catch(error => {
            // Handle any errors
            console.error('Error:', error);
            });
        }, [])
    return(      
        <div className="overlay">
            <div className="centerContent">
                <SimpleGrid templateColumns='repeat(auto-fill, minmax(200px, 1fr))'>
                    <Card maxW='sm' borderColor={'borderColor'} border='2px'>
                        <CardBody>
                            <Image
                            src='https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'
                            alt='Green double couch with wooden legs'
                            borderRadius='lg'
                            />
                            <Heading size='md' color={textColor}>To insert ticket number</Heading>
                            <Text color={textColor} fontWeight='bold' fontSize='2xl'>
                                $450
                            </Text>
                        </CardBody>
                            <Center>
                                <Button background='#71149D' href="#test" textColor={buttonTextColor} variant='solid' colorScheme='purple' w='80%' display='block' mb={2}>
                                    <CheckIcon style={{marginRight:'5px'}}/>Serve
                                </Button>                        
                            </Center>
                            <Center>
                                <Button background='#F00' href="#test" textColor={buttonTextColor} variant='solid' colorScheme='red' w='80%' display='block' mb={2}>
                                    <CloseIcon style={{marginRight:'5px'}}/>Cancel
                                </Button>                            
                            </Center>
                    </Card>    
                    <Card maxW='sm' borderColor={borderColor} border='2px'>
                        <CardBody>
                            <Image
                            src='https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'
                            alt='Green double couch with wooden legs'
                            borderRadius='lg'
                            />
                            <Heading size='md'>To insert ticket number</Heading>
                            <Text color='blue.600' fontSize='2xl'>
                                $450
                            </Text>
                        </CardBody>
                            <Center>
                                <Button background='#71149D' href="#test" textColor={buttonTextColor} variant='solid' colorScheme='purple' w='80%' display='block' mb={2}>
                                    <CheckIcon style={{marginRight:'5px'}}/>Serve
                                </Button>                        
                            </Center>
                            <Center>
                                <Button background='#F00' href="#test" textColor={buttonTextColor} variant='solid' colorScheme='red' w='80%' display='block' mb={2}>
                                    <CloseIcon style={{marginRight:'5px'}}/>Cancel
                                </Button>                            
                            </Center>
                    </Card>  
                    <Card maxW='sm' borderColor={borderColor} border='2px'>
                        <CardBody>
                            <Image
                            src='https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'
                            alt='Green double couch with wooden legs'
                            borderRadius='lg'
                            />
                            <Heading size='md'>To insert ticket number</Heading>
                            <Text color='blue.600' fontSize='2xl'>
                                $450
                            </Text>
                        </CardBody>
                            <Center>
                                <Button background='#71149D' href="#test" textColor={buttonTextColor} variant='solid' colorScheme='purple' w='80%' display='block' mb={2}>
                                    <CheckIcon style={{marginRight:'5px'}}/>Serve
                                </Button>                        
                            </Center>
                            <Center>
                                <Button background='#F00' href="#test" textColor={buttonTextColor} variant='solid' colorScheme='red' w='80%' display='block' mb={2}>
                                    <CloseIcon style={{marginRight:'5px'}}/>Cancel
                                </Button>                            
                            </Center>
                    </Card>  
                    <Card maxW='sm' borderColor={borderColor} border='2px'>
                        <CardBody>
                            <Image
                            src='https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'
                            alt='Green double couch with wooden legs'
                            borderRadius='lg'
                            />
                            <Heading size='md'>To insert ticket number</Heading>
                            <Text color='blue.600' fontSize='2xl'>
                                $450
                            </Text>
                        </CardBody>
                            <Center>
                                <Button background='#71149D' href="#test" textColor={buttonTextColor} variant='solid' colorScheme='purple' w='80%' display='block' mb={2}>
                                    <CheckIcon style={{marginRight:'5px'}}/>Serve
                                </Button>                        
                            </Center>
                            <Center>
                                <Button background='#F00' href="#test" textColor={buttonTextColor} variant='solid' colorScheme='red' w='80%' display='block' mb={2}>
                                    <CloseIcon style={{marginRight:'5px'}}/>Cancel
                                </Button>                            
                            </Center>
                    </Card>  
                    <Card maxW='sm' borderColor={borderColor} border='2px'>
                        <CardBody>
                            <Image
                            src='https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'
                            alt='Green double couch with wooden legs'
                            borderRadius='lg'
                            />
                            <Heading size='md'>To insert ticket number</Heading>
                            <Text color='blue.600' fontSize='2xl'>
                                $450
                            </Text>
                        </CardBody>
                            <Center>
                                <Button background='#71149D' href="#test" textColor={buttonTextColor} variant='solid' colorScheme='purple' w='80%' display='block' mb={2}>
                                    <CheckIcon style={{marginRight:'5px'}}/>Serve
                                </Button>                        
                            </Center>
                            <Center>
                                <Button background='#F00' href="#test" textColor={buttonTextColor} variant='solid' colorScheme='red' w='80%' display='block' mb={2}>
                                    <CloseIcon style={{marginRight:'5px'}}/>Cancel
                                </Button>                            
                            </Center>
                    </Card>  
                    <Card maxW='sm' borderColor={borderColor} border='2px'>
                        <CardBody>
                            <Image
                            src='https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'
                            alt='Green double couch with wooden legs'
                            borderRadius='lg'
                            />
                            <Heading size='md'>To insert ticket number</Heading>
                            <Text color='blue.600' fontSize='2xl'>
                                $450
                            </Text>
                        </CardBody>
                            <Center>
                                <Button background='#71149D' href="#test" textColor={buttonTextColor} variant='solid' colorScheme='purple' w='80%' display='block' mb={2}>
                                    <CheckIcon style={{marginRight:'5px'}}/>Serve
                                </Button>                        
                            </Center>
                            <Center>
                                <Button background='#F00' href="#test" textColor={buttonTextColor} variant='solid' colorScheme='red' w='80%' display='block' mb={2}>
                                    <CloseIcon style={{marginRight:'5px'}}/>Cancel
                                </Button>                            
                            </Center>
                    </Card>  
                    <Card maxW='sm' borderColor={borderColor} border='2px'>
                        <CardBody>
                            <Image
                            src='https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'
                            alt='Green double couch with wooden legs'
                            borderRadius='lg'
                            />
                            <Heading size='md'>To insert ticket number</Heading>
                            <Text color='blue.600' fontSize='2xl'>
                                $450
                            </Text>
                        </CardBody>
                            <Center>
                                <Button background='#71149D' href="#test" textColor={buttonTextColor} variant='solid' colorScheme='purple' w='80%' display='block' mb={2}>
                                    <CheckIcon style={{marginRight:'5px'}}/>Serve
                                </Button>                        
                            </Center>
                            <Center>
                                <Button background='#F00' href="#test" textColor={buttonTextColor} variant='solid' colorScheme='red' w='80%' display='block' mb={2}>
                                    <CloseIcon style={{marginRight:'5px'}}/>Cancel
                                </Button>                            
                            </Center>
                    </Card>  
                </SimpleGrid>

                
            </div>
        </div>

        )
}
function Admin_ticketingSandwich() {


    // const [username, setUsername] = useState('');
    // const [password, setPassword] = useState('');
    

        

    
        return (
            <div className='container_order_container'  >
                <SideNavBar children={<TicketingSandwich/>}></SideNavBar>

            </div>
        );
}
export default Admin_ticketingSandwich;;