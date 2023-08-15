import React from 'react';
import '../admin/css/customer.css'; 
import logo from '../../assets/logo/logo.png';
import { IconButton, Flex } from '@chakra-ui/react'
import { FaShoppingBasket } from 'react-icons/fa';


import { Link } from 'react-router-dom';


const NavigationBar = () => {
  return (
    <Flex flexWrap='wrap' alignItems='center' justifyContent='center'>
      <nav className="navbar">
        <img style={{width:"100px", height:"100px" }} src={logo} alt="Fortitude Logo" />
        <IconButton className="cart" aria-label='Search database' icon={<FaShoppingBasket /> } as={Link} to="/Accesstech/customercart" />
      
        
      </nav>

    </Flex>

  );
      
};

export default NavigationBar;