
import React, { useState } from 'react';
import { Tabs, TabList, Tab, TabPanels, TabPanel, Box, IconButton, VStack } from "@chakra-ui/react";
import { AddIcon, EditIcon } from '@chakra-ui/icons'; // Equivalent icons in Chakra
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button
  } from '@chakra-ui/react'
import { useDisclosure } from '@chakra-ui/react';
function AdminTransactionDetailsModal() {


    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
      <>
        <Button onClick={onOpen}>Open Modal</Button>
  
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Modal Title</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
            </ModalBody>
  
            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={onClose}>
                Close
              </Button>
              <Button variant='ghost'>Secondary Action</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
}

export default AdminTransactionDetailsModal;