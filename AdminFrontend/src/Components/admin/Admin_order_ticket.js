
import React, { useState,useEffect } from 'react';
import SideNavBar from '../../Components/admin/SideNavBar'
import AdminAddMenu from '../../Components/admin/Admin_add_menu'
import AdminUpdateMenu from '../../Components/admin/Admin_update_menu'
import { Tabs, TabList, Tab, TabPanels, TabPanel, Box, IconButton, VStack } from "@chakra-ui/react";
import { AddIcon, EditIcon,CheckIcon,CloseIcon } from '@chakra-ui/icons'; // Equivalent icons in Chakra
import {LinkBox,Card,CardBody,Stack,Divider,CardFooter,ButtonGroup,Button,Heading,Center,LinkOverlay,Text,SimpleGrid,Image} from '@chakra-ui/react'
import { useColorMode } from "@chakra-ui/react";



const OrderTicket = (props) =>{
    const { orderDetails } = props;
    const { colorMode } = useColorMode();
    console.log(orderDetails)
    const borderColor = colorMode === "dark" ? "red.500" : "pink.200"; // Change color based on color mode
    const buttonTextColor = colorMode === "dark" ? "#FFFFFF" : "#FFFFFF"; // Change color based on color mode
    const textColor = colorMode === "dark" ? "#ECC94B" : "#000000"; // Change color based on color mode

    const [isOrderDetailsPopulated, setIsOrderDetailsPopulated] = useState(false);

    useEffect(() => {
        // Check if orderDetails is not empty and contains data
        if (orderDetails && orderDetails.length > 0) {
            setIsOrderDetailsPopulated(true);
        } else {
            setIsOrderDetailsPopulated(false);
        }
    }, [orderDetails]);

    // Render the component when isOrderDetailsPopulated is true
    if (isOrderDetailsPopulated) {
        return (
            <div>
                <Heading>Priority Queue</Heading>
                <SimpleGrid templateColumns='repeat(auto-fill, minmax(200px, 1fr))'>
                    {orderDetails.map((orderDetail, index) => (
                        <Card key={index} maxW='sm' borderColor={borderColor} border='2px' m={3}>
                            <Heading size='md' color={textColor}>Order Number {orderDetail.invoice_id}</Heading>
                        </Card>
                    ))}
                </SimpleGrid>
            </div>
        );
    } else {
        // Render a loading message when isOrderDetailsPopulated is false
        return <p>Loading order details...</p>;
    }
}



function serveOrder(item) {
    // Define the data to be sent in JSON format
        // const requestData = {
        // date_time: "YourDateTimeValue",
        // total_price: 250, // Replace with your total_price value
        // queue_num: "YourQueueNumValue",
        // invoice_status: "YourInvoiceStatusValue",
        // discount_id: 7, // Replace with your discount_id value
        // transactions_data: [], // Your transactions data array
        // };
    
        // // Make a POST request to your backend API
        // fetch("http://127.0.0.1:5000/admin/add_invoice", {
        // method: "POST",
        // headers: {
        //     "Content-Type": "application/json",
        // },
        // body: JSON.stringify(requestData),
        // })
        // .then((response) => response.json())
        // .then((data) => {
        //     // Handle the response from the backend if needed
        //     console.log(data);
        // })
        // .catch((error) => {
        //     // Handle any errors that occurred during the fetch
        //     console.error("Error:", error);
        // });
}

export default OrderTicket;;