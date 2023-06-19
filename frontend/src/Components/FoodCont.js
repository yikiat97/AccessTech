import React from "react";
import "../css/foodcont.css";
import FoodBox from "./FoodBox";
import card from "../assets/foodImage/card1.png";
import afri from "../assets/foodImage/afri.jpg";
import chine from "../assets/foodImage/chine.jpg";
import ital from "../assets/foodImage/ital.jpg";
import PaymentSect from "./PaymentSect";
import { Link } from "react-router-dom";



function FoodCont() {
  return (
    <>
      <div className="foodcontainer">
        <div className="left-side">
          <div className="cards">
            <div className="all">
              <div className="varieties">
                <Link to="/" className="var-btn">
                  All
                </Link>
                <Link to="/african" className="var-btn">
                  African
                </Link>
                <Link to="/chinese" className="var-btn">
                  Chinese
                </Link>
                <Link to="/italian" className="var-btn">
                  Italian
                </Link>
                <Link to="/desert" className="var-btn">
                  Desert
                </Link>
              </div>
            </div>

            <main>
              <FoodBox imgSrc={card} title={"All 1"} price={"$20"} />
              <FoodBox imgSrc={afri} title={"All 2"} price={"$10"} />
              <FoodBox imgSrc={ital} title={"All 3"} price={"$5"} />
              <FoodBox imgSrc={chine} title={"All 4"} price={"$7"} />
              <FoodBox imgSrc={card} title={"All 5"} price={"$10"} />
              <FoodBox imgSrc={card} title={"All 6"} price={"$15"} />
            </main>
          </div>
        </div>
        <div className="right-side">
          <PaymentSect />
        </div>
      </div>
    </>
  );
}

export default FoodCont;
