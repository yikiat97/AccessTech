import React, { useState } from 'react';
import "./css/admin_login.css";
import logo from '../../assets/logo/logo.png'; // adjust the path as needed



function Admin_login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://127.0.0.1:5000/userAuth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "username": "admin1",
        "password": "password"
    }),
    });
    
    const data = await response.json();
    console.log(data); // it will log the response to console
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1 style={{color:"white"}}>Log in</h1>
        <img src={logo} alt="Logo" />
        <input 
          type="Username" 
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input 
          type="password" 
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Next</button>
        {/* <a href="#">Forgot your password?</a> */}
      </form>
    </div>
  );
}

export default Admin_login;