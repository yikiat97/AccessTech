import React from "react";

const CartContext = React.createContext({
  items: [],
  totalAmount: 0,
  addItem: (item) => {},
  removeItem: (unique_id) => {},
  clearAll: () => {},
  updateSpecialInstructions: (unique_id, specialInstructions, updatedPrice) => {}, 
  
});

export default CartContext;
