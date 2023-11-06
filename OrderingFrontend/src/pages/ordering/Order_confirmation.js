import React, { useState, useContext, useEffect, useRef} from 'react';
import { useLottie } from "lottie-react";
import { Link, List, ListItem, Box, Button, Text, Modal, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from '@chakra-ui/react';
import paymentGraphic from '../../Components/ordering/OrderConfirmation/lotties/payment.json'
import LoopingEllipsis from '../../Components/ordering/OrderConfirmation/lotties/ellipsis_animation'
import { useLocation } from 'react-router-dom';
import CartContext from "../../Components/ordering/Cart/cart-context";

function OrderConfirmationPage(props) {
    const isInitialMount = useRef(true); 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const cartCtx = useContext(CartContext);
    const [orderNumber, setOrderNumber] = useState(null);

    // const clientSecret = new URLSearchParams(window.location.search).get(
    //   "redirect_status"
    //   );
         

    useEffect(() => {
      const apiCalled = sessionStorage.getItem('apiCalled');
      const savedOrderDetails = JSON.parse(sessionStorage.getItem('orderDetails'));
      if (savedOrderDetails) {
        cartCtx.items = [...savedOrderDetails]; 
      }
      const savedDiscountId = sessionStorage.getItem('discountId');
      if (savedDiscountId) {
        cartCtx.discountId = parseFloat(savedDiscountId)
      }
      const savedTotalAmount = sessionStorage.getItem('totalAmount');
      if (savedTotalAmount) {
        cartCtx.totalAmount = parseFloat(savedTotalAmount);
      }
      if (isInitialMount.current) {
        isInitialMount.current = false;
        
        if (true  ) {
          
    const ticketingOrderDetails = {
      "date_time": "2023-09-02T14:30:00Z",
      "total_price": cartCtx.totalAmount,
      "queue_num": 0,
      "invoice_status": "pending",
      "discount_id": cartCtx.discountId,
      "transactions": cartCtx.items.map(item => {
        return {
          "dish_id": item.dish_id,
          "quantity": item.amount,
          "special_comments_id": item.specialInstructions.map(special => special.special_comments_id)
        };
      })
    };
    console.log(ticketingOrderDetails)
          sessionStorage.setItem('apiCalled', 'true');
          
      fetch(process.env.REACT_APP_API_URL+'/admin/add_invoice', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(ticketingOrderDetails),
        })
        .then(response => response.json())
        .then(data => {
          console.log('Success:', data);
          console.log(data.Order_number)
          setOrderNumber(data.Order_number)
        })
        .catch((error) => {
          console.error('Error:', error);
        });
      }}});
      

    const orderAgainHandler = () => {
      const lastOrderPage = sessionStorage.getItem('lastOrderPage'); 
      console.log("Last Order Page:", lastOrderPage); 
      sessionStorage.removeItem('savedOrderDetails');
      sessionStorage.removeItem('lastOrderPage');
      sessionStorage.removeItem('apiCalled');
      sessionStorage.removeItem('discountId')

      if (lastOrderPage === 'student') {  
        console.log("Navigating to student menu");  
        window.location.href = '/AccessTech/studentmenu'; 
      } else if (lastOrderPage === 'public') {
        console.log("Navigating to public menu");
        window.location.href = '/AccessTech/publicmenu'; 
      } 
      };

    const renderModalContent = () => {
        return (
          <ModalContent width="100%" height="100vh">
            <ModalHeader justifyContent='center' alignItems='center' display='flex'>Order Details</ModalHeader>
            <ModalCloseButton style={{ color: 'black' }} />
            <ModalBody style={{maxHeight: "calc(100vh - 300px)", overflowY: "auto"}}>
            {cartCtx.items.map((item, index) => (
               <Box key={item.unique_id} marginBottom="10px">
               <Box
                 border="1px solid lightgrey"
                 borderRadius="10px"
                 padding="10px"
                 marginBottom="15px"
                 display="flex"
                 justifyContent="space-between"
                 alignItems="center" 
               >
                 <Box>
                 <Text padding='1' fontSize='md' fontWeight='bold' display="flex" alignItems="center">
                  {`${index + 1}. ${item.name}`} 
                  <Box as='span' fontSize='xl' color='teal' marginLeft="auto" ml={5}>
                    x{item.amount}
                  </Box>
                </Text>
                   <Box display="flex" flexDirection="row" alignItems="center" mt='5%'>
                    <Text fontStyle={'italic'}>Price (per item): </Text> 
                    <Text ml={2} fontWeight='bold' color='green'> ${item.price.toFixed(2)}</Text>
                  </Box>
                   {item.specialInstructions && item.specialInstructions.length > 0 && (
                    <Text mt='2' fontWeight={'bold'}>Special Instructions: </Text>
                   )}     
                   <List>
                        {item.specialInstructions.map((instruction, i) => (
                          <ListItem key={i}>{instruction.special_comments}(${instruction.special_comments_price})</ListItem>
                        ))}
                  </List>               
                 </Box>
                 
               </Box>
             </Box>
           ))}
            </ModalBody>
            <ModalFooter>
              
            </ModalFooter>
          </ModalContent>
        );
      };
    
    const handleViewOrderDetails = () => {
        setIsModalOpen(true);
    };
    
    const orderHandler = () => {
        cartCtx.clearAll();
        
      };
    
    const lottieOptions = {
        animationData: paymentGraphic,
        loop: false,
        autoplay: true,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    // const totalAmount = searchParams.get('totalAmount');
    const LottieAnimation = useLottie(lottieOptions);

    return (

      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" w="100vw">
      <Box w="100%" h="100%" position="relative" maxW="500px" mx="auto">
        <Box position="absolute" top="50px" left="50%" transform="translate(-50%, 0)" p="20px" borderRadius="10px" bg="gray.200">
          <Text fontSize="xl" color="black">
            Order Number : <Box as="span" fontWeight="bold" fontSize="3xl">{orderNumber ? orderNumber : <LoopingEllipsis/>}</Box>
          </Text>
        </Box>
        <Box position="absolute" top="200px" left="50%" transform="translate(-50%, 0)" width="100px" height="100px">
          {LottieAnimation.View}
        </Box>
        <Box position="absolute" top="300px" left="50%" transform="translate(-50%, 0)">
          <Text fontSize="xl" color="gray.600" textAlign="center">
            <Text fontWeight="bold" fontSize="4xl" color="green">${parseFloat(cartCtx.totalAmount).toFixed(2)}</Text>
            Payment Confirmed! <br />
            Cooking in process<LoopingEllipsis/>
          </Text>
          <Button mt="20px" size="lg" colorScheme="blue" onClick={handleViewOrderDetails}>
            View Order Details
          </Button>
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="full">
            {renderModalContent()}
          </Modal>
          <Link>
            <Button mt="10px" size="lg" colorScheme="green" onClick={orderAgainHandler}>
              End Order Session
            </Button>
          </Link>
        </Box>
      </Box>
    </Box>


)}
  
export default OrderConfirmationPage;
