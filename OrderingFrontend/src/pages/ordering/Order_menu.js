import React, { useState } from 'react';
import NavigationBar from '../../Components/ordering/Order_NavBar';
import { categories } from '../../Components/ordering/data/categories'
import { menuList } from '../../Components/ordering/data/menulist'
import CategoryItems from '../../Components/ordering/Order_CategoryItems';




function customer_homepage(){
    
    return(
        <>
          <NavigationBar></NavigationBar>
          <CategoryItems uniqueCategory={categories.categories} menuList={menuList}></CategoryItems>

            {/* {menuList.items.map((item)=>(
             
                <MenuCards item={item} ></MenuCards>
          
            ))} */}
      
         
        </>
        
    );
}

export default customer_homepage;