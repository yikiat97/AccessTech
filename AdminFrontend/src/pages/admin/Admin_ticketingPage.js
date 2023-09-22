
import React, { useState,useEffect } from 'react';
import "./css/admin_login.css";
import SideNavBar from '../../Components/admin/SideNavBar'
import AdminAddMenu from '../../Components/admin/Admin_add_menu'
import AdminUpdateMenu from '../../Components/admin/Admin_update_menu'
import { Tabs, TabList, Tab, TabPanels, TabPanel, Box, IconButton, VStack } from "@chakra-ui/react";
import { AddIcon, EditIcon,CheckIcon,CloseIcon } from '@chakra-ui/icons'; // Equivalent icons in Chakra
import {LinkBox,Card,CardBody,Stack,Divider,CardFooter,ButtonGroup,Button,Heading,Center,LinkOverlay,Text,SimpleGrid,Image} from '@chakra-ui/react'
import { useColorMode } from "@chakra-ui/react";
import Admin_order_ticket from '../../Components/admin/Admin_order_ticket';
import OrderTicket from '../../Components/admin/Admin_order_ticket';


const TicketingOrders = () =>{
    const [orderList, setOrderList] = useState([]); // State to store the fetched data
    const [sortedFoodOrders, setSortedFoodOrders] = useState(null)
    const { colorMode } = useColorMode();
    const [orderDetails, setOrderDetails] = useState(null); // Initialize orderDetails as null

    const borderColor = colorMode === "dark" ? "red.500" : "pink.200"; // Change color based on color mode
    const buttonTextColor = colorMode === "dark" ? "#FFFFFF" : "#FFFFFF"; // Change color based on color mode
    const textColor = colorMode === "dark" ? "#ECC94B" : "#000000"; // Change color based on color mode
    useEffect(() => {
        // Make a GET request using fetch
        fetch(process.env.REACT_APP_API_URL+'/admin/fetch_invoice_parameter?invoice_status=pending')
            .then(response => response.json())
            .then(data => {
            // Handle the response data and set it in the state
                console.log(data)
                setOrderList(data)
            })
            .catch(error => {
            // Handle any errors
            console.error('Error:', error);
            });
        }, [])
        useEffect(() => {

        const updatedOrderDetails = {};
        console.log(orderList)
        // orderList.forEach((individualInvoice)=>{
        //     const invoice_id = individualInvoice.invoice_id
        //     individualInvoice.transactions.forEach((individualDish)=>{
        //         console.log(individualDish)


        //     })
        // })

        // orderList.forEach((individualOrder) => {
        //     const invoice_id = individualOrder.invoice_id;
        //     individualOrder.transactions.forEach((transaction) => {
        //         const { unique_key, dish_name, image_url, price, special_comments } = transaction;

        //         if (!updatedOrderDetails[invoice_id]) {
        //             updatedOrderDetails[invoice_id] = {};
        //         }

        //         if (!updatedOrderDetails[invoice_id][unique_key]) {
        //             updatedOrderDetails[invoice_id][unique_key] = {
        //                 items: [],
        //             };
        //         }

        //         updatedOrderDetails[invoice_id][unique_key].items.push({
        //             dish_name,
        //             image_url,
        //             price,
        //             special_comments,
        //         });
        //     });
        // });

        console.log(updatedOrderDetails)
        const result = {};

        // for (const invoiceId in updatedOrderDetails) {
        //     if (updatedOrderDetails.hasOwnProperty(invoiceId)) {
        //         result[invoiceId] = {};
        //         for (const uniqueKey in updatedOrderDetails[invoiceId]) {
        //             if (updatedOrderDetails[invoiceId].hasOwnProperty(uniqueKey)) {
        //                 const innerObj = updatedOrderDetails[invoiceId][uniqueKey];
        //                 const itemCounts = innerObj.itemCounts;
        //                 const items = innerObj.items;
    
        //                 for (const item of items) {
        //                     const dishName = item.dish_name;
        //                     result[invoiceId][uniqueKey] = {
        //                         ...itemCounts,
        //                         dish_name:dishName,
        //                         image_url: item.image_url,
        //                         special_comments: item.special_comments
        //                     };
        //                 }
        //             }
        //         }
        //     }
        // }
    
    
        // setOrderDetails(result);



    }, [orderList]);

    console.log(orderDetails)

    // Use a separate useEffect to listen for changes in orderDetails
    useEffect(() => {
        // You can add any additional logic here when orderDetails is updated.
        // For example, you can trigger specific actions or updates.

        // If you want to force a re-render when orderDetails is updated, you can use a state variable:
        // const [renderKey, setRenderKey] = useState(0);
        // setRenderKey(renderKey + 1);

    }, [orderDetails]);
    return (
        <div>
            <Heading>Priority Queue</Heading>

            {/* Conditional rendering based on orderDetails */}
            {orderList ? (
                <SimpleGrid columns={[1, null, 2, 4]} spacing={4}>
                    {orderList.map((order) => (
                        <div key={order.invoice_id}>
                            <Heading size='md' color={textColor}>Order Number {order.invoice_id}</Heading>
                                <Card maxW='sm' borderColor={'borderColor'} border='2px' m={3}>
                                {order.transactions.map((transaction, index) => (
                                    <div key={index}>
                                    <Heading m={[2, 3]} size='md' color={textColor}>{transaction.quantity}X {transaction.dish_name}</Heading>
                                    
                                    {transaction.special_comments.length > 0 && (
                                            <div>
                                                <h4>Special Comments:</h4>
                                                <ul >
                                                    {transaction.special_comments.map((comment) => (
                                                        <Text key={comment.comment_id} size='md' color='white'>- {comment.text}</Text>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        <hr />
                                    </div>
                                    ))}
                                    <Center mt={5}>
                                        <Button
                                            size='lg'
                                            background='#71149D'
                                            onClick={() => serveOrder(order.invoice_id)}
                                            textColor={buttonTextColor}
                                            variant='solid'
                                            colorScheme='purple'
                                            w='80%'
                                            display='flex'  // Use flex display to align items horizontally
                                            alignItems='center'  // Align items vertically in the center
                                            mb={2}
                                        >
                                            <CheckIcon mr={2} fontSize='2xl' style={{ marginRight: '5px' }} />
                                            <Text fontSize='2xl'>Serve</Text>
                                        </Button>
                                    </Center>
                                    <Center>
                                        <Button
                                            size='lg'
                                            background='#F00'
                                            onClick={() => cancelOrder(order.invoice_id)}
                                            textColor={buttonTextColor}
                                            variant='solid'
                                            colorScheme='red'
                                            w='80%'
                                            display='flex'  // Use flex display to align items horizontally
                                            alignItems='center'  // Align items vertically in the center
                                            mb={2}
                                        >
                                            <CloseIcon mr={2} fontSize='2xl'/>
                                            <Text fontSize='2xl'>Cancel</Text>
                                        </Button>
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


function serveOrder(invoice_id){
      // Define the URL with the invoice_id in the route
    const url = process.env.REACT_APP_API_URL+`/ticketing/update_invoice_status_completed/${invoice_id}`;

    // Define the request headers
    const headers = {
        'Content-Type': 'application/json',
        // You may need to include other headers, such as authentication tokens
    };

    // Define the request body if needed
    const requestBody = {
        // Include any data you want to send in the request body
    };

    // Define the fetch options
    const options = {
        method: 'PUT',  // Use 'PUT' for your specific route
        headers,
        body: JSON.stringify(requestBody),
    };

    // Make the fetch request
    fetch(url, options)
        .then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
        })
        .then((data) => {
        // Handle the response data here
        alert('Response:', data);
        })
        .catch((error) => {
        // Handle any errors here
        alert('Error:', error);
        });
}


function cancelOrder(invoice_id){
         // Define the URL with the invoice_id in the route
         const url = process.env.REACT_APP_API_URL+`/ticketing/update_invoice_status_cancel/${invoice_id}`;

         // Define the request headers
         const headers = {
             'Content-Type': 'application/json',
             // You may need to include other headers, such as authentication tokens
         };
     
         // Define the request body if needed
         const requestBody = {
             // Include any data you want to send in the request body
         };
     
         // Define the fetch options
         const options = {
             method: 'PUT',  // Use 'PUT' for your specific route
             headers,
             body: JSON.stringify(requestBody),
         };
     
         // Make the fetch request
         fetch(url, options)
             .then((response) => {
             if (!response.ok) {
                 throw new Error('Network response was not ok');
             }
             return response.json();
             })
             .then((data) => {
             // Handle the response data here
             alert('Response:', data);
             })
             .catch((error) => {
             // Handle any errors here
             alert('Error:', error);
             }); 
}


function Admin_ticketingOrders() {


    
        return (
            <div className='container_order_container'  >
                <SideNavBar children={<TicketingOrders/>}></SideNavBar>
            </div>
        );
}
export default Admin_ticketingOrders;;