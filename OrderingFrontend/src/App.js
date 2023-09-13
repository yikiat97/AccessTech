import * as React from 'react'
import './App.css';
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StudentHomepage from "./pages/ordering/Order_Menu_Student";
import PublicHomepage from "./pages/ordering/Order_Menu_Public";
import OrderConfirmationPage from './pages/ordering/Order_confirmation';
import { CartProvider } from "./Components/ordering/Cart/CartProvider"; 
import PaymentPage from "./pages/payment/payment"




function App() {
  return (
    <ChakraProvider>
      <CartProvider>
        <div className="App">
        <Router>
          <Routes>
            <Route path="/AccessTech/studentmenu" element={<StudentHomepage />} />
            <Route path="/AccessTech/publicmenu" element={<PublicHomepage />} />
            <Route path="/AccessTech/customerorder" element={<OrderConfirmationPage />} />
            <Route path="/AccessTech/payment" element={<PaymentPage />} />
          </Routes>
        </Router>
        </div>
      </CartProvider>
    </ChakraProvider>
  );
}

export default App;
