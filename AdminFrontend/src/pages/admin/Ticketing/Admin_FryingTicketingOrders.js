
import React, { useState,useEffect } from 'react';
import "../css/admin_login.css";
import SideNavBar from '../../../Components/admin/SideNavBar'
import AdminAddMenu from '../../../Components/admin/Admin_add_menu'
import AdminUpdateMenu from '../../../Components/admin/Admin_update_menu'
import { Tabs, TabList, Tab, TabPanels, TabPanel, Box, IconButton, VStack, Grid } from "@chakra-ui/react";
import { AddIcon, EditIcon,CheckIcon,CloseIcon } from '@chakra-ui/icons'; // Equivalent icons in Chakra
import {LinkBox,Card,CardBody,Stack,Divider,CardFooter,ButtonGroup,Button,Heading,Center,LinkOverlay,Text,SimpleGrid,Image} from '@chakra-ui/react'
import { useColorMode } from "@chakra-ui/react";
import Admin_order_ticket from '../../../Components/admin/Admin_order_ticket';
import OrderTicket from '../../../Components/admin/Admin_order_ticket';
import {io} from 'socket.io-client';
import { CustomCancelButton } from '../../../Components/CustomTags';
import { CustomServeButton } from '../../../Components/CustomTags';
import { CustomText } from '../../../Components/CustomTags';

const colors = ['#FFC107', '#F44336', '#4CAF50', '#2196F3'];

const fetchAndUpdateOrders = async (setOrderList) => {
    console.log('fetching orders')
    // Make a GET request using fetch
    fetch(process.env.REACT_APP_API_URL + '/admin/fetch_fried_transactions?invoice_status=pending')
        .then(response => response.json())
        .then(data => {
            // Handle the response data and set it in the state
            console.log('fetching new transaction')
            console.log(data);

            setOrderList(data);


        })
        .catch((error) => {
            // Handle any errors
            console.error('Error:', error);
        });
};
const FryingTicketingOrders = () =>{
    const [orderList, setOrderList] = useState([]); // State to store the fetched data
    const { colorMode } = useColorMode();

    const [orderColors, setOrderColors] = useState({}); // Track colors by invoice_id
    const borderColor = colorMode === "dark" ? "1px solid white" : "1px solid black";

    const buttonTextColor = colorMode === "dark" ? "#FFFFFF" : "#FFFFFF"; // Change color based on color mode
    const textColor = colorMode === "dark" ? "#FFFFFF" : "#000000"; // Change color based on color mode
    const socket = io.connect(process.env.REACT_APP_SOCKET_URL);
    console.log(process.env.REACT_APP_SOCKET_URL)






    // }, []);
    useEffect(() => {
        // Set up the WebSocket event listeners
        fetchAndUpdateOrders(setOrderList);

        socket.on('connect', () => {
            console.log('Connected to server');
            // You can send messages to the server if needed
            // socket.emit('message', { data: 'Hello Server' });
        });
        
        socket.on('update', () => {
            // You should call fetchAndUpdateOrders inside this callback
            console.log('Received new order');

            fetchAndUpdateOrders(setOrderList);
            fetchAndUpdateOrders(setOrderList);
            
        });
        socket.on('completeOrder', () => {
            // You should call fetchAndUpdateOrders inside this callback
            console.log('Completed order');

            fetchAndUpdateOrders(setOrderList);
            fetchAndUpdateOrders(setOrderList);
        });
        socket.on('cancelOrder', () => {
            // You should call fetchAndUpdateOrders inside this callback
            console.log('Cancel order');

            fetchAndUpdateOrders(setOrderList);
            fetchAndUpdateOrders(setOrderList);
        });
        socket.on('updateColor', () => {
            // You should call fetchAndUpdateOrders inside this callback
            console.log('Update Color');

            fetchAndUpdateOrders(setOrderList);
            fetchAndUpdateOrders(setOrderList);
        });                      
        // Clean up the event listener when the component unmounts
        return () => {
            socket.off('update');
        };
    }, []);
    




    
    return (
        <div>
            <Heading>Frying Queue</Heading>

            {/* Conditional rendering based on orderDetails */}
            {orderList ? (
                <SimpleGrid columns={[1, null, 2, 4]} spacing={4}>
                {orderList.map((order, index) => (
                    <div key={order.invoice_id}>
                        <Heading
                            size='md'
                            color={order.color} 
                            id={'my-heading-' + order.invoice_id} 
                        >
                            Order Number {order.order_number}
                        </Heading>                            
                        <Card maxW='sm' id={'my-card-' + order.invoice_id} style={{ borderColor: order.color }} border='2px' m={3} data-invoice-id={order.invoice_id}>
                            {order.transactions.map((transaction, index) => (
                                <div key={index} style={{ backgroundColor: index % 2 === 0 ? '#434654' : '#343541' }}>
                                <Box mb={10}>
                                    <CustomText>{transaction.quantity}X</CustomText>
                                    <CustomText as="b" >{transaction.dish_name}</CustomText>
                                    {transaction.special_comments.length > 0 && (
                                    <Grid borderTop={borderColor} borderBottom={borderColor}>
                                        <Box >
                                        <CustomText  mb={2}>Special Comments:  </CustomText> 
                                            
                                        </Box>
                                        <Box>
                                        {transaction.special_comments.map((comment) => (
                                            <CustomText key={comment.comment_id}  color={textColor}>
                                            - {comment.text}
                                            </CustomText>
                                        ))}
                                        </Box>
                                    </Grid>
                                    )}
                                </Box>
                                </div>
                            ))}
                        </Card>

                    </div>
                ))}
            </SimpleGrid>
            ) : (
                // Render a loading message or spinner while data is being fetched
                <p>Loading...</p>
            )}

        </div>
    );
    
};







function Admin_FryingTicketingOrders() {

    return (
        <div className='container_order_container'  >
            <SideNavBar children={<FryingTicketingOrders/>}></SideNavBar>
        </div>
    );
}

export { fetchAndUpdateOrders };
export default Admin_FryingTicketingOrders;