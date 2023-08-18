import React from 'react';
import { TabPanels, TabPanel, Image, Flex,  Box, Card, CardBody, Tabs, TabList, Tab} from '@chakra-ui/react'
import { menuList } from './data/menulist'
import {imageMapping} from './data/imagemapping'
import {Divider, Button, useDisclosure, Modal, ModalOverlay,ModalContent, ModalHeader,ModalFooter,ModalBody,ModalCloseButton,} from '@chakra-ui/react'

function ItemDetails({ isOpen, onClose, itemName, desc}) {
    const imageUrl = imageMapping[itemName];

    return (
      <>
        <Modal isOpen={isOpen} onClose={onClose} size="full">
          <ModalOverlay />
          <ModalContent margin={0} rounded="none" position="fixed">
            <ModalHeader>
                <Image src={imageUrl} align="center" borderRadius="8px" boxShadow="lg" height="40vh" width="100%" mb="4" mt="5" objectFit="cover" />
                {itemName}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                {desc}
                <Divider mt="4" type="gray"></Divider>    
            </ModalBody>
  
            <ModalFooter>
             
            <Flex justifyContent="center" alignItems="center"width="100%">

                <Button size='lg' colorScheme='blue'>Add to Cart</Button>
            </Flex>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
  }

  function MenuCards(props) {
    const imageUrl = imageMapping[props.item.name];
    const { isOpen, onOpen, onClose } = useDisclosure();
    const handleCardClick = () => {
      onOpen();
    };
    return (
      <Card width="200px" mx="10px" my="20px" >
        <CardBody height="200px"onClick={handleCardClick}>
          <Image src={imageUrl} align="center" maxH="200px" fit />
          <Box>
            <h1 className="title">
              <b>{props.item.name}</b>
            </h1>
            <p className="paragraph">{props.item.description}</p>
            <p className="price">{props.item.price}</p>
          </Box>
        </CardBody>
        <ItemDetails isOpen={isOpen} onClose={onClose} itemName={props.item.name} desc={props.item.description2}/>
      </Card>
    );
  }
  
  function CategoryItems(props) {
    const itemsPerRow = 2; // Number of items per row
  
    return (
      <Flex flexWrap="wrap" justifyContent="center" alignItems="center" m="5">
        <Tabs align="center" variant="enclosed">
          <TabList style={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1 }}>
            {props.uniqueCategory.map((item, index) => (
              <Tab key={index}>{item}</Tab>
            ))}
          </TabList>
          <TabPanels>
            {props.uniqueCategory.map((category, index) => (
              <TabPanel key={index}>
                <Flex justifyContent="center" flexWrap="wrap">
                  {menuList.items
                    .filter((item) => item.category === category)
                    .map((item, index) => (
                      <MenuCards item={item} key={item.name} />
                    ))}
                </Flex>
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </Flex>
    );
  }
  
  export default CategoryItems;