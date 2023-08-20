import React, { useContext, useEffect, useRef } from 'react';
import css from './css/customer.css'
import { TabPanels, TabPanel, Image, Flex,  Box, Card, CardBody, Tabs, TabList, Tab} from '@chakra-ui/react'
import { menuList } from './data/menulist'
import {imageMapping} from './data/imagemapping'
import {Divider, useDisclosure, Modal, ModalOverlay,ModalContent, ModalHeader,ModalFooter,ModalBody,ModalCloseButton } from '@chakra-ui/react'
import MealItemForm from "./Order_MealItemForm";
import CartContext from "../ordering/Cart/cart-context";

function ItemDetails({ isOpen, onClose, itemName, desc, item_id, item_price }) {
  const imageUrl = imageMapping[itemName];
  const cartCtx = useContext(CartContext);
  const price = item_price.toFixed(2);
  const closeButtonRef = useRef(null); 

  const addToCartHandler = (amount) => {
      cartCtx.addItem({
          id: item_id,
          name: itemName,
          amount: amount,
          price: price,
      });

      onClose();
  };

  useEffect(() => {
      if (isOpen) {
          document.body.style.overflow = 'hidden';
      } else {
          document.body.style.overflow = '';
      }
  }, [isOpen]);

  return (
      <Modal isOpen={isOpen} onClose={onClose} size="full" initialFocusRef={closeButtonRef}>
          <ModalOverlay />
          <ModalContent margin={0} rounded="none" position="fixed">
              <ModalHeader>
                  <Image
                      src={imageUrl}
                      align="center"
                      borderRadius="8px"
                      boxShadow="lg"
                      height="40vh"
                      width="100%"
                      mb="4"
                      mt="5"
                      objectFit="cover"
                  />
                  {itemName}
              </ModalHeader>
              <ModalCloseButton ref={closeButtonRef} />
              <ModalBody>
                  {desc}
                  <Divider mt="4" type="gray"></Divider>
              </ModalBody>

              <ModalFooter>
                  <Flex justifyContent="center" alignItems="center" width="100%">
                      <MealItemForm
                          id={item_id}
                          onAddToCart={addToCartHandler}
                          closeModal={onClose}
                      />
                  </Flex>
              </ModalFooter>
          </ModalContent>
      </Modal>
  );
}




  function MenuCards(props) {
    const imageUrl = imageMapping[props.item.dish_name];
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
              <b>{props.item.dish_name}</b>
            </h1>
            <p className="paragraph">{props.item.small_desc}</p>
            <p className="price">${props.item.price}0</p>
          </Box>
        </CardBody>
        <ItemDetails isOpen={isOpen} onClose={onClose} itemName={props.item.dish_name} desc={props.item.description} item_id={props.item.id} item_price={props.item.price} />
      </Card>
    );
  }
  
  function CategoryItems(props) {
    const itemsPerRow = 2; 
  
    return (
      <Flex flexWrap="wrap" justifyContent="center" alignItems="center" m="5">
        <Tabs align="center" variant="enclosed">
          <TabList style={{ position: 'sticky', top: 100, backgroundColor: 'white', zIndex: 1 }}>
            {props.uniqueCategory.map((item, index) => (
              <Tab key={index}>{item}</Tab>
            ))}
          </TabList>
          <TabPanels>
            {props.uniqueCategory.map((category, index) => (
              <TabPanel key={index}>
                <Flex justifyContent="center" flexWrap="wrap">
                  {menuList.items
                    .filter((item) => item.dish_type === category)
                    .map((item, index) => (
                      <MenuCards item={item} key={item.id} />
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