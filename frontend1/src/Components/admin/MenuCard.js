import React from 'react';
import { Image,  Box, Card, CardBody, Flex, SimpleGrid,Stack,Heading,Text,Divider,CardFooter,ButtonGroup,Button} from '@chakra-ui/react'
import '../../Components/admin/css/customer.css'
import food from '../../assets/foodImage/afri.jpg'




export default function MenuCards(props){
    return(
        <Flex mx ={5} px={5} py={5} alignItems="center" justifyContent="center">       
            <Card > 
                <CardBody height='200px' width='200px'>
                    <Image src={food} align={'center'} maxH='200px' fit ></Image>
                <Box>
                    <h1 className='title'><b>{props.item.name}</b></h1>
                    <p className='paragraph'>{props.item.description}</p>
                    <p className='price'>{props.item.price}</p>
                </Box>
                </CardBody>
                
                
            </Card>

        </Flex>
        
    );
}