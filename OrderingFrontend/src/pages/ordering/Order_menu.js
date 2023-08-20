import React, { useState } from 'react';
import NavigationBar from '../../Components/ordering/NavBar/Order_NavBar';
import { categories } from '../../Components/ordering/data/categories'
import { menuList } from '../../Components/ordering/data/menulist'
import CategoryItems from '../../Components/ordering/Order_CategoryItems';
import Cart from "../../Components/ordering/Cart/Cart";
import CartProvider from "../../Components/ordering/Cart/CartProvider";



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
        <CartProvider>
            {cartIsShown && <Cart onClose={hideCartHandler} />}
          <NavigationBar onShowCart={showCartHandler} onClose={hideCartHandler} ></NavigationBar>
          <CategoryItems uniqueCategory={categories.categories} menuList={menuList}></CategoryItems>

            {/* {menuList.items.map((item)=>(
             
                <MenuCards item={item} ></MenuCards>
          
            ))} */}
      
        </CartProvider>
        </>
        
    );
}

export default CustomerHomepage;