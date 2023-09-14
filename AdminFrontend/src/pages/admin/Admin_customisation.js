import React, { useState } from 'react';
import SideNavBar from '../../Components/admin/SideNavBar';
import ColorPicker from '../../Components/admin/ColorPicker'
import {Box,
    Heading,
    Divider,
    Flex,
    Switch,
    FormControl,
    FormLabel,
    Spacer,
    Button } from '@chakra-ui/react'
export default function Admin_customisation() {

    const Customisation = () => {
        return(
            <Flex direction="row" width="100%">
            {/* Colors Section */}
            <Box flex="1" p={6} borderRightWidth="1px" borderColor="gray.200">
                <Heading size="lg" mb={0}>Colors</Heading>
                {['Fonts', 'Serve Button', 'Cancel Button'].map((label) => (
                    <Flex key={label} direction="row" mb={4} alignItems="center">
                    <Heading size="md">{label}</Heading>
                    <Spacer />
                    <ColorPicker />
                    </Flex>
                ))}
                <Heading size="md" mt={8} >Colour-Coded Orders</Heading>
                <Flex justifyContent="center" alignItems="center">
                    {Array(4).fill(null).map((_, index) => (
                        <Box key={index} mr={4} ml={4}>
                            <ColorPicker />
                        </Box>
                    ))}
                </Flex>
            </Box>
    
            {/* Sizes Section */}
            <Box flex="1" p={6}>
                <Heading size="lg" mb={4} textAlign="center">Sizes</Heading>
                <Flex direction="column" alignItems="center">
                    {['Fonts', 'Buttons'].map((label) => (
                    <Flex key={label} direction="row" mb={4} justifyContent="center" alignItems="center" w="100%">
                        <Box flex="1" textAlign="center">
                        <Heading size="md">{label}</Heading>
                        </Box>
                        <Box flex="1" textAlign="center">
                        <FormControl display="flex" alignItems="center" justifyContent="center">
                            <Box border="1px solid" borderColor="gray.200" borderRadius="md" padding="6px 12px" ml={3} mr={3} fontSize={"lg"}> L </Box>
                            <Switch size="lg" />
                            <Box border="1px solid" borderColor="gray.200" borderRadius="md" padding="6px 12px" ml={3} mr={3} fontSize={"lg"}> XL </Box>
                        </FormControl>
                        </Box>
                    </Flex>
                    ))}
                </Flex>
            </Box>
        </Flex>
        );
    }

    return (
        <Box>
            <SideNavBar children={<Customisation/>}></SideNavBar>
        </Box>
    );

}