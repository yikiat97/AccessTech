import React from 'react';
import '../admin/css/customer.css'; 
import { Box, Image, Stack, Heading, Text, Button, Card, CardBody, CardFooter, useNumberInput } from '@chakra-ui/react';
import food from '../../assets/foodImage/afri.jpg'
import { NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, HStack, Input, InputGroup, InputLeftElement, InputLeftAddon, InputRightElement } from '@chakra-ui/react';
import { IconButton } from '@chakra-ui/react';
import { FaTimes } from 'react-icons/fa';

function HookUsage() {
  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
    useNumberInput({
      step: 1,
      defaultValue: 1,
      min: 1,
      max: 10,
      precision: 0,
    })

  const inc = getIncrementButtonProps()
  const dec = getDecrementButtonProps()
  const input = getInputProps()

  return (
    <HStack maxW='320px'>
        <InputGroup width="100px">
            <InputLeftElement>
                <Button variant="outline" {...dec}>-</Button>
            </InputLeftElement>
            <Input mx="auto" {...input} />
            <InputRightElement>
                <Button variant="outline" {...inc}>+</Button>
            </InputRightElement>
        
        </InputGroup>
     </HStack>
  )
}

export default function CartItem(){
    return(
        <Card
            direction={{ base: 'column', sm: 'row' }}
            overflow='hidden'
            variant='outline'
            >
            <Image
                objectFit='cover'
                maxW={{ base: '100%', sm: '200px' }}
                src={food}
                alt='Caffe Latte'
            />

            <Stack spacing={4}>
                <CardBody>
     
                <Heading display="flex" alignItems="center" size='md'>DishName
                
                <IconButton mx='50' color="red" variant="ghost" className="removecartitem" aria-label='removecartitem' icon={<FaTimes /> }  />
                </Heading>
                    


                </CardBody>

                <CardFooter>
                <Box display="flex" >
                    <HookUsage ></HookUsage>
                </Box>
                
                </CardFooter>
            </Stack>
        </Card>
    );
}