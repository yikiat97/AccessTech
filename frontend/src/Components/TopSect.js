import React from "react";
import { FaSearch } from "react-icons/fa";



function TopSect() {

  return (
    <div className="top-section">
      <div className="header">
        <p>Welcome👋</p>
      </div>

      

      <div className="search-box">
        <input type="text" placeholder="Search food..." />
        <i>
          <FaSearch />
        </i>
      </div>
    </div>
  );
}

export default TopSect;
