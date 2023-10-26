import React, { useState, useEffect } from 'react';
import SideNavBar from '../../Components/admin/SideNavBar';
import ColorPicker from '../../Components/ColorPicker'
import {Box,
    Heading,
    Divider,
    Flex,
    Switch,
    FormControl,
    FormLabel,
    Spacer,
    useColorMode,
    useColorModeValue,
    Button } from '@chakra-ui/react';
import { useCustomisation } from '../../Components/CustomisationContext';

function ColorModeToggle() {
    const { colorMode, toggleColorMode } = useColorMode();

    const isChecked = colorMode ==='dark';
        
    return (
        <Switch size="lg" onChange={toggleColorMode} isChecked={isChecked} >
        </Switch>
    );
    }

export default function Admin_customisation() {
    const { buttonSize, setButtonSize, fontSize, setFontSize, fontColor, setFontColor, serveButtonColor, setServeButtonColor, cancelButtonColor, setCancelButtonColor } = useCustomisation();
    
    const toggleButtonSize = () => {
        const newSize = buttonSize === 'lg' ? 'xl' : 'lg';
        setButtonSize(newSize);
    };

    const toggleFontSize = () => {
        const newSize = fontSize === '2xl' ? '4xl' : '2xl';
        setFontSize(newSize);
    };

    const handleFontColorChange = (newColor) => {
        setFontColor(newColor);
    };

    const handleServeColorChange = (newColor) => {
        setServeButtonColor(newColor);
      };

    const handleCancelColorChange = (newColor) => {
        setCancelButtonColor(newColor);
      };

    const bgColor = useColorModeValue('gray.200', 'gray.700');
    const textColor = useColorModeValue('black', 'white');

    const Customisation = () => {
        return(
            <Flex direction="row" width="100%">
            {/* Colors Section */}
            <Box
                flex="1"
                p={6}
                bg={bgColor}
                color={textColor}
                borderRadius="md"
                borderRightWidth="0.5px"
                borderColor="gray.800"
                >
                <Heading size="lg" mb={4} >Colors</Heading>
                <Flex p={5} direction="row" mb={4} alignItems="center">
                    <Heading size="md">Dark Mode</Heading>
                    <Spacer />
                    <ColorModeToggle />
                </Flex>
                <Divider borderColor="gray"/>
                <Flex p={5} direction="row" mb={4} alignItems="center">
                    <Heading size="md">Serve Button</Heading>
                    <Spacer />
                    <ColorPicker value={serveButtonColor} onChange={handleServeColorChange}></ColorPicker>
                </Flex>
                <Divider borderColor="gray"/>
                <Flex p={5} direction="row" mb={4} alignItems="center">
                    <Heading size="md">Cancel Button</Heading>
                    <Spacer />
                    <ColorPicker value={cancelButtonColor} onChange={handleCancelColorChange}></ColorPicker>
                </Flex>
                <Divider borderColor="gray"/>
                <Flex p={5} direction="row" mb={4} alignItems="center">
                    <Heading size="md">Fonts</Heading>
                    <Spacer />
                    <ColorPicker value ={fontColor} onChange={handleFontColorChange}></ColorPicker>
                </Flex>
                
                
            </Box>
                    
            {/* Sizes Section */}
            <Box
                flex="1"
                p={6}
                bg={bgColor}
                color={textColor}
                borderRadius="md"
                borderColor="gray.200"
                 >
                <Heading size="lg" mb={4} textAlign="center">Sizes</Heading>
                    <Flex p={5}direction="row" mb={4} alignItems="center" >            
                        <Heading size="md">Fonts</Heading>    
                            <Spacer/>
                            <Box border="1px solid" borderColor="gray.200" borderRadius="md" padding="6px 12px" ml={3} mr={3} mt={3} fontSize={"lg"}> L </Box>
                            <Switch mt={5} size="lg" isChecked={fontSize === '4xl'} onChange={toggleFontSize} />
                            <Box border="1px solid" borderColor="gray.200" borderRadius="md" padding="6px 12px" ml={3} mr={3} mt={3} fontSize={"lg"}> XL </Box>                           
                    </Flex>
                    <Divider borderColor="gray"/>
                    <Flex p={5} direction="row" mb={4} alignItems="center" >            
                        <Heading size="md">Buttons</Heading>    
                            <Spacer/>
                            <Box border="1px solid" borderColor="gray.200" borderRadius="md" padding="6px 12px" ml={3} mr={3} mt={3} fontSize={"lg"}> L </Box>
                            <Switch mt={5} size="lg" isChecked={buttonSize === 'xl'} onChange={toggleButtonSize} />
                            <Box border="1px solid" borderColor="gray.200" borderRadius="md" padding="6px 12px" ml={3} mr={3} mt={3} fontSize={"lg"}> XL </Box>                           
                    </Flex>
                    
               
            </Box>
        </Flex>
        );
    }

    return (

        <Box p={4} bg={bgColor} boxShadow="xl" borderRadius="lg">
      <SideNavBar children={<Customisation />} />
    </Box>
   
    );

}