
import React, { useState } from 'react';
import "../css/admin_login.css";
import SideNavBar from '../../../Components/admin/SideNavBar'
import AdminAddMenu from '../../../Components/admin/Admin_add_menu'
import AdminUpdateMenu from '../../../Components/admin/Admin_update_menu'
import { Tabs, TabList, Tab, TabPanels, TabPanel, Box, IconButton, VStack } from "@chakra-ui/react";
import { AddIcon, EditIcon } from '@chakra-ui/icons'; // Equivalent icons in Chakra
import {LinkBox,Heading,Center,LinkOverlay,Text,SimpleGrid,Image} from '@chakra-ui/react'
import SandwichIcon from '../../../assets/ticketingIcons/Sandwich Icon.png'
import RiceIcon from '../../../assets/ticketingIcons/Rice Icon.png'
import NoodlesIcon from '../../../assets/ticketingIcons/Noodles Icon.png'
import DrinksIcon from '../../../assets/ticketingIcons/Drinks Icon.png'


const TicketingCategories = () =>{

    return(      
        <div className="overlay">
            <div className="centerContent">
                <Heading>Which station would you like to access?</Heading>
                <SimpleGrid columns={2}>
                    <LinkBox as='article' maxW='sm' p='5' m='5' borderWidth='1px' rounded='md'>
                        <Center id='test'>
                            <Image boxSize='200px' src={SandwichIcon}></Image>                              
                        </Center>
                        <Heading size='md' my='2'>
                            <LinkOverlay href='/AccessTech/GeneralTicketingPage'>
                                General Station
                            </LinkOverlay>
                        </Heading>
                    </LinkBox>
                    <LinkBox as='article' maxW='sm' p='5' m='5' borderWidth='1px' rounded='md'>
                        <Center id='test'>
                            <Image boxSize='200px' src={RiceIcon}></Image>                              
                        </Center>
                        <Heading size='md' my='2'>
                            <LinkOverlay href='/AccessTech/GeneralTicketingPage'>
                                Rice Station
                            </LinkOverlay>
                        </Heading>
                    </LinkBox>
                    <LinkBox as='article' maxW='sm' p='5' m='5' borderWidth='1px' rounded='md'>
                        <Center id='test'>
                            <Image boxSize='200px' src={NoodlesIcon}></Image>                              
                        </Center>
                        <Heading size='md' my='2'>
                            <LinkOverlay href='/AccessTech/FryingTicketingPage'>
                                Frying Station
                            </LinkOverlay>
                        </Heading>
                    </LinkBox>
                    <LinkBox as='article' maxW='sm' p='5' m='5' borderWidth='1px' rounded='md'>
                        <Center id='test'>
                            <Image boxSize='200px' src={DrinksIcon}></Image>                              
                        </Center>
                        <Heading size='md' my='2'>
                            <LinkOverlay href='/AccessTech/DrinksTicketingPage'>
                                Drinks Station
                            </LinkOverlay>
                        </Heading>
                    </LinkBox>                       
                </SimpleGrid>        

                
            </div>
        </div>

        )
}
function Admin_ticketingpage() {


    // const [username, setUsername] = useState('');
    // const [password, setPassword] = useState('');
    

        

    
        return (
            <div className='container_order_container'  >
                <SideNavBar children={<TicketingCategories/>}></SideNavBar>
            </div>
        );
}

export default Admin_ticketingpage;