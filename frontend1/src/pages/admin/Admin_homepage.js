import React, { useState } from 'react';
import "./css/admin_login.css";
import logo from '../../assets/logo/logo.png'; // adjust the path as needed
import SideNavBar from '../../Components/admin/SideNavBar'
import AdminCRUDuser from '../../Components/admin/Admin_CRUD_user'



function Admin_homapage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    
  };

  return (
    <div>
      <SideNavBar></SideNavBar>
      <AdminCRUDuser></AdminCRUDuser>
    </div>
  );
}

export default Admin_homapage;