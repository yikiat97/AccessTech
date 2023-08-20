import { useContext, useState } from "react";
import Modal from "./CartModal";
import classes from "./css/Cart.module.css";
import CartItem from "./CartItem";
import CartContext from "./cart-context";
import OrderDelivered from "./OrderDelivered";

const Cart = (props) => {
  const cartCtx = useContext(CartContext);
  
  const [showOrder, setShowOrder] = useState(false);
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
    setShowOrder(false);
  };

  const cartItems = (
    
      
    <ul className={classes["cart-items"]}>
      {cartCtx.items.map((item) => (
        <CartItem
          key={item.id}
          name={item.name}
          amount={item.amount}
          price={`$${item.price}`} 
          onRemove={cartItemRemoveHandler.bind(null, item.id)}
          onAdd={cartItemAddHandler.bind(null, item)}
        />
      ))}
    </ul>
  );

  return (
    <Modal title="Your Cart" onClose={props.onClose}>
      {!showOrder ? (
        <>
          {cartItems}
          <div className={classes.total}>
            <span>Total Amount</span>
            <span>{totalAmount}</span>
          </div>
          <div className={classes.actions}> 
            {hasItems && (
              <button className={classes.button} onClick={orderHandler}>
                Clear Cart
              </button>
            )}
            {hasItems && (
            <button className={classes["button--alt"]} onClick={props.onClose}>
              Order
            </button>
            )}
          </div>
        </>
      ) : (
        <OrderDelivered onClose={props.onClose} />
      )}
    </Modal>
  );
};

export default Cart;
