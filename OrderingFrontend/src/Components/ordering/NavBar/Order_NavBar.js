import React from 'react';
import './css/Order_NavBar.css'; 
import logo from '../../../assets/logo/KC_Logo.png';
import { Flex } from '@chakra-ui/react'
import HeaderCartButton from "./HeaderCartButton";


const NavigationBar = (props) => {
  return (
    <Flex style={{ position: "sticky", top: 0, backgroundColor: "white", zIndex: 100 }} justifyContent="center" alignItems="center">
          <div className="logo-container">
            <img className="logo" src={logo} alt="Fortitude Logo" />
          </div>

          <div className="cart-button-container">
            <HeaderCartButton onClick={props.onShowCart} />
          </div>
          
   
         
         
        
      
      

    </Flex>

  );
      
};

export default NavigationBar;