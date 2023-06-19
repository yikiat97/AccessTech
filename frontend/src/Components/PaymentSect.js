import React from "react";
import { FaTrashAlt } from "react-icons/fa";



function PaymentSect() {

  return (
    <>
      <div className="payment">
        <div className="name">
          <h4>Item</h4>
          <p>Qty</p>
          <p>Price</p>
        </div>

        <div className="price">


          <article>
            <div className="pay">
              <div>
                <b>Desert 2</b>
                <p>$1.50</p>
              </div>
              <p className="qty-box">1</p>
              <p>$1.50</p>
            </div>

            <div className="pay">
              <input className="order-input" placeholder="Input Order Note" ></input>
              <span className="trash-box" title="delete"><FaTrashAlt /></span>
            </div>
          </article>


          <article>
            <div className="pay">
              <div>
                <b>African 3</b>
                <p>$2.78</p>
              </div>
              <p className="qty-box">2</p>
              <p>$8.34</p>
            </div>

            <div className="pay">
              <input className="order-input" placeholder="Input Order Note" ></input>
              <span className="trash-box" title="delete"><FaTrashAlt /></span>
            </div>
          </article>



          <article>
            <div className="pay">
              <div>
                <b>Chinese 2</b>
                <p>$2.50</p>
              </div>
              <p className="qty-box">2</p>
              <p>$5.00</p>
            </div>

            <div className="pay">
              <input className="order-input" placeholder="Input Order Note" ></input>
              <span className="trash-box" title="delete"><FaTrashAlt /></span>
            </div>
          </article>


          <figure>
            <div className="last">
              <p className="space">Discount</p>
              <p>Total</p>
            </div>
            <div className="last">
              <p className="space">$0</p>
              <p>$14.84</p>
            </div>
          </figure>



          {/* <figure>
            <div className="last">
              <p className="space">Discount</p>
              <p>Sub-total</p>
            </div>
            <div className="last">
              <p className="space">$0</p>
              <p>{total()}</p>
            </div>
          </figure> */}




        </div>
      </div>
    </>
  );
}

export default PaymentSect;
