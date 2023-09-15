import React, { useRef, useState } from "react";
import classes from "./css/MealItemForm.module.css";
import Input from "./Input";
import { useToast } from "@chakra-ui/react"; 

const MealItemForm = (props) => {

    const [amountIsValid, setAmountIsValid] = useState(true);
    const amountInputRef = useRef();
    const [showMaxQtyAlert, setShowMaxQtyAlert] = useState(false);
    const toast = useToast();
    const maxQuantity=props.qty;

    const submitHandler = (event) => {
        event.preventDefault();

        const enteredAmount = amountInputRef.current.value;
        const enteredAmountNumber = +enteredAmount;

        if (
            enteredAmount.trim().length === 0 ||
            enteredAmountNumber < 1 ||
            enteredAmountNumber > maxQuantity
        ) {
            setAmountIsValid(false);
            return;
        }

        props.onAddToCart(enteredAmountNumber);
        amountInputRef.current.value = "1";

        props.closeModal();
        toast({
          title: "Item successfully added to cart!",
          status: "success",
          duration: 4000, // 5 seconds
          isClosable: false,
      });

    };

    const handleIncrement = () => {
        if (+amountInputRef.current.value < maxQuantity) {
            amountInputRef.current.stepUp();
            setShowMaxQtyAlert(false);
        } else {
            setShowMaxQtyAlert(true);
            toast({
                title: "Limited availability",
                status: "warning",
                duration: 2000, // 2 seconds
                isClosable: false,
                position: "top"
              });
          }
    };

    const handleDecrement = () => {
        if (+amountInputRef.current.value > 1) {
            amountInputRef.current.stepDown();
            setShowMaxQtyAlert(false);
        }
    };

    return (
        <form className={classes.form} onSubmit={submitHandler}>
            
            <Input
                ref={amountInputRef}
                label="Amount"
                input={{
                    id: "amount_" + props.id,
                    type: "number",
                    min: "1",
                    max: maxQuantity.toString(),
                    step: "1",
                    defaultValue: "1",
                    readOnly:true
                }}
            />
            <div>
                <button className={classes.decrement} type="button" onClick={handleDecrement}>-</button>
                <button className={classes.increment} type="button" onClick={handleIncrement}>+</button>
            </div>

            <button className={classes.addToCart}>Add to Cart</button>
            
        </form>
    );
};

export default MealItemForm;
