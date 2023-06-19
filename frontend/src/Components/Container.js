import React from "react";
import "../css/container.css";
import TopSect from "./TopSect";
import FoodCont from "./FoodCont";


function Container() {
  return (
    <div className="container">
      <TopSect />
      <FoodCont />
    </div>
  );
}

export default Container;
