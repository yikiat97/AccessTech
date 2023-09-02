import React, { useState } from "react";
import classes from "./css/CartItem.module.css";
import { IconButton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Checkbox, CheckboxGroup, Button } from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";

const CartItem = (props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSpecialRequests, setEditedSpecialRequests] = useState(props.specialRequests || []);
  const openEditModal = () => {
    setIsEditing(true);
  };

  const closeEditModal = () => {
    setIsEditing(false);
  };

  const saveEditHandler = () => {
    props.onEdit(editedSpecialRequests);
    closeEditModal();
  };

  const checkboxChangeHandler = (selectedValues) => {
    setEditedSpecialRequests(selectedValues);
  };

  return (
    <li className={classes["cart-item"]}>
      <div>
        <h2>{props.name}</h2>
        <div className={classes.summary}>
        <div className={classes.specialInstructions}>
          <span className={classes.price}>{props.price}</span>
          <span className={classes.amount}>x {props.amount}</span>
            {editedSpecialRequests.length > 0 && (
              <p className={classes.specialRequestText}>
                {editedSpecialRequests.join(", ")}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className={classes.actions}>
        <button onClick={props.onRemove}>−</button>
        <button onClick={props.onAdd}>+</button>
        <IconButton icon={<EditIcon />} onClick={openEditModal} aria-label="Edit Special Instructions" />
      </div>
      <Modal isOpen={isEditing} onClose={closeEditModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Special Instructions</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div style={{ display: "flex", flexDirection: "column", marginTop: "8px" }}> 
            <CheckboxGroup colorScheme="green" defaultValue={editedSpecialRequests} onChange={checkboxChangeHandler}>
              <Checkbox size="lg" colorScheme="orange" value="Less Rice">
                Less Rice
              </Checkbox>
              <Checkbox size="lg" colorScheme="orange" value="More Rendang Sauce">
                More Rendang Sauce
              </Checkbox>
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
