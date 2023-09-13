import { useContext, useState } from "react";
import { Link } from 'react-router-dom';
import { Input, Text, Flex } from '@chakra-ui/react';
import Modal from "./CartModal";
import classes from "./css/Cart.module.css";
import CartItem from "./CartItem";
import CartContext from "./cart-context";
import { calculateUpdatedPrice } from './cart-utils';


const Cart = (props) => {
  const cartCtx = useContext(CartContext);
  const [editedSpecialInstructions, setEditedSpecialInstructions] = useState({});

  const [voucherCode, setVoucherCode] = useState(""); 
  const [isVoucherValid, setIsVoucherValid] = useState(null);

  const hasItems = Array.isArray(cartCtx.items) && cartCtx.items.length > 0;
  const totalAmount = hasItems ? `$${Number(cartCtx.totalAmount).toFixed(2)}` : '$0.00';


  const cartItemRemoveHandler = (unique_id) => {
    cartCtx.removeItem(unique_id);
  };

  const cartItemAddHandler = (item) => {
    cartCtx.addItem({ ...item, amount: 1 });
  };

  
  const orderHandler = () => {
    cartCtx.clearAll();
    
  };
  
  const cartItemEditHandler = (unique_id, specialInstructions) => {
    const updatedPrice = calculateUpdatedPrice(cartCtx.items, unique_id, specialInstructions);
    cartCtx.updateSpecialInstructions(unique_id, specialInstructions, updatedPrice);
    setEditedSpecialInstructions({ unique_id, specialInstructions });
  };
  
   
  const voucherCodeChangeHandler = (event) => {
    const newVoucherCode = event.target.value;
    setVoucherCode(newVoucherCode);
    
    // Checking voucher validity
    if (newVoucherCode === "AAAAAA") {
      setIsVoucherValid(true);
    } else if (newVoucherCode === "BBBBBB") {
      setIsVoucherValid(false);
    } else {
      setIsVoucherValid(false);
    }
  };

  const cartItems = (
    <ul className={classes["cart-items"]}>
    {cartCtx.items.map((item) => (
      <li key={item.unique_id}>
        <CartItem
          name={<strong>{item.name}</strong>}
          amount={item.amount}
          price={`${item.price}0`}
          cartItems={cartCtx.items}
          dish_id={item.dish_id}
          unique_id={item.unique_id}
          onRemove={cartItemRemoveHandler.bind(null, item.unique_id)}
          onAdd={cartItemAddHandler.bind(null, item)}
          onEdit={(updateInfo) => cartItemEditHandler(item.unique_id, updateInfo.updatedSpecialRequests, updateInfo.updatedPrice)}
          specialInstructions={item.specialInstructions} 

        />      
      </li>
    ))}
  </ul>
);

  return (
    <Modal title="Your Cart" onClose={props.onClose}>
      { 
        <>
          {cartItems}
          {hasItems && cartCtx.totalAmount > 0 && ( 
           <div className={classes.voucher}>
           <Flex align="center" justify="space-between">
             <span>Voucher: </span>
             <Flex direction="column">
               <Flex align="center">
                 <Input
                   variant='outline'
                   htmlSize={18}
                   width='auto'
                   placeholder="Enter voucher code"
                   value={voucherCode}
                   onChange={voucherCodeChangeHandler}
                 />
               </Flex>
               {voucherCode !== "" && (
                 <Flex align="center" mt={0.5} ml={2}>
                   {isVoucherValid === true && (
                     <Text color="green" fontSize="sm">Voucher code is valid!</Text>
                   )}
                   {isVoucherValid === false && (
                     <Text color="red" fontSize="sm">Voucher code is invalid.</Text>
                   )}
                 </Flex>
               )}
             </Flex>
             
           </Flex>
         </div>
          )}

          <div className={classes.total}>
          <Flex align="center" justify="space-between">
            <span>Total Amount:</span>
            {totalAmount}
            </Flex>
          </div>

          <div className={classes.actions}> 
            {hasItems && (
              <button className={classes.button} onClick={orderHandler}>
                Clear Cart
              </button>
            )}
            {hasItems && (
            <Link to={{
              pathname: "/AccessTech/customerorder"
              }}
              onClick={() => { sessionStorage.setItem('orderDetails', JSON.stringify(cartCtx.items)); 
              sessionStorage.setItem('lastOrderPage', props.userType);
              sessionStorage.setItem('totalAmount', cartCtx.totalAmount.toString());
              }}>
              <button className={classes["button--alt"]} onClick={props.onClose}>
                Order
              </button>
            </Link>
            )}
          </div>
        </>
      }
    </Modal>
  );
};

export default Cart;