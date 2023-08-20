import React, { useState } from 'react';
import CartItem from '../../Components/ordering/Order_CartItem.js';
import { Box, AbsoluteCenter, Divider, SimpleGrid } from '@chakra-ui/react';



function ShoppingCart(){
    return(
        <>
        <Box position='relative' padding='10'>
            <AbsoluteCenter bg='white' px='4' fontWeight='bold'>
                Cart
            </AbsoluteCenter> 
            
        </Box>
          <SimpleGrid padding="10px" spacing={4} templateColumns='repeat(auto-fill, minmax(500px, 1fr))'>
            <CartItem></CartItem>
            <CartItem></CartItem>
          </SimpleGrid>


        </>
        
    );
}

export default ShoppingCart;