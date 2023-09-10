
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
    const [sandwichList, setSandwichList] = useState([]); // State to store the fetched data
    const [sortedFoodOrders, setSortedFoodOrders] = useState(null)
    const { colorMode } = useColorMode();
    const [orderDetails, setOrderDetails] = useState(null); // Initialize orderDetails as null

    const borderColor = colorMode === "dark" ? "red.500" : "pink.200"; // Change color based on color mode
    const buttonTextColor = colorMode === "dark" ? "#FFFFFF" : "#FFFFFF"; // Change color based on color mode
    const textColor = colorMode === "dark" ? "#ECC94B" : "#000000"; // Change color based on color mode
    useEffect(() => {
        // Make a GET request using fetch
        fetch('http://127.0.0.1:5000/admin/fetch_invoice_parameter?invoice_status=pending')
            .then(response => response.json())
            .then(data => {
            // Handle the response data and set it in the state
                // setSandwichList(data)
                setSandwichList([
                    {
                        "date_time": "Sat, 02 Sep 2023 14:30:00 GMT",
                        "discounts": [
                            {
                                "discount_id": 7,
                                "discount_percent": 10.0
                            }
                        ],
                        "invoice_id": 22,
                        "invoice_status": "pending",
                        "total_price": 250.0,
                        "transactions": [
                            {
                                "dish_id": 1,
                                "dish_name": "Grilled Chicken Rendang with rice",
                                "image_url": "https://smuaccesstech.s3.us-east-1.amazonaws.com/Grilled_Chicken_Rendang_rice.JPG",
                                "price": 6.8,
                                "unique_key": 1,
                                "special_comments": [
                                    {
                                        "comment_id": 1,
                                        "text": "more rendang sauce"
                                    },
                                    {
                                        "comment_id": 2,
                                        "text": "add meat patty"
                                    },
                                    {
                                        "comment_id": 3,
                                        "text": "less rice"
                                    }
                                ],
                                "with_special_comments": true
                            },
                            {
                                "dish_id": 1,
                                "dish_name": "Grilled Chicken Rendang with rice",
                                "image_url": "https://smuaccesstech.s3.us-east-1.amazonaws.com/Grilled_Chicken_Rendang_rice.JPG",
                                "price": 6.8,
                                "unique_key": 1,
                                "special_comments": [
                                    {
                                        "comment_id": 1,
                                        "text": "more rendang sauce"
                                    },
                                    {
                                        "comment_id": 2,
                                        "text": "add meat patty"
                                    },
                                    {
                                        "comment_id": 3,
                                        "text": "less rice"
                                    }
                                ],
                                "with_special_comments": true
                            },
                            {
                                "dish_id": 1,
                                "dish_name": "Grilled Chicken Rendang with rice",
                                "image_url": "https://smuaccesstech.s3.us-east-1.amazonaws.com/Grilled_Chicken_Rendang_rice.JPG",
                                "price": 6.8,
                                "unique_key": 1,
                                "special_comments": [
                                    {
                                        "comment_id": 1,
                                        "text": "more rendang sauce"
                                    },
                                    {
                                        "comment_id": 2,
                                        "text": "add meat patty"
                                    },
                                    {
                                        "comment_id": 3,
                                        "text": "less rice"
                                    }
                                ],
                                "with_special_comments": true
                            },
                            {
                                "dish_id": 1,
                                "dish_name": "Grilled Chicken Rendang with rice",
                                "image_url": "https://smuaccesstech.s3.us-east-1.amazonaws.com/Grilled_Chicken_Rendang_rice.JPG",
                                "price": 6.8,
                                "unique_key": 1,
                                "special_comments": [
                                    {
                                        "comment_id": 1,
                                        "text": "more rendang sauce"
                                    },
                                    {
                                        "comment_id": 2,
                                        "text": "add meat patty"
                                    },
                                    {
                                        "comment_id": 3,
                                        "text": "less rice"
                                    }
                                ],
                                "with_special_comments": true
                            },
                            {
                                "dish_id": 3,
                                "dish_name": "Grilled Chicken Rendang with noodle",
                                "image_url": "https://smuaccesstech.s3.us-east-1.amazonaws.com/Grilled_Chicken_Rendang_noodle.JPG",
                                "price": 6.8,
                                "special_comments": [],
                                "unique_key": 2,
                                "with_special_comments": false
                            },
                            {
                                "dish_id": 3,
                                "dish_name": "Grilled Chicken Rendang with noodle",
                                "image_url": "https://smuaccesstech.s3.us-east-1.amazonaws.com/Grilled_Chicken_Rendang_noodle.JPG",
                                "price": 6.8,
                                "special_comments": [],
                                "unique_key": 2,
                                "with_special_comments": false
                            },
                            {
                                "dish_id": 3,
                                "dish_name": "Grilled Chicken Rendang with noodle",
                                "image_url": "https://smuaccesstech.s3.us-east-1.amazonaws.com/Grilled_Chicken_Rendang_noodle.JPG",
                                "price": 6.8,
                                "special_comments": [],
                                "unique_key": 2,
                                "with_special_comments": false
                            },
                            {
                                "dish_id": 4,
                                "dish_name": "Grilled Chicken Rendang with sando bread",
                                "image_url": "https://smuaccesstech.s3.us-east-1.amazonaws.com/Grilled_Chicken_Rendang_sandwich.JPG",
                                "price": 6.2,
                                "special_comments": [],
                                "unique_key": 3,
                                "with_special_comments": false
                            },{
                                "dish_id": 1,
                                "dish_name": "Grilled Chicken Rendang with rice",
                                "image_url": "https://smuaccesstech.s3.us-east-1.amazonaws.com/Grilled_Chicken_Rendang_rice.JPG",
                                "price": 6.8,
                                "unique_key": 4,
                                "special_comments": [
                                    {
                                        "comment_id": 1,
                                        "text": "more rendang sauce"
                                    },
                                    {
                                        "comment_id": 2,
                                        "text": "add meat patty"
                                    },

                                ],
                                "with_special_comments": true
                            },
                        ]
                    },
                    {
                        "date_time": "Sat, 02 Sep 2023 14:30:00 GMT",
                        "discounts": [
                            {
                                "discount_id": 7,
                                "discount_percent": 10.0
                            }
                        ],
                        "invoice_id": 25,
                        "invoice_status": "pending",
                        "total_price": 250.0,
                        "transactions": [
                            {
                                "dish_id": 1,
                                "dish_name": "Grilled Chicken Rendang with rice",
                                "image_url": "https://smuaccesstech.s3.us-east-1.amazonaws.com/Grilled_Chicken_Rendang_rice.JPG",
                                "price": 6.8,
                                "unique_key": 1,
                                "special_comments": [
                                    {
                                        "comment_id": 1,
                                        "text": "more rendang sauce"
                                    },
                                    {
                                        "comment_id": 2,
                                        "text": "add meat patty"
                                    },
                                    {
                                        "comment_id": 3,
                                        "text": "less rice"
                                    }
                                ],
                                "with_special_comments": true
                            }
                        ]
                    },                    {
                        "date_time": "Sat, 02 Sep 2023 14:30:00 GMT",
                        "discounts": [
                            {
                                "discount_id": 7,
                                "discount_percent": 10.0
                            }
                        ],
                        "invoice_id": 26,
                        "invoice_status": "pending",
                        "total_price": 250.0,
                        "transactions": [
                            {
                                "dish_id": 1,
                                "dish_name": "Grilled Chicken Rendang with rice",
                                "image_url": "https://smuaccesstech.s3.us-east-1.amazonaws.com/Grilled_Chicken_Rendang_rice.JPG",
                                "price": 6.8,
                                "unique_key": 1,
                                "special_comments": [
                                    {
                                        "comment_id": 1,
                                        "text": "more rendang sauce"
                                    },
                                    {
                                        "comment_id": 2,
                                        "text": "add meat patty"
                                    },
                                    {
                                        "comment_id": 3,
                                        "text": "less rice"
                                    }
                                ],
                                "with_special_comments": true
                            }
                        ]
                    },{
                        "date_time": "Sat, 02 Sep 2023 14:30:00 GMT",
                        "discounts": [
                            {
                                "discount_id": 7,
                                "discount_percent": 10.0
                            }
                        ],
                        "invoice_id": 27,
                        "invoice_status": "pending",
                        "total_price": 250.0,
                        "transactions": [
                            {
                                "dish_id": 1,
                                "dish_name": "Grilled Chicken Rendang with rice",
                                "image_url": "https://smuaccesstech.s3.us-east-1.amazonaws.com/Grilled_Chicken_Rendang_rice.JPG",
                                "price": 6.8,
                                "unique_key": 1,
                                "special_comments": [
                                    {
                                        "comment_id": 1,
                                        "text": "more rendang sauce"
                                    },
                                    {
                                        "comment_id": 2,
                                        "text": "add meat patty"
                                    },
                                    {
                                        "comment_id": 3,
                                        "text": "less rice"
                                    }
                                ],
                                "with_special_comments": true
                            }
                        ]
                    }
                ]);


            })
            .catch(error => {
            // Handle any errors
            console.error('Error:', error);
            });
        }, [])
        useEffect(() => {
        // When data is fetched, update orderDetails
        // When data is fetched, update orderDetails with invoice_id as the key
        const updatedOrderDetails = {};
        sandwichList.forEach((individualOrder) => {
            const invoice_id = individualOrder.invoice_id;
            individualOrder.transactions.forEach((transaction) => {
                const { unique_key, dish_name, image_url, price, special_comments } = transaction;

                if (!updatedOrderDetails[invoice_id]) {
                    updatedOrderDetails[invoice_id] = {};
                }

                if (!updatedOrderDetails[invoice_id][unique_key]) {
                    updatedOrderDetails[invoice_id][unique_key] = {
                        items: [],
                    };
                }

                updatedOrderDetails[invoice_id][unique_key].items.push({
                    dish_name,
                    image_url,
                    price,
                    special_comments,
                });
            });
        });
        const result = {};

        for (const invoiceId in updatedOrderDetails) {
            if (updatedOrderDetails.hasOwnProperty(invoiceId)) {
                result[invoiceId] = {};
                for (const uniqueKey in updatedOrderDetails[invoiceId]) {
                    if (updatedOrderDetails[invoiceId].hasOwnProperty(uniqueKey)) {
                        const innerObj = updatedOrderDetails[invoiceId][uniqueKey];
                        const itemCounts = innerObj.itemCounts;
                        const items = innerObj.items;
    
                        for (const item of items) {
                            const dishName = item.dish_name;
                            result[invoiceId][uniqueKey] = {
                                ...itemCounts,
                                dish_name:dishName,
                                image_url: item.image_url,
                                special_comments: item.special_comments
                            };
                        }
                    }
                }
            }
        }
    
    
        setOrderDetails(result);
    }, [sandwichList]);

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
            {orderDetails ? (
                <SimpleGrid columns={[1, null, 2, 4]} spacing={4}>
                    {Object.keys(orderDetails).map((invoiceId) => (
                        <div key={invoiceId}>
                        <Heading size='md' color={textColor}>Order Number {invoiceId}</Heading>
                        <Card maxW='sm' borderColor={'borderColor'} border='2px' m={3}>
                            {Object.keys(orderDetails[invoiceId]).map((itemId) => {
                            const item = orderDetails[invoiceId][itemId];
                            return (
                                <div key={itemId}>
                                <Heading size='md' color={textColor}>{item.dish_name}</Heading>
                                <ul>
                                    {item.special_comments.map((comment) => (
                                    <Text key={comment.comment_id} size='md' color='white'>- {comment.text}</Text>
                                    ))}
                                </ul>
                                </div>
                            );
                            })}                                                     
                                <Center>
                                    <Button background='#71149D' onClick={serveOrder(invoiceId)} textColor={buttonTextColor} variant='solid' colorScheme='purple' w='80%' display='block' mb={2}>
                                        <CheckIcon style={{ marginRight: '5px' }} />Serve
                                    </Button>
                                </Center>
                                <Center>
                                    <Button background='#F00' href="#test" textColor={buttonTextColor} variant='solid' colorScheme='red' w='80%' display='block' mb={2}>
                                        <CloseIcon style={{ marginRight: '5px' }} />Cancel
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

}



function Admin_ticketingOrders() {


    
        return (
            <div className='container_order_container'  >
                <SideNavBar children={<TicketingOrders/>}></SideNavBar>

            </div>
        );
}
export default Admin_ticketingOrders;;