import React, { useState, useContext, useEffect } from 'react';
import { useLottie } from "lottie-react";
import { Link, List, ListItem, Box, Button, Text, Modal, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from '@chakra-ui/react';
import paymentGraphic from '../../Components/ordering/OrderConfirmation/lotties/payment.json'
import { useLocation } from 'react-router-dom';
import CartContext from "../../Components/ordering/Cart/cart-context";

function OrderConfirmationPage(props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const cartCtx = useContext(CartContext);

    useEffect(() => {
      const savedOrderDetails = JSON.parse(sessionStorage.getItem('orderDetails'));
      if (savedOrderDetails) {
        cartCtx.items = [...savedOrderDetails];
      }
    }, []);


    const orderAgainHandler = () => {
      const lastOrderPage = sessionStorage.getItem('lastOrderPage'); 
      console.log("Last Order Page:", lastOrderPage); 
      sessionStorage.removeItem('savedOrderDetails');
      sessionStorage.removeItem('lastOrderPage');
      
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
          <ModalContent>
            <ModalHeader justifyContent='center' alignItems='center' display='flex'>Order Details</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
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
                   <Text padding='1' fontSize='lg' fontWeight='bold'>{`${index + 1}. ${item.name}`}</Text>
                   <Text mt='2'fontWeight='bold'>Price (per item): </Text> 
                   <Text fontWeight='bold' color='green'> ${item.price}0</Text>
                   {item.specialInstructions && item.specialInstructions.length > 0 && (
                    <Text mt='2' fontWeight='bold'>Special Instructions: </Text>
                   )}     
                   <List>
                        {item.specialInstructions.map((instruction, i) => (
                          <ListItem key={i}>{instruction.special_comments}(${instruction.special_comments_price}0)</ListItem>
                        ))}
                  </List>               
                 </Box>
                 <Box as='span' fontSize='2xl' color='teal'>
                   x {item.amount}
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
        loop: true,
        autoplay: true,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const totalAmount = searchParams.get('totalAmount');
    const LottieAnimation = useLottie(lottieOptions);

    return (
        
            <Box display='flex' w='100vw' h='100vh' alignItems='center' justifyContent='center'>
                <Box width='50%' height='50%' position='relative'>
                    <Box position='absolute' top='-120' left='0' right='0' textAlign='center' p='20px' borderRadius='10px' bg='rgb(242, 242, 242)'>
                        <Box fontSize='2xl' color='black'>
                            <span style={{ whiteSpace: 'nowrap' }}>Order Number :</span> 
                            <strong>
                            <Box as='span' fontSize='3xl'> 1</Box>
                            </strong>
                        </Box>
                    </Box>
                    <Box position='absolute' top='-30%' left='50%' transform='translateX(-50%)' width="400px" height="400px">
                        {LottieAnimation.View}
                        <Box top='5%'>
                            <Text fontSize={'xl'} style={{color:'grey'}} textAlign='center'>
                                <Text fontWeight='bold' fontSize='4xl' style={{color:'green'}}>{totalAmount}</Text>
                                Payment Confirmed! <br></br>
                                Please do not leave this page.
                            </Text>
                            
                        </Box>
                        <Button top='8%' right='1%' size='lg' colorScheme='blue' onClick={handleViewOrderDetails}>
                            View Order Details
                        </Button>
                        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                            {renderModalContent()}
                        </Modal>
                    <Link to="/AccessTech/customermenu">
                        <Button top='8%' left='1%' size='lg' colorScheme='green' onClick={orderAgainHandler}>
                            Order Again
                        </Button> 
                    </Link>
                    </Box> 
                </Box>      
            </Box>
        
    );
}

export default OrderConfirmationPage;

