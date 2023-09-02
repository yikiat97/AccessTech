import * as React from 'react'
import './App.css';
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CustomerHomepage from "./pages/ordering/Order_menu";
import OrderConfirmationPage from './pages/ordering/Order_confirmation';
import { CartProvider } from "./Components/ordering/Cart/CartProvider"; 




function App() {
  return (
    <ChakraProvider>
      <CartProvider>
        <div className="App">
        <Router>
          <Routes>
            <Route path="/AccessTech/customermenu" element={<CustomerHomepage />} />
            <Route path="/AccessTech/customerorder" element={<OrderConfirmationPage />} />
          </Routes>
        </Router>
        </div>
      </CartProvider>
    </ChakraProvider>
  );
}

export default App;
