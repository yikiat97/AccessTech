import * as React from 'react'
import './App.css';
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Customer_homepage from "./pages/ordering/Order_menu";
import Shopping_cart from "./pages/ordering/Order_Shopping_Cart";



function App() {
  return (
    <ChakraProvider>
    <div className="App">
     <Router>
      <Routes>
        <Route path="/AccessTech/customermenu" element={<Customer_homepage />} />
        <Route path="/AccessTech/customercart" element={<Shopping_cart />} />
      </Routes>
     </Router>
    </div>
    </ChakraProvider>
  );
}

export default App;
