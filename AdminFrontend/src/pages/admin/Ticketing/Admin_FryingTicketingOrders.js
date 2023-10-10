
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
const colors = ['#FFC107', '#F44336', '#4CAF50', '#2196F3'];

let availableColors = new Set(colors);
let unavailableColors = new Set();

const FryingTicketingOrders = () =>{
    const [orderList, setOrderList] = useState([]); // State to store the fetched data
    const [sortedFoodOrders, setSortedFoodOrders] = useState(null)
    const { colorMode } = useColorMode();
    const [orderDetails, setOrderDetails] = useState(null); // Initialize orderDetails as null
    const [initialFetchComplete, setInitialFetchComplete] = useState(false); // State to track the initial fetch

    const [orderColors, setOrderColors] = useState({}); // Track colors by invoice_id
    const [nextColorIndex, setNextColorIndex] = useState(0); // Track the index of the next color to use

    const borderColor = colorMode === "dark" ? "red.500" : "pink.200"; // Change color based on color mode
    const buttonTextColor = colorMode === "dark" ? "#FFFFFF" : "#FFFFFF"; // Change color based on color mode
    const textColor = colorMode === "dark" ? "#FFFFFF" : "#000000"; // Change color based on color mode
    const socket = io.connect('http://localhost:8080');




    useEffect(() => {

        // Make a GET request using fetch
        fetch(process.env.REACT_APP_API_URL+'/admin/fetch_invoice_parameter?invoice_status=pending')
            .then(response => response.json())
            .then(data => {
            // Handle the response data and set it in the state
                console.log(data)
                setOrderList(data)
                // Handle the response data and set it in the state
                console.log('fetching data');
                console.log(data);
                setOrderList(data);
        
                const updatedColors = {};
                for (let i = 0; i < Math.min(data.length, 4); i++) {
                    updatedColors[data[i].invoice_id] = colors[i];
            
                    // Check if the 'color' property exists in data and add it to unavailableColors if it does
                    if (data[i].color) {
                        unavailableColors.add(data[i].color);
                        availableColors.delete(data[i].color)
                    }
                }
            
                // Determine available colors by filtering the colors array
                // Filter the colors array and add the filtered colors to availableColors Set
                colors.forEach(color => {
                    if (!unavailableColors.has(color)) {
                        availableColors.add(color);
                    }
                });
                
                setOrderColors(updatedColors);
                console.log('updatedColors')
                console.log(updatedColors)
                // Assuming you have already populated updatedColors as mentioned in your previous code
                console.log('availableColors')
                console.log(availableColors)
                console.log('unavailableColors')
                console.log(unavailableColors)
                for (const invoiceId in updatedColors) {
                    if (updatedColors.hasOwnProperty(invoiceId)) {
                        const color = updatedColors[invoiceId];
            
                        // Define the URL for the PUT request
                        const url = process.env.REACT_APP_API_URL+`/ticketing/update_invoice_colors/${invoiceId}`;
                        console.log(url)
                        // Define the request headers
                        const headers = {
                        'Content-Type': 'application/json',
                        };
            
                        // Define the request body
                        const requestBody = {
                        color: color, // You may need to adjust the key based on your server's expectations
                        };
            
                        // Define the fetch options
                        const options = {
                        method: 'POST',
                        headers,
                        body: JSON.stringify(requestBody),
                        };
            
                        // Make the PUT request for each invoice_id
                        fetch(url, options)
                        .then((response) => {
                            if (!response.ok) {
                            throw new Error('Network response was not ok');
                            }
                            return response.json();
                        })
                        .then((data) => {
                            // Handle the response data if needed
                            console.log(`Color updated for invoice_id ${invoiceId}`);
                            console.log('availableColors');
                            console.log(availableColors);
                            console.log('unavailableColors');
                            console.log(unavailableColors);
                            console.log('servedOrderColor');
                        })
                        .catch((error) => {
                            // Handle any errors here
                            console.error(`Error updating color for invoice_id ${invoiceId}:`, error);
                        });
                    }
                }
            })
            .catch((error) => {
                // Handle any errors
                console.error('Error:', error);
            });
        

    }, []);
    useEffect(() => {
        socket.on('connect', function() {
            console.log("Connected to server");
            
            // You can send messages to the server
            socket.emit('message', {data: 'Hello Server'});
        });
        socket.on('update', function (data) {
            // Check if there are available colors
            console.log('New Incoming Order')
            console.log("BEFORE___________")
            console.log('availableColors')
            console.log(availableColors)
            console.log('unavailableColors')
            console.log(unavailableColors)
            console.log(data)
            if (availableColors.size > 0) {
                // Get an available color (for example, you can use the first one)
                const colorToUse = availableColors.values().next().value;
                console.log(colorToUse);
                // Remove the used color from availableColors
                availableColors.delete(colorToUse);

                // Add the used color to unavailableColors
                unavailableColors.add(colorToUse);

                // Add the color property to the data object
                const dataWithColor = { ...data.data, color: colorToUse };

                // Append dataWithColor to the existing orderList
                setOrderList((prevOrderList) => [
                    ...prevOrderList,
                    dataWithColor
                ]);
                console.log(data.data.invoice_id)
                updateColorInDatabase(data.data.invoice_id, colorToUse);
    
                // Change the style of the Heading and Card components
                const headingElement = document.getElementById('my-heading-' + data.invoice_id);
                const cardElement = document.getElementById('my-card-' + data.invoice_id);
        
                if (headingElement && cardElement) {
                    headingElement.style.color = colorToUse;
                    cardElement.style.borderColor = colorToUse;
                }
            } else {
                // Handle the case when there are no available colors
                // Add the color property to the data object
                // const defaultColor = 'gray.500'
                const dataWithColor = { ...data.data, color:data.data.color};
                // const dataWithColor = { ...data.data, color: defaultColor };
                console.log(dataWithColor)
                // Append dataWithColor to the existing orderList
                setOrderList((prevOrderList) => [
                    ...prevOrderList,
                    dataWithColor
                ]);
                console.log(data.data.invoice_id)

                // updateColorInDatabase(data.data.invoice_id, data.data.color);
    
                // Change the style of the Heading and Card components
                const headingElement = document.getElementById('my-heading-' + data.invoice_id);
                const cardElement = document.getElementById('my-card-' + data.invoice_id);
        
                if (headingElement && cardElement) {
                    headingElement.style.color = data.data.color;
                    cardElement.style.borderColor = data.data.color;
                }
            }
            // Update the color in the database using a POST request
            // updateColorInDatabase(unservedOrder.invoice_id, servedOrderColor);


        });
        
        // Clean up the event listener when the component unmounts
        return () => {
            socket.off('update');
        };
    }, []);

    // Function to cancel an order
    async function cancelOrder(invoice_id) {
        console.log('Cancel Order')
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
                var orderColorToRemove = targetOrder.color;
                console.log('availableColors');
                console.log(availableColors);
                console.log('unavailableColors');
                console.log(unavailableColors);                
                unavailableColors.delete(orderColorToRemove)
                availableColors.add(orderColorToRemove)
                const updatedOrderColors = { ...orderColors };
                delete updatedOrderColors[invoice_id];
        
                // Update the orderColors state with the updated object
                setOrderColors(updatedOrderColors);
            }
    
            setOrderList(updatedOrderList);
            console.log(updatedOrderList);
            alert(`Order Number ${invoice_id} Cancelled!`);
        }catch(error) {
            // Handle any errors here
            alert('Error:', error);
        };
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
                var orderColorToRemove = targetOrder.color;
                console.log('availableColors');
                console.log(availableColors);
                console.log('unavailableColors');
                console.log(unavailableColors);                
                unavailableColors.delete(orderColorToRemove)
                availableColors.add(orderColorToRemove)
                const updatedOrderColors = { ...orderColors };
                delete updatedOrderColors[invoice_id];
        
                // Update the orderColors state with the updated object
                setOrderColors(updatedOrderColors);
            }
    
            setOrderList(updatedOrderList);
            console.log(updatedOrderList);
            alert(`Order Number ${invoice_id} served!`);

        } catch (error) {
            // Handle any errors here
            console.log(error)
            alert('Error:', error);
        }
    }
    async function assignColorToUnservedOrder(unservedOrder, servedOrder) {
        // Check if the served order has a color
        console.log('assignColorToUnservedOrder');
        console.log(servedOrder)
        // Access the state variables instead of redeclaring them as local variables
        let servedOrderColor = servedOrder.color
        console.log('availableColors');
        console.log(availableColors);
        console.log('unavailableColors');
        console.log(unavailableColors);
        console.log('servedOrderColor');
        console.log(servedOrderColor);
    
        if (servedOrderColor) {

    
            // Update the color in the database using a POST request
            await updateColorInDatabase(unservedOrder.invoice_id, servedOrderColor);
            unservedOrder.color = servedOrderColor

            // Change the style of the Heading and Card components
            const headingElement = document.getElementById('my-heading-' + unservedOrder.invoice_id);
            const cardElement = document.getElementById('my-card-' + unservedOrder.invoice_id);
    
            if (headingElement && cardElement) {
                headingElement.style.color = servedOrderColor;
                cardElement.style.borderColor = servedOrderColor;
            }
        }
    }
    
    

    async function updateColorInDatabase(invoice_id, color) {
        console.log('updateColorInDatabase')
        console.log("UPdateing invoice id color"+invoice_id+"with"+color)
        // Define the URL for the POST request
            const url = process.env.REACT_APP_API_URL+`/ticketing/update_invoice_colors/${invoice_id}`;
        
            // Define the request headers
            const headers = {
            'Content-Type': 'application/json',
            };
        
            // Define the request body
            const requestBody = {
            color: color, // You may need to adjust the key based on your server's expectations
            };
        
            // Define the fetch options
            const options = {
            method: 'POST',
            headers,
            body: JSON.stringify(requestBody),
            };
        
            try {
            // Make the POST request to update the color in the database
            const response = await fetch(url, options);
        
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
        
            // Handle the response data if needed
            const responseData = await response.json();
            
            console.log(`Color updated for invoice_id ${invoice_id}:`, responseData);
            console.log('availableColors');
            console.log(availableColors);
            console.log('unavailableColors');
            console.log(unavailableColors);
            console.log('servedOrderColor');
            } catch (error) {
            // Handle any errors related to updating the color in the database
            console.error('Error updating color in the database:', error);
            }
        }

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
                                color={ order.color} // Default to gray if no color assigned
                                id={'my-heading-' + order.invoice_id} // Concatenate the ID string with order.invoice_id
                            >
                                Order Number {order.invoice_id}
                            </Heading>                            
                            <Card maxW='sm' id={'my-card-'+order.invoice_id} style={{ borderColor:order.color}} border='2px' m={3}>     
                                {order.transactions.map((transaction, index) => (
                                    <div key={index}>
                                        {/* <Heading m={[2, 3]} size='md' color={textColor}>{transaction.quantity}X {transaction.dish_name}</Heading> */}
                                        <Grid
                                            templateColumns={['1fr', '1fr 2fr']} // Use responsive column layout
                                            alignItems='center' // Vertically center the content
                                            gap={2} // Add some spacing between the columns
                                            m={[2, 3]}
                                            fontSize='3xl'
                                            color={textColor}
                                        >
                                            <Box fontWeight='bold'>{transaction.quantity}X</Box>
                                            <Box>
                                                <Text as="b">{transaction.dish_name}</Text>
                                                {transaction.special_comments.length > 0 && (
                                                    <Grid>
                                                        <Box borderBottom="1px solid white" pb={2} mb={2}>
                                                            Special Comments:
                                                        </Box>
                                                        <Box>
                                                        {transaction.special_comments.map((comment) => (
                                                                <Text key={comment.comment_id} fontSize="xl"  color="white">
                                                                    - {comment.text}
                                                                </Text>
                                                        ))}

                                                        </Box>
                                                    </Grid>

                                                )}
                                            
                                            </Box>
                                        </Grid>

                                    </div>
                                    ))}
                                    <Center mt={5}>
                                        <Button
                                            size='xl' // Set your custom button size
                                            paddingX='6' // Adjust the horizontal padding as needed
                                            paddingY='4' // Adjust the vertical padding as needed
                                            background='#71149D'
                                            onClick={() => serveOrder(order.invoice_id)}
                                            textColor={buttonTextColor}
                                            variant='solid'
                                            colorScheme='purple'
                                            w='80%'
                                            display='flex'
                                            alignItems='center'
                                            mb={8}
                                        >
                                            <CheckIcon mr={2} fontSize='2xl' style={{ marginRight: '5px' }} />
                                            <Text fontSize='2xl'>Serve</Text>
                                        </Button>
                                        </Center>
                                        <Center>
                                        <Button
                                            size='xl' // Set your custom button size
                                            paddingX='6' // Adjust the horizontal padding as needed
                                            paddingY='4' // Adjust the vertical padding as needed
                                            background='#F00'
                                            onClick={() => cancelOrder(order.invoice_id)}
                                            textColor={buttonTextColor}
                                            variant='solid'
                                            colorScheme='red'
                                            w='80%'
                                            display='flex'
                                            alignItems='center'
                                            mb={8}
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





function Admin_FryingTicketingOrders() {

        return (
            <div className='container_order_container'  >
                <SideNavBar children={<FryingTicketingOrders/>}></SideNavBar>
            </div>
        );
}
export default Admin_FryingTicketingOrders;