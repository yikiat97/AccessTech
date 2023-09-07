import React, { useState } from 'react';
import NavigationBar from '../../Components/ordering/NavBar/Order_NavBar';
import CategoryItems from '../../Components/ordering/Order_CategoryItems';
import Cart from "../../Components/ordering/Cart/Cart";



function CustomerHomepage(){
    const [cartIsShown, setCartIsShown] = useState(false);

    const showCartHandler = () => {
        setCartIsShown(true);
    };
    const hideCartHandler = () => {
        setCartIsShown(false);
    };

    return(
        <>
            {cartIsShown && <Cart userType="public" onClose={hideCartHandler} />}
          <NavigationBar onShowCart={showCartHandler} onClose={hideCartHandler} ></NavigationBar>
          <CategoryItems userType="public"></CategoryItems>
       
        </>
        
    );
}

export default CustomerHomepage;