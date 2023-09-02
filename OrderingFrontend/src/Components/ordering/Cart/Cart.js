import { useContext, useState } from "react";
import { Link } from 'react-router-dom';
import { Input, Text, Flex } from '@chakra-ui/react';
import Modal from "./CartModal";
import classes from "./css/Cart.module.css";
import CartItem from "./CartItem";
import CartContext from "./cart-context";


const Cart = (props) => {
  const cartCtx = useContext(CartContext);

  const [editedSpecialInstructions, setEditedSpecialInstructions] = useState({});

  const [voucherCode, setVoucherCode] = useState(""); 
  const [isVoucherValid, setIsVoucherValid] = useState(null);
  
  const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
  
  const hasItems = cartCtx.items.length > 0;

  const cartItemRemoveHandler = (id) => {
    cartCtx.removeItem(id);
  };

  const cartItemAddHandler = (item) => {
    cartCtx.addItem({ ...item, amount: 1 });
  };

  
  const orderHandler = () => {
    cartCtx.clearAll();
    
  };

  const cartItemEditHandler = (id, specialRequests) => {
    setEditedSpecialInstructions({ id, specialRequests });
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
      <li key={item.id}>
        <CartItem
          name={<strong>{item.name}</strong>}
          amount={item.amount}
          price={`$${item.price}`}
          onRemove={cartItemRemoveHandler.bind(null, item.id)}
          onAdd={cartItemAddHandler.bind(null, item)}
          onEdit={cartItemEditHandler.bind(null, item.id)}
          specialRequests={item.specialRequests} 

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
          {cartCtx.totalAmount > 0 && ( 
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
              pathname: "/AccessTech/customerorder",
              search: `?totalAmount=${encodeURIComponent(totalAmount)}`  
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
