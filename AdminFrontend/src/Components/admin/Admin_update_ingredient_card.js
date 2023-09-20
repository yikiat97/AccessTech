import React, { useState,useEffect,useProp } from 'react';
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

function Admin_update_ingredient_card(props) {
     // State to store the fetched data

    console.log(props)
    return (
                <Card maxW='sm' key={props.ingredient.ingredients_id} borderColor={'borderColor'} border='2px'>
                    <CardBody>
                        <Image
                        src='https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'
                        alt='Green double couch with wooden legs'
                        borderRadius='lg'
                        />
                        <Heading size='md'>{props.ingredient.ingredients_name}</Heading>
                        <Text fontSize='2xl'>
                            {props.ingredient.ingredients_qty}{props.ingredient.ingredients_type}
                        </Text>
                    </CardBody>
                        <Center>
                            <Button background='#71149D' href="#test" variant='solid' colorScheme='purple' w='80%' display='block' mb={2}>
                            </Button>                        
                        </Center>

                </Card>
    );
}

export default Admin_update_ingredient_card;
