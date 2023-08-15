import React, { useState } from 'react';
import NavigationBar from '../../Components/admin/NavBar';
import { categories } from '../../Components/admin/data/categories'
import { menuList } from '../../Components/admin/data/menulist'
import CategoryItems from '../../Components/admin/CategoryItems';
import MenuCards from '../../Components/admin/MenuCard';



function customer_homepage(){
    return(
        <>
          <NavigationBar></NavigationBar>
          <CategoryItems uniqueCategory={categories.categories} ></CategoryItems>

            {menuList.items.map((item)=>(
             
                <MenuCards item={item} ></MenuCards>
          
            ))}
      
         
        </>
        
    );
}

export default customer_homepage;