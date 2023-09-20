import { Fragment } from "react";
import ReactDOM from "react-dom";
import classes from "./css/CartModal.module.css";
import { FaTimes } from "react-icons/fa";


const portalElement = document.getElementById("overlays");

const ModalOverlay = (props) => {
  return (
    <div className={classes.modal}>
      <div className={classes.header}>
        <h2 className={classes.title}>{props.title}</h2>
        <button className={classes.closeButton} onClick={props.onClose}>
          <FaTimes />
        </button>
      </div>
      <div className={classes.content}>{props.children}</div>
    </div>
  );
};

const Modal = (props) => {
  return (
    <div>
      {ReactDOM.createPortal(
        <ModalOverlay title={props.title} onClose={props.onClose}>
          {props.children}
        </ModalOverlay>,
        portalElement
      )}
    </div>
  );
};

export default Modal;