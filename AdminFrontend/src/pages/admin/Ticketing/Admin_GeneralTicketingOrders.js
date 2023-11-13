
import React, { useState,useEffect } from 'react';
import "../css/admin_login.css";
import SideNavBar from '../../../Components/admin/SideNavBar'
import AdminAddMenu from '../../../Components/admin/Admin_add_menu'
import AdminUpdateMenu from '../../../Components/admin/Admin_update_menu'
import { Tabs, TabList, Tab, TabPanels, TabPanel, Box, IconButton, VStack, Grid, border } from "@chakra-ui/react";
import { AddIcon, EditIcon,CheckIcon,CloseIcon } from '@chakra-ui/icons'; // Equivalent icons in Chakra
import {LinkBox,Card,CardBody,Stack,Divider,CardFooter,ButtonGroup,Button,Heading,Center,LinkOverlay,Text,useToast,SimpleGrid,Image} from '@chakra-ui/react'
import { useColorMode } from "@chakra-ui/react";
import Admin_order_ticket from '../../../Components/admin/Admin_order_ticket';
import OrderTicket from '../../../Components/admin/Admin_order_ticket';
import {io} from 'socket.io-client';
import { CustomCancelButton } from '../../../Components/CustomTags';
import { CustomServeButton } from '../../../Components/CustomTags';
import { CustomText } from '../../../Components/CustomTags';
import '../css/toast.css'

import { fetchAndUpdateOrders } from './Admin_FryingTicketingOrders'; 

const colors = ['#FFC107', '#F44336', '#4CAF50', '#2196F3'];

let availableColors = new Set(colors);
let unavailableColors = new Set();

const TicketingOrders = () =>{
    const [orderList, setOrderList] = useState([]); // State to store the fetched data
    const [sortedFoodOrders, setSortedFoodOrders] = useState(null)
    const { colorMode } = useColorMode();
    const [orderDetails, setOrderDetails] = useState(null); // Initialize orderDetails as null
    const [initialFetchComplete, setInitialFetchComplete] = useState(false); // State to track the initial fetch

    const [orderColors, setOrderColors] = useState({}); // Track colors by invoice_id
    const [nextColorIndex, setNextColorIndex] = useState(0); // Track the index of the next color to use

    const buttonTextColor = colorMode === "dark" ? "#FFFFFF" : "#FFFFFF"; // Change color based on color mode
    const textColor = colorMode === "dark" ? "#FFFFFF" : "#000000"; // Change color based on color mode
    const borderColor = colorMode === "dark" ? "1px solid white" : "1px solid black";
    const socket = io.connect(process.env.REACT_APP_SOCKET_URL);
    const toast = useToast()


    const fetchOrders =() =>{
        fetch(process.env.REACT_APP_API_URL+'/admin/fetch_invoice_parameter?invoice_status=pending')
            .then(response => response.json())
            .then(data => {
            // Handle the response data and set it in the state
                console.log(data)
                setOrderList(data)
                console.log(data);
                // Handle the response data and set it in the state
                console.log('fetching data');
        
                // const updatedColors = {};
                // for (let i = 0; i < Math.min(data.length, 4); i++) {
                //     updatedColors[data[i].invoice_id] = colors[i];
            
                //     // Check if the 'color' property exists in data and add it to unavailableColors if it does
                //     if (data[i].color) {
                //         unavailableColors.add(data[i].color);
                //         availableColors.delete(data[i].color)
                //     }
                // }
            
                // // Determine available colors by filtering the colors array
                // // Filter the colors array and add the filtered colors to availableColors Set
                // colors.forEach(color => {
                //     if (!unavailableColors.has(color)) {
                //         availableColors.add(color);
                //     }
                // });
                
                // setOrderColors(updatedColors);
                // for (const invoiceId in updatedColors) {
                //     if (updatedColors.hasOwnProperty(invoiceId)) {
                //         const color = updatedColors[invoiceId];
            
                //         const url = process.env.REACT_APP_API_URL+`/ticketing/update_invoice_colors/${invoiceId}`;
                //         console.log(url)
                //         const headers = {
                //         'Content-Type': 'application/json',
                //         };
            
                //         const requestBody = {
                //         color: color, 
                //         };
            
                //         const options = {
                //         method: 'POST',
                //         headers,
                //         body: JSON.stringify(requestBody),
                //         };
            
                //         fetch(url, options)
                //         .then((response) => {
                //             if (!response.ok) {
                //             throw new Error('Network response was not ok');
                //             }
                //             return response.json();
                //         })
                //         .then((data) => {
                //             console.log(`Color updated for invoice_id ${invoiceId}`);

                //         })
                //         .catch((error) => {
                //             console.error(`Error updating color for invoice_id ${invoiceId}:`, error);
                //         });
                //     }
                // }

            })
            .catch((error) => {
                console.error('Error:', error);
            });        
    }

        

    useEffect(() => {
        fetchOrders();

    }, []);
    useEffect(() => {
            const handleUpdate = async (data) => {
            console.log('New Incoming Order');
            console.log(data)
        
            // if (availableColors.size > 0) {
            // const colorToUse = availableColors.values().next().value;
            // availableColors.delete(colorToUse);
            // unavailableColors.add(colorToUse);
        
            // const dataWithColor = { ...data.data, color: colorToUse };
            // setOrderList((prevOrderList) => [...prevOrderList, dataWithColor]);

            // updateColorInDatabase(data.data.invoice_id, colorToUse);
        
            // const headingElement = document.getElementById('my-heading-' + data.invoice_id);
            // const cardElement = document.getElementById('my-card-' + data.invoice_id);
        
            // if (headingElement && cardElement) {
            //     headingElement.style.color = colorToUse;
            //     cardElement.style.borderColor = colorToUse;
            // }
            // } else {
            const dataWithColor = { ...data.data, color: data.data.color };

            setOrderList((prevOrderList) => [...prevOrderList, dataWithColor]);
        

            const headingElement = document.getElementById('my-heading-' + data.order_number);
            const cardElement = document.getElementById('my-card-' + data.order_number);
        
            if (headingElement && cardElement) {
                headingElement.style.color = data.data.color;
                cardElement.style.borderColor = data.data.color;
            }
            // }

        };
    
    // Set up the WebSocket event listeners
    socket.on('connect', () => {
        console.log('Connected to server');
        // You can send messages to the server if needed
        // socket.emit('message', { data: 'Hello Server' });
    });
    
    socket.on('update', handleUpdate);
    
    // Clean up the event listener when the component unmounts
    return () => {
        socket.off('update', handleUpdate);
    };
    }, []);
    const toggleButtonState = (invoiceId) => {
        // Find the specific buttons by their IDs
        const serveButton = document.getElementById(`serve-button-${invoiceId}`);
        const cancelButton = document.getElementById(`cancel-button-${invoiceId}`);
        console.log(serveButton)
        if (serveButton && cancelButton) {
            serveButton.addEventListener('click', () => {
                // Call the serveOrder function with the invoiceId
                serveOrder(invoiceId);
            });
            cancelButton.addEventListener('click', () => {
                // Call the serveOrder function with the invoiceId
                cancelOrder(invoiceId);
            });            
            serveButton.disabled = false;
            cancelButton.disabled = false;
        }
    }
    // Function to cancel an order
    async function cancelOrder(invoice_id) {
        console.log('Serve Order')
        // Define the URL with the invoice_id in the route
        const url = process.env.REACT_APP_API_URL+`/ticketing/update_invoice_status_cancel/${invoice_id}`;
    
        // Define the request headers
        const headers = {
            'Content-Type': 'application/json',
        };
    
        // Define the request body if needed
        const requestBody = {
            // Include any data you want to send in the request body
        };
    
        // Define the fetch options
        const options = {
            method: 'PUT',
            headers,
            body: JSON.stringify(requestBody),
        };
    
        try {
            // Make the fetch request
            const response = await fetch(url, options);
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            // Filter out the completed order from the orderList
            const updatedOrderList = orderList.filter((order) => order.invoice_id !== invoice_id);
            // Find the first unserved order
            const targetOrder = orderList.find((order) => order.invoice_id === invoice_id);

            let unservedOrder = orderList.find((order) => {
                // Replace 'gray.500' with the default color you use for unserved orders
                return order.color === 'gray.500';
            });            
            console.log(unservedOrder)
            if (unservedOrder) {
            // Assign color to the unserved order
                assignColorToUnservedOrder(unservedOrder, targetOrder);
            }else{
                // var orderColorToRemove = targetOrder.color;
                // console.log('availableColors');
                // console.log(availableColors);
                // console.log('unavailableColors');
                // console.log(unavailableColors);                
                // unavailableColors.delete(orderColorToRemove)
                // availableColors.add(orderColorToRemove)
                // const updatedOrderColors = { ...orderColors };
                // delete updatedOrderColors[invoice_id];
        
                // // Update the orderColors state with the updated object
                // setOrderColors(updatedOrderColors);
            }
    
            setOrderList(updatedOrderList);
            console.log(updatedOrderList);
            const cardElement = document.querySelector(`[data-invoice-id="${invoice_id}"]`);

            if (cardElement) {
              // Hide or remove the card element from the DOM
              cardElement.style.display = 'none'; // or cardElement.remove();
            }
            socket.emit('update', { invoice_id, status: 'served' });

        } catch (error) {
            // Handle any errors here
            console.log(error)
            alert('Error:', error);
        }
    }

    

    async function serveOrder(invoice_id) {
        console.log('Serve Order')
        // Define the URL with the invoice_id in the route
        const url = process.env.REACT_APP_API_URL+`/ticketing/update_invoice_status_completed/${invoice_id}`;
    
        // Define the request headers
        const headers = {
            'Content-Type': 'application/json',
        };
    
        // Define the request body if needed
        const requestBody = {
            // Include any data you want to send in the request body
        };
    
        // Define the fetch options
        const options = {
            method: 'PUT',
            headers,
            body: JSON.stringify(requestBody),
        };
    
        try {
            // Make the fetch request
            const response = await fetch(url, options);
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            // Filter out the completed order from the orderList
            const updatedOrderList = orderList.filter((order) => order.invoice_id !== invoice_id);
            // Find the first unserved order
            const targetOrder = orderList.find((order) => order.invoice_id === invoice_id);

            let unservedOrder = orderList.find((order) => {
                // Replace 'gray.500' with the default color you use for unserved orders
                return order.color === 'gray.500';
            });            
            console.log(unservedOrder)
            if (unservedOrder) {
            // Assign color to the unserved order
                assignColorToUnservedOrder(unservedOrder, targetOrder);
            }else{
                // var orderColorToRemove = targetOrder.color;
                // console.log('availableColors');
                // console.log(availableColors);
                // console.log('unavailableColors');
                // console.log(unavailableColors);                
                // unavailableColors.delete(orderColorToRemove)
                // availableColors.add(orderColorToRemove)
                // const updatedOrderColors = { ...orderColors };
                // delete updatedOrderColors[invoice_id];
        
                // // Update the orderColors state with the updated object
                // setOrderColors(updatedOrderColors);
            }
    
            setOrderList(updatedOrderList);
            console.log(updatedOrderList);
            const cardElement = document.querySelector(`[data-invoice-id="${invoice_id}"]`);

            if (cardElement) {
              // Hide or remove the card element from the DOM
              cardElement.style.display = 'none'; // or cardElement.remove();
            }
            socket.emit('update', { invoice_id, status: 'served' });

        } catch (error) {
            // Handle any errors here
            console.log(error)
            alert('Error:', error);
        }
    }
    async function assignColorToUnservedOrder(unservedOrder, servedOrder) {
        // Check if the served order has a color
        console.log('assignColorToUnservedOrder');
        console.log(servedOrder);
    
        // Access the state variables instead of redeclaring them as local variables
        let servedOrderColor = servedOrder.color;
        console.log('availableColors');
        console.log(availableColors);
        console.log('unavailableColors');
        console.log(unavailableColors);
        console.log('servedOrderColor');
        console.log(servedOrderColor);
    
        if (servedOrderColor) {
            await updateColorInDatabase(unservedOrder.invoice_id, servedOrderColor);
            unservedOrder.color = servedOrderColor;
    
            let headingElement = document.getElementById('my-heading-' + unservedOrder.invoice_id);
            let cardElement = document.getElementById('my-card-' + unservedOrder.invoice_id);
    
            if (headingElement && cardElement) {
                headingElement.style.color = servedOrderColor;
                cardElement.style.borderColor = servedOrderColor;
            }
            console.log(unservedOrder)
            toggleButtonState(unservedOrder.invoice_id);

        }
    }
    
    
    

    async function updateColorInDatabase(invoice_id, color) {
        console.log('updateColorInDatabase')
        console.log("UPdating invoice id color"+invoice_id+"with"+color)
            const url = process.env.REACT_APP_API_URL+`/ticketing/update_invoice_colors/${invoice_id}`;
        
            const headers = {
            'Content-Type': 'application/json',
            };
        
            const requestBody = {
            color: color, 
            };
        
            const options = {
            method: 'POST',
            headers,
            body: JSON.stringify(requestBody),
            };
        
            try {
            const response = await fetch(url, options);
        
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
        
            const responseData = await response.json();
            
            console.log(`Color updated for invoice_id ${invoice_id}:`, responseData);
            console.log('availableColors');
            console.log(availableColors);
            console.log('unavailableColors');
            console.log(unavailableColors);
            console.log('servedOrderColor');
            } catch (error) {
            console.error('Error updating color in the database:', error);
            }
        }

    return (
        <div>
            <Heading>General Queue</Heading>

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
                                <Center mt={5}>
                                    <CustomServeButton
                                    id={'serve-button-' + order.invoice_id}
                                    onClick={() => {
                                        serveOrder(order.invoice_id);
                                        toast({
                                            position: 'topright',
                                            title: 'Order '+order.order_number+" Served!",
                                            status: 'success',
                                            duration: 9000,
                                            isClosable: true,
                                        })
                                    }}
                                    isDisabled={order.color === 'gray.500'}
                                    >
                                    </CustomServeButton>
                                </Center>
                                <Center style={{ marginTop: '50px' }}>
                                    <CustomCancelButton
                                    id={'cancel-button-' + order.invoice_id}
                                    onClick={() => {
                                        cancelOrder(order.invoice_id);
                                        toast({
                                            position: 'topright',
                                            title: 'Order '+order.order_number+" Cancelled!",
                                            status: 'error',
                                            duration: 9000,
                                            isClosable: true,
                                        })
                                    }}
                                    isDisabled={order.color === 'gray.500'}
                                    >
                                    </CustomCancelButton>
                                </Center>
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





function Admin_GeneralTicketingOrders() {

        return (
            <div className='container_order_container'  >
                <SideNavBar children={<TicketingOrders/>}></SideNavBar>
            </div>
        );
}
export default Admin_GeneralTicketingOrders;