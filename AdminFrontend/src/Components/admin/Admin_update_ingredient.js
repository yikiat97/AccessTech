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
          <Card maxW='sm' key={ingredient.id} borderColor={'borderColor'} border='2px'>
              <CardBody>
                  <Image
                  src='https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'
                  alt='Green double couch with wooden legs'
                  borderRadius='lg'
                  />
                  <Heading size='md'>{ingredient.ingredients_name}</Heading>
                  <Text fontSize='2xl'>
                      {ingredient.ingredients_qty}{ingredient.ingredients_type}
                  </Text>
              </CardBody>
                  <Center>
                      <Button background='#71149D' href="#test" variant='solid' colorScheme='purple' w='80%' display='block' mb={2}>
                      </Button>                        
                  </Center>

          </Card>
        ))}
      
      
      {/* <Card maxW='sm' borderColor={'borderColor'} border='2px'>
          <CardBody>
              <Image
              src='https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'
              alt='Green double couch with wooden legs'
              borderRadius='lg'
              />
              <Heading size='md'>To insert ticket number</Heading>
              <Text fontSize='2xl'>
                  $450
              </Text>
          </CardBody>
              <Center>
                  <Button background='#71149D' href="#test" variant='solid' colorScheme='purple' w='80%' display='block' mb={2}>
                  </Button>                        
              </Center>

      </Card> */}
    </SimpleGrid>  
  );
}

export default Admin_update_ingredient;
