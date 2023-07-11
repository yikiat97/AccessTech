import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import logo from '../../assets/logo/logo_horizon.png';
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import './css/admin.css';

function SideNavBar() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar style={{width:"350px"}} backgroundColor="#0b1a2c" className="app">
        <Menu >
          <img style={{width:"350px", height:"65px"}} src={logo} alt="Logo" />
          {/* <MenuItem className="menu-title">
            <p className="text">FORTITUDE CULINA</p>
          </MenuItem> */}
          <MenuItem className="menu-item"> <p className="text">Item Menu Dashboard</p>  </MenuItem>
          <MenuItem className="menu-item"> <p className="text">Inventory Dashboard</p>   </MenuItem>
          <SubMenu label="Discounts Items" title="Charts" className="menu-submenu">
            <MenuItem className="menu-item"> Timeline Chart </MenuItem>
            <MenuItem className="menu-item"> Bubble Chart </MenuItem>
          </SubMenu>
          <MenuItem className="menu-item"> Logout </MenuItem>
        </Menu>
      </Sidebar>
      
      <h1 className="header">WELCOME TO QUICKPAY</h1>
    </div>
  );
};
  
export default SideNavBar;
