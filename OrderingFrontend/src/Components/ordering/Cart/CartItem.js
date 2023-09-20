import React, { useState, useEffect }from "react";
import classes from "./css/CartItem.module.css";
import {IconButton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Checkbox, CheckboxGroup, Button } from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import { calculateUpdatedPrice } from './cart-utils';
import { fetchSpecialInstructions } from "../Order_CategoryItems";

const CartItem = (props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSpecialRequests, setEditedSpecialRequests] = useState(
    props.specialInstructions || []
  );
  const [specialInstructions, setSpecialInstructions] = useState([]);
  const [selectedValues, setSelectedValues] = useState(
    editedSpecialRequests.map((instruction) => instruction.special_comments),
    editedSpecialRequests.map((instruction) => instruction.special_comments_price)
  );

  
  const openEditModal = () => {
    setIsEditing(true);
    setSelectedValues(
      editedSpecialRequests.map((instruction) => instruction.special_comments)
    );
  };

  const closeEditModal = () => {
    setIsEditing(false);
  };
  
  const saveEditHandler = () => {

    const updatedSpecialRequests = specialInstructions.filter((instruction) =>
      selectedValues.includes(instruction.special_comments)
    );
    const updatedPrice = calculateUpdatedPrice(props.cartItems, props.unique_id, updatedSpecialRequests);
    props.onEdit({ cartItems: props.cartItems, updatedSpecialRequests, updatedPrice });
    setEditedSpecialRequests(updatedSpecialRequests);
  
    closeEditModal();
  };
  
    
  const checkboxChangeHandler = (values) => {
    setSelectedValues(values);
  };

  useEffect(() => {
    fetchSpecialInstructions(props.dish_id).then((data) => {
      setSpecialInstructions(data);
    });
  }, [props.dish_id]);
  
  return (
    <li className={classes["cart-item"]}>
      <div className={classes.actions}>
        <button onClick={props.onRemove}>−</button>
        <button onClick={props.onAdd}>+</button>
        <IconButton icon={<EditIcon />} onClick={openEditModal} aria-label="Edit Special Instructions" />
      </div>
      <div>
        <h2>{props.name}</h2>
        <div className={classes.summary}>
        <div className={classes.specialInstructions}>
          <span className={classes.price}>${props.price}</span>
          <span className={classes.amount}>x {props.amount}</span>
            {editedSpecialRequests.length > 0 && (
             <div className={classes.instructions}>
             {Array.from(new Set(editedSpecialRequests.map((request) => request.special_comments))).map((uniqueItem, index) => (
               <div key={index}>
                 <ul>
                   {editedSpecialRequests
                     .filter((request) => request.special_comments === uniqueItem)
                     .map((request, subIndex) => (
                       <li key={subIndex}>
                         {request.special_comments} (${request.special_comments_price})
                       </li>
                     ))}
                 </ul>
               </div>
             ))}
           </div>
         )}
          </div>
      
        </div>
      </div>
      <Modal isOpen={isEditing} onClose={closeEditModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Special Instructions</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div style={{ display: "flex", flexDirection: "column", marginTop: "8px" }}> 
            <CheckboxGroup
                colorScheme="green"
                defaultValue={editedSpecialRequests.map((instruction) => instruction.special_comments)}
                onChange={checkboxChangeHandler}
              >
                {specialInstructions.map((instruction) => (
                  <Checkbox
                    key={instruction.special_comments_id}
                    colorScheme="orange"
                    value={instruction.special_comments}
                  >
                    {instruction.special_comments} (${instruction.special_comments_price})
                  </Checkbox>
                ))}
              </CheckboxGroup>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button  onClick={closeEditModal}>
              Cancel
            </Button>
            <Button marginLeft='5' colorScheme='green' onClick={saveEditHandler}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </li>
  );
};

export default CartItem;
