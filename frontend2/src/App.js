import * as React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Customer_homepage from "./pages/customer/Customer_homepage";
import Shopping_cart from "./pages/customer/Shopping_cart";

function App() {
  return (
    <ChakraProvider>
    <div className="App">
     <Router>
      <Routes>
        <Route path="/AccessTech/customermenu" element={<Customer_homepage />} />
        <Route path="/AccessTech/customercart" element={<Shopping_cart />} />
      </Routes>
      <Routes>
      
      </Routes>
     </Router>
    </div>
    </ChakraProvider>
  );
}

export default App;
