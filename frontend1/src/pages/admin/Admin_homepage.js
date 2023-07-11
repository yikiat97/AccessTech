import React, { useState } from 'react';
import "./css/admin_login.css";
import logo from '../../assets/logo/logo.png'; // adjust the path as needed
import SideNavBar from '../../Components/admin/SideNavBar'



function Admin_homapage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    
  };

  return (
    <div>
      <SideNavBar></SideNavBar>
    </div>
  );
}

export default Admin_homapage;