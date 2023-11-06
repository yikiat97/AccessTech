import React, { useContext, useEffect, useRef, useState } from 'react';
import { TabPanels, TabPanel, Image, Flex,  Box, Card, CardBody, Tabs, TabList, Tab, Checkbox, CheckboxGroup, Text} from '@chakra-ui/react'
import {Divider, useDisclosure, Modal, ModalOverlay,ModalContent, ModalHeader,ModalFooter,ModalBody,ModalCloseButton } from '@chakra-ui/react'
import MealItemForm from "./Order_MealItemForm";
import CartContext from "./Cart/cart-context";
import { SHA256 } from 'crypto-js';


async function fetchMenuItems(userType) {
  const url = userType === 'student' 
    ? process.env.REACT_APP_API_URL+'/order/getStudentDishes' 
    : process.env.REACT_APP_API_URL+'/order/getPublicDishes';
    
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(process.env.REACT_APP_API_URL)
    console.log(data)
    return data;
  } catch (error) {
    console.log(process.env.REACT_APP_API_URL)
    console.error('Error fetching menu items:', error);
    return [];
  }
}


export async function fetchSpecialInstructions(item_id) {
  try {
    const response = await fetch(process.env.REACT_APP_API_URL+`/order/get_special_comments/${item_id}`);
    const data = await response.json();
    return  data;
  } catch (error) {
    console.error('Error fetching special instructions:', error);
    return [];
}
}


function ItemDetails({ isOpen, onClose, itemName, desc, item_id, item_price, imageURL, qty}) {
  const cartCtx = useContext(CartContext);
  const price = item_price;
  const closeButtonRef = useRef(null); 
  const [selectedSpecialRequests, setSelectedSpecialRequests] = useState([]);
  const [specialInstructions, setSpecialInstructions] = useState([]);

  const addToCartHandler = (amount) => {
    const specialCommentsPrices = selectedSpecialRequests.map(
      (menuItem) => menuItem.special_comments_price
    );

    const totalSpecialCommentsPrice = specialCommentsPrices.reduce(
      (total, price) => total + price,
      0
    );
    const updatedPrice = parseFloat(price) + totalSpecialCommentsPrice;

    const specialRequestsString = selectedSpecialRequests
    .map((menuItem) => menuItem.special_comments)
    .sort()
    .join('|');

    const uniqueKey = SHA256(`${item_id}|${specialRequestsString}`).toString();


    const existingCartItemIndex = cartCtx.items.findIndex(
      (cartItem) => cartItem.uniqueKey === uniqueKey
    );



    if (existingCartItemIndex !== -1) {
      const existingItem = cartCtx.items[existingCartItemIndex];
      cartCtx.addItem({
        ...existingItem,
        amount: existingItem.amount + amount,
      });
    } else {
      cartCtx.addItem({
        unique_id: uniqueKey,
        dish_id: item_id,
        name: itemName,
        amount: amount,
        price: updatedPrice,
        specialInstructions: selectedSpecialRequests,
        max_quantity: qty,
      });
      }
    } 
  

  useEffect(() => {
      if (isOpen) {
          document.body.style.overflow = 'hidden';
      } else {
          document.body.style.overflow = '';
      }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      fetchSpecialInstructions(item_id).then((data) => {
        setSpecialInstructions(data);
      });
    }
  }, [isOpen, item_id]);

  const handleSpecialRequestChange = (selectedValues) => {
    const selectedInstructions = specialInstructions.filter((instruction) =>
    selectedValues.includes(instruction.special_comments)
  );
    setSelectedSpecialRequests(selectedInstructions);
  };
 
  
  return (
      <Modal isOpen={isOpen} onClose={onClose} size={["full"]} initialFocusRef={closeButtonRef}>
          <ModalOverlay />
          <ModalContent margin={0} rounded="none" position="fixed">
                  <Image
                      src={imageURL}
                      align="center"
                      borderRadius="8px"
                      boxShadow="md"
                      height="150"
                      width="100%"
                      mb="2%"
                      mt="-4%"
                      objectFit="cover"
                  />
              <ModalHeader mb='3%'>
                  <Text fontSize='md'>{itemName}</Text>
              </ModalHeader>
              <ModalCloseButton ref={closeButtonRef} />
              <ModalBody  mt='-5%' overflowY="auto" maxH="200">
                  <Text fontSize='xs'>{desc}</Text>
                  <Divider mt="4" type="gray" />
                  {specialInstructions.length > 0 && (
                      <div style={{ display: "flex", flexDirection: "column", marginTop: "8px" }}>
                        <Text fontWeight="bold" mt="1" fontSize="md">
                          Special Instructions
                        </Text>
                        <CheckboxGroup
                          colorScheme="green"
                          value={selectedSpecialRequests.map((instruction) => instruction.special_comments)}
                          onChange={handleSpecialRequestChange}
                        >
                          {specialInstructions.map((instruction) => (
                            <Checkbox
                              key={instruction.special_comments_id}
                              colorScheme="orange"
                              value={instruction.special_comments}
                              fontSize="xs"
                            >
                              <Text fontSize='md'>
                              {instruction.special_comments} (${instruction.special_comments_price})
                              </Text>
                            </Checkbox>
                          ))}
                              </CheckboxGroup>
                        </div>
                    )}
        
              </ModalBody>

              <ModalFooter>
                  <Flex justifyContent="center" alignItems="center" width="100%">
                      <MealItemForm
                          id={item_id}
                          onAddToCart={addToCartHandler}
                          closeModal={onClose}
                          qty={qty}
                      />
                  </Flex>
              </ModalFooter>
          </ModalContent>
      </Modal>
  );
}




  function MenuCards(props) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const handleCardClick = () => {
      onOpen();
    };

    const qty = props.item.qty;
    const isSoldOut = qty === 0;

    
    
    return (
      <Card width="200px" mx="10px" my="20px" style={{ opacity: isSoldOut ? 0.5 : 1 }} >
        <CardBody height="200px"onClick={handleCardClick} style={{ pointerEvents: isSoldOut ? 'none' : 'auto' }}>
          <Image src={props.item.image_url} align="center" maxH="200px" cover />
          <Box>
            <h1 className="title">
              <Text fontSize='m' fontWeight='bold'>{props.item.dish_name}</Text>
            </h1>
            <Text mt='1rem' fontSize='xs'>{props.item.small_desc}</Text>
            <Text mt='1rem' color='green'>${props.item.price.toFixed(2)}</Text>
            {isSoldOut && <Text fontWeight="bold" color='red'>Sold Out</Text>}
          </Box>
        </CardBody>
        <ItemDetails isOpen={isOpen} onClose={onClose} imageURL={props.item.image_url} itemName={props.item.dish_name} desc={props.item.description} item_id={props.item.dish_id} item_price={props.item.price} dish_type={props.item.dish_type} qty={qty} />
      </Card>
    );
  }
  
  
  function CategoryItems(props) {
    const [fetchedMenuItems, setFetchedMenuItems] = useState([]); 
    const [uniqueDishTypes, setUniqueDishTypes] = useState([]);

    useEffect(() => {
      fetchMenuItems(props.userType).then(data => {
        setFetchedMenuItems(data);

        const dishTypes = [...new Set(data.map(item => item.dish_type))];
        setUniqueDishTypes(dishTypes);
      });
    }, []);

    
  
    return (
      <Flex flexWrap="wrap" justifyContent="center" alignItems="center" m="5" mb="200px">
        <Tabs align="center" variant="enclosed">
          <TabList style={{ position: 'sticky', top: 100, backgroundColor: 'white', zIndex: 1 }}>
          {Array.isArray(uniqueDishTypes) && uniqueDishTypes.map((dishType, index) => (
              <Tab key={index}>{dishType}</Tab>
            ))}
          </TabList>
          <TabPanels>
          {Array.isArray(uniqueDishTypes) && uniqueDishTypes.map((dishType, index) => (
              <TabPanel key={index}>
                <Flex justifyContent="center" flexWrap="wrap">
                {Array.isArray(fetchedMenuItems) && fetchedMenuItems
                    .filter((item) => item.dish_type === dishType)
                    .map((item) => (
                      <MenuCards item={item} key={item.dish_id} item_id={item.dish_id} />
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
  