import React, { useState,useEffect } from 'react';
import {
  Box,
  Text,
  Avatar,
  IconButton,
  Image,
  Button,
  VStack,
  Heading,
  Container,
  SimpleGrid,
  Card,
  CardBody,
  Center,
} from '@chakra-ui/react';
import { ArrowUpIcon,ArrowDownIcon } from '@chakra-ui/icons'
import Admin_update_ingredient_card from './Admin_update_ingredient_card';
function Admin_update_ingredient() {
  const [ingredientList, setIngredientList] = useState([]); // State to store the fetched data

  useEffect(() => {
    // Make a GET request using fetch
    fetch('http://127.0.0.1:5000/ingredient/getAllIngredients')
      .then(response => response.json())
      .then(data => {
        // Handle the response data and set it in the state
        setIngredientList(data);
      })
      .catch(error => {
        // Handle any errors
        console.error('Error:', error);
      });
  }, [])
  console.log(ingredientList)
  return (
    <SimpleGrid templateColumns='repeat(auto-fill, minmax(200px, 1fr))'>
        {ingredientList.map((ingredient) => (
          <div>
            <Admin_update_ingredient_card ingredient={ingredient}></Admin_update_ingredient_card>
          </div>

        ))}      
    </SimpleGrid>  
  );
}

export default Admin_update_ingredient;
