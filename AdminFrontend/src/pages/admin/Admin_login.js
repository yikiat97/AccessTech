import React, { useState } from 'react';
import "./css/admin_login.css";
import logo from '../../assets/logo/logo.png'; // adjust the path as needed



function Admin_login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(process.env.REACT_APP_API_URL+'/userAuth', {
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
    <div className='container_login '>
      <form class="form_login " onSubmit={handleSubmit}>
        <h1 className='font_login' style={{color:"white"}}>Log in</h1>
        <img src={logo} alt="Logo" />
        <input 
          className='input_login font_login'
          type="Username" 
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input 
          className='input_login font_login'
          type="password" 
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className='font_login button_login' type="submit">Next</button>
        {/* <a href="#">Forgot your password?</a> */}
      </form>
    </div>
  );
}

export default Admin_login;