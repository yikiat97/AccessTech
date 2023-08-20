import * as React from 'react'
import './App.css';
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import CustomerHomepage from "./pages/ordering/Order_menu";
import ShoppingCart from "./pages/ordering/Order_Shopping_Cart";



function App() {
  return (
    <ChakraProvider>
    <div className="App">
     <Router>
      <Routes>
        <Route path="/AccessTech/customermenu" element={<CustomerHomepage />} />
        <Route path="/AccessTech/customercart" element={<ShoppingCart />} />
      </Routes>
     </Router>
    </div>
    </ChakraProvider>
  );
}

export default App;
