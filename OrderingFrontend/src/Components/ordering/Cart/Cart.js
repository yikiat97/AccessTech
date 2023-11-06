import { useContext, useState, useEffect, useRef } from "react";
import { Link } from 'react-router-dom';
import { Input, Text, Flex } from '@chakra-ui/react';
import Modal from "./CartModal";
import classes from "./css/Cart.module.css";
import CartItem from "./CartItem";
import CartContext from "./cart-context";
import { calculateUpdatedPrice } from './cart-utils';

export async function fetchVoucherValidity(voucherCode) {
  try {
    const response = await fetch(process.env.REACT_APP_API_URL+`/discount/check-voucher?voucher_code=${voucherCode}`);
    const data = await response.json();
    console.log(data)
    return data;
  } catch (error) {
    console.error('Error fetching voucher validity:', error);
    return [];
}
}

const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const Cart = (props) => {
  
  const cartCtx = useContext(CartContext);
  const [editedSpecialInstructions, setEditedSpecialInstructions] = useState({});
  const [voucherCode, setVoucherCode] = useState(""); 
  const [isVoucherValid, setIsVoucherValid] = useState(null);
  const [lastValidDiscount, setLastValidDiscount] = useState(0);

  
  const latestCall = useRef(null);

  const debouncedVoucherCheck = debounce((code) => {
    const thisCall = fetchVoucherValidity(code);
    latestCall.current = thisCall;
    thisCall.then((data) => {
      if (thisCall === latestCall.current) {
        if (data.result === 'Voucher is valid') {
          cartCtx.setDiscountId(data.discount_id);
          setIsVoucherValid(true);
          cartCtx.applyDiscount(data.discount_percent);
          setLastValidDiscount(data.discount_percent);
        } else {
          cartCtx.setDiscountId(null);
          setIsVoucherValid(false);
          cartCtx.removeDiscount(lastValidDiscount);
          setLastValidDiscount(0.0); 
        }
      }
    });
  }, 700);
  
  useEffect(() => {
    if (voucherCode) {
      debouncedVoucherCheck(voucherCode);
    }
  }, [voucherCode]);

  const hasItems = Array.isArray(cartCtx.items) && cartCtx.items.length > 0;
  const totalAmount = hasItems ? `$${Number(cartCtx.totalAmount).toFixed(2)}` : '$0.00';


  const cartItemRemoveHandler = (unique_id) => {
    cartCtx.removeItem(unique_id);
  };

  const cartItemAddHandler = (item) => {
    const existingItemIndex = cartCtx.items.findIndex(
      (cartItem) => cartItem.unique_id === item.unique_id
    );

    if (existingItemIndex !== -1) {
      const existingItem = cartCtx.items[existingItemIndex];
      if (existingItem.amount >= existingItem.max_quantity) {
        return;
      }
    }

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
  };
    

  const cartItems = (
    <ul className={classes["cart-items"]}>
    {cartCtx.items.map((item) => (
      <li key={item.unique_id}>
        <CartItem
          name={<strong>{item.name}</strong>}
          amount={item.amount}
          price={`${item.price}`}
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
           <Flex align="center" justify="space-between" className="voucher-container" height="50px" position="relative">
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
                 <Flex align="center" mt={1} ml={2} position="absolute" bottom="-2vh" className="voucher-message">
                   {isVoucherValid === true && (
                     <Text color="green" fontSize="sm">Voucher code applied!</Text>
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
              pathname: "/AccessTech/payment"
              }}
              onClick={() => { sessionStorage.setItem('orderDetails', JSON.stringify(cartCtx.items)); 
              sessionStorage.setItem('lastOrderPage', props.userType);
              sessionStorage.setItem('totalAmount', cartCtx.totalAmount.toString());
              if (cartCtx.discountId !== null && cartCtx.discountId !== undefined) {
                sessionStorage.setItem('discountId', cartCtx.discountId.toString());           
              }
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
