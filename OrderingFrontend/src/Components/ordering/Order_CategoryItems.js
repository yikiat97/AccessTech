import React, { useContext, useEffect, useRef, useState } from 'react';
import { TabPanels, TabPanel, Image, Flex,  Box, Card, CardBody, Tabs, TabList, Tab, Checkbox, CheckboxGroup, Text} from '@chakra-ui/react'
import {imageMapping} from './dummydata/imagemapping'
import {Divider, useDisclosure, Modal, ModalOverlay,ModalContent, ModalHeader,ModalFooter,ModalBody,ModalCloseButton } from '@chakra-ui/react'
import MealItemForm from "./Order_MealItemForm";
import CartContext from "../ordering/Cart/cart-context";



function ItemDetails({ isOpen, onClose, itemName, desc, item_id, item_price, dish_type }) {
  const imageUrl = imageMapping[itemName];
  const cartCtx = useContext(CartContext);
  const price = item_price.toFixed(2);
  const closeButtonRef = useRef(null); 
  const [selectedSpecialRequests, setSelectedSpecialRequests] = useState([]);

  const addToCartHandler = (amount, specialRequests) => {
    
      cartCtx.addItem({
          id: item_id,
          name: itemName,
          amount: amount,
          price: price,
          specialRequests: selectedSpecialRequests,
          

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

  const isRiceItem = dish_type ==="RICE";
  const handleSpecialRequestChange = (selectedValues) => {
    setSelectedSpecialRequests(selectedValues);
  };
 

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
                      height="30vh"
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
                  <Divider mt="4" type="gray" />
                  {isRiceItem && ( 
                    <div style={{ display: "flex", flexDirection: "column", marginTop: "8px" }}> 
                        <Text fontWeight='bold' mt='5' fontSize='lg'>Special Instructions</Text>
                        <CheckboxGroup colorScheme="green" defaultValue={[]} onChange={handleSpecialRequestChange}>
                          <Checkbox size='lg' colorScheme='orange' value="Less Rice">Less Rice</Checkbox>
                          <Checkbox size='lg' colorScheme='orange' value="More Rendang Sauce">More Rendang Sauce</Checkbox>
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

    const qty = props.item.qty;
    if (qty === 0) {
      return null
    }
    
    return (
      <Card width="200px" mx="10px" my="20px" >
        <CardBody height="200px"onClick={handleCardClick}>
          <Image src={imageUrl} align="center" maxH="200px" fit />
          <Box>
            <h1 className="title">
              <b>{props.item.dish_name}</b>
            </h1>
            <p className="paragraph">{props.item.small_desc}</p>
            <p className="price">${props.item.price}</p>
          </Box>
        </CardBody>
        <ItemDetails isOpen={isOpen} onClose={onClose} itemName={props.item.dish_name} desc={props.item.description} item_id={props.item.dish_id} item_price={props.item.price} dish_type={props.item.dish_type} />
      </Card>
    );
  }
  
  async function fetchMenuItems() {
    try {
      const response = await fetch('http://127.0.0.1:5000/order/getAllDishes');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching menu items:', error);
      return [];
    }
  }
  function CategoryItems(props) {
    const [fetchedMenuItems, setFetchedMenuItems] = useState([]); 
    const [uniqueDishTypes, setUniqueDishTypes] = useState([]);

    useEffect(() => {
      fetchMenuItems().then(data => {
        setFetchedMenuItems(data);

        const dishTypes = [...new Set(data.map(item => item.dish_type))];
        setUniqueDishTypes(dishTypes);
      });
    }, []);

    
  
    return (
      <Flex flexWrap="wrap" justifyContent="center" alignItems="center" m="5">
        <Tabs align="center" variant="enclosed">
          <TabList style={{ position: 'sticky', top: 100, backgroundColor: 'white', zIndex: 1 }}>
            {uniqueDishTypes.map((dishType, index) => (
              <Tab key={index}>{dishType}</Tab>
            ))}
          </TabList>
          <TabPanels>
            {uniqueDishTypes.map((dishType, index) => (
              <TabPanel key={index}>
                <Flex justifyContent="center" flexWrap="wrap">
                  {fetchedMenuItems
                    .filter((item) => item.dish_type === dishType)
                    .map((item) => (
                      <MenuCards item={item} key={item.dish_id} />
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

  