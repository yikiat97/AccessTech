import React, { useContext } from "react";
import { useReducer } from "react";
import CartContext from "./cart-context";

const defaultCartState = {
  items: [],
  totalAmount: 0,
};

const cartReducer = (state, action) => {
  if (action.type === "ADD") {
    const updatedTotalAmount =
      state.totalAmount + action.item.price * action.item.amount;

    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.item.id
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

  if (action.type === "REMOVE") {
    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.id
    );
    const existingItem = state.items[existingCartItemIndex];
    const updatedTotalAmount = state.totalAmount - existingItem.price;
    let updatedItems;
    if (existingItem.amount === 1) {
      updatedItems = state.items.filter((item) => item.id !== action.id);
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
  if (action.type === "UPDATE_SPECIAL_INSTRUCTIONS") {
    const updatedItems = state.items.map((item) => {
      if (item.id === action.id) {
        return {
          ...item,
          specialInstructions: action.specialInstructions,
        };
      }
      return item;
    });

    return {
      ...state,
      items: updatedItems,
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

  const addItemToCartHandler = (item, specialRequests) => {
    if (specialRequests && specialRequests.length > 0 && item.dish_type === "RICE") {
      dispatchCartAction({ type: "ADD_WITH_OPTIONS", item: item, specialRequests: specialRequests });
    } else {
      dispatchCartAction({ type: "ADD", item: item });
    }
  };

  const removeItemFromCartHandler = (id) => {
    dispatchCartAction({ type: "REMOVE", id: id });
  };

  const clearAllItemsFromCartHandler = () => {
    dispatchCartAction({ type: "CLEARALL" });
  };

  const updateSpecialInstructionsHandler = (id, specialInstructions) => {
    dispatchCartAction({
      type: "UPDATE_SPECIAL_INSTRUCTIONS",
      id: id,
      specialInstructions: specialInstructions,
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
