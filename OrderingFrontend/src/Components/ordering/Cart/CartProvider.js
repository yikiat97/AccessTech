import React from "react";
import { useReducer } from "react";
import CartContext from "./cart-context";

const defaultCartState = {
  items: [],
  totalAmount: 0,
};

const cartReducer = (state, action) => {

  if (action.type === "ADD") {
      const updatedTotalAmount = parseFloat(state.totalAmount) + parseFloat(action.item.price) * parseFloat(action.item.amount);
  
    const existingCartItemIndex = state.items.findIndex(
      (item) => item.unique_id === action.unique_id
    );
    const existingCartItem = state.items[existingCartItemIndex];
    let updatedItems;
  
    if (existingCartItem) {
      const updatedItem = {
        ...existingCartItem,
        amount: existingCartItem.amount + action.item.amount,
      };
      updatedItems = [...state.items];
      updatedItems[existingCartItemIndex] = updatedItem;
    } else {
      updatedItems = state.items.concat(action.item);
    }
  
    return {
      items: updatedItems,
      totalAmount: updatedTotalAmount,
    };
  }
  
  if (action.type === "UPDATE_SPECIAL_INSTRUCTIONS") {
    const updatedItems = state.items.map((item) => {
      if (item.unique_id === action.unique_id) {
        // Update the specialInstructions and price for the specific item
        const updatedItem = {
          ...item,
          specialInstructions: action.specialInstructions,
          price: action.updatedPrice,
        };
        return updatedItem;
      }
      return item;
    });
  
    // Calculate the new totalAmount
    let newTotalAmount = 0;
    updatedItems.forEach((item) => {
      newTotalAmount += item.price * item.amount;
    });
  
    const newState = {
      ...state,
      items: updatedItems,
      totalAmount: newTotalAmount.toFixed(2),
    };
  
    return newState;
  }
  

  if (action.type === "REMOVE") {
    const existingCartItemIndex = state.items.findIndex(
      (item) => item.unique_id === action.unique_id
    );
    const existingItem = state.items[existingCartItemIndex];
    const updatedTotalAmount = state.totalAmount - existingItem.price;
    let updatedItems;
    if (existingItem.amount === 1) {
      updatedItems = state.items.filter((item) => item.unique_id !== action.unique_id);
    } else {
      const updatedItem = { ...existingItem, amount: existingItem.amount - 1 };
      updatedItems = [...state.items];
      updatedItems[existingCartItemIndex] = updatedItem;
    }

    return {
      items: updatedItems,
      totalAmount: updatedTotalAmount,
    };
  }

  if (action.type === "ADD_WITH_OPTIONS") {
    const updatedTotalAmount = parseFloat(state.totalAmount) + parseFloat(action.item.price) * parseFloat(action.item.amount);
  
    const updatedItem = {
      ...action.item,
      specialInstructions: action.specialInstructions,
      unique_id: action.id
    };
  
    const updatedItems = [...state.items, updatedItem];
  
    return {
      items: updatedItems,
      totalAmount: updatedTotalAmount,
    };
  }
  


  if (action.type === "CLEARALL") {
    return {
      items: [],
      totalAmount: 0,
    };
  }

  return defaultCartState;
};

export const CartProvider = (props) => {
  const [cartState, dispatchCartAction] = useReducer(
    cartReducer,
    defaultCartState
  );

  const addItemToCartHandler = (item, specialInstructions) => {
    const unique_id = item.unique_id; // assuming unique_id is a property of item
    if (specialInstructions && specialInstructions.length > 0) {
      dispatchCartAction({ 
        type: "ADD_WITH_OPTIONS", 
        item: item, 
        specialInstructions: specialInstructions,
        unique_id: unique_id // include unique_id in the action object
      });
    } else {
      dispatchCartAction({ 
        type: "ADD", 
        item: item,
        unique_id: unique_id  // include unique_id in the action object
      });
  }
};

  const removeItemFromCartHandler = (unique_id) => {
    dispatchCartAction({ type: "REMOVE", unique_id: unique_id });
  };

  const clearAllItemsFromCartHandler = () => {
    dispatchCartAction({ type: "CLEARALL" });
  };

  const updateSpecialInstructionsHandler = (unique_id, specialInstructions, updatedPrice) => {
    dispatchCartAction({
      type: "UPDATE_SPECIAL_INSTRUCTIONS",
      unique_id: unique_id,
      specialInstructions: specialInstructions,
      updatedPrice: updatedPrice, 
    });
  };

  const cartContext = {
    items: cartState.items,
    totalAmount: cartState.totalAmount,
    addItem: addItemToCartHandler,
    removeItem: removeItemFromCartHandler,
    clearAll: clearAllItemsFromCartHandler,
    updateSpecialInstructions: updateSpecialInstructionsHandler, 
  
    
  };

  return (
    <CartContext.Provider value={cartContext}>
      {props.children}
    </CartContext.Provider>
  );
};

export default CartProvider;