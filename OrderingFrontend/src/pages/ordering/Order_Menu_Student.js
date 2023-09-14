import React, { useState } from 'react';
import NavigationBar from '../../Components/ordering/NavBar/Order_NavBar';
import CategoryItems from '../../Components/ordering/Order_CategoryItems';
import Cart from "../../Components/ordering/Cart/Cart";
import { io } from "socket.io-client";



function CustomerHomepage(){
    const [cartIsShown, setCartIsShown] = useState(false);
    

    const socket = io.connect('http://localhost:5000');


socket.on('connect', function() {
    console.log("Connected to server");
    
    // You can send messages to the server
    socket.emit('message', {data: 'Hello Server'});
});

socket.on('update', function(data) {
    console.log(data.data);
});



    const showCartHandler = () => {
        setCartIsShown(true);
    };
    const hideCartHandler = () => {
        setCartIsShown(false);
    };

    return(
        <>
            {cartIsShown && <Cart userType="student" onClose={hideCartHandler} />}
          <NavigationBar onShowCart={showCartHandler} onClose={hideCartHandler} ></NavigationBar>
          <CategoryItems userType="student"></CategoryItems>
       
        </>
        
    );
}

export default CustomerHomepage;