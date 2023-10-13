import * as React from 'react'
import './App.css';
import { ChakraProvider } from '@chakra-ui/react'
import { CustomisationProvider } from './Components/CustomisationContext'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLogin from "./pages/admin/Admin_login";
import AdminHomepage from "./pages/admin/Admin_homepage";
import AdminOrderpage from "./pages/admin/Admin_orderpage";
import AdminIngredientpage from "./pages/admin/Admin_ingredientpage";
import AdminManagementPage from "./pages/admin/Admin_management";
import AdminTransactionpage from './pages/admin/Admin_transaction';
import AdminTicketingPage from './pages/admin/Ticketing/Admin_ticketingOverview';
import AdminDiscountpage from './pages/admin/Admin_discount';
import AdminGeneralTicketingOrders from './pages/admin/Ticketing/Admin_GeneralTicketingOrders';
import AdminFryingTicketingOrders from './pages/admin/Ticketing/Admin_FryingTicketingOrders';
import AdminCustomisation from './pages/admin/Admin_customisation'
import AdminDrinksTicketingOrders from './pages/admin/Ticketing/Admin_DrinksTicketingOrders';

function App() {
  return (
    <ChakraProvider>
      <CustomisationProvider>
    <div className="App">
      <Router>
        <Routes>
          <Route path="/AccessTech/admin" element={<AdminLogin />} />
        </Routes>
        <Routes>
          <Route path="/AccessTech/AdminHomepage" element={<AdminHomepage />} />
        </Routes>
        <Routes>
          <Route path="/AccessTech/AdminOrderpage" element={<AdminOrderpage />} />
        </Routes>
        <Routes>
          <Route path="/AccessTech/AdminIngredientpage" element={<AdminIngredientpage />} />
        </Routes>
        <Routes>
          <Route path="/AccessTech/AdminTransactionpage" element={<AdminTransactionpage />} />
        </Routes>
        <Routes>
          <Route path="/AccessTech/AdminDiscountpage" element={<AdminDiscountpage />} />
        </Routes>
        <Routes>
          <Route path="/AccessTech/AdminManagement" element={<AdminManagementPage />} />
        </Routes>
        <Routes>
          <Route path="/AccessTech/TicketingPage" element={<AdminTicketingPage />} />
        </Routes>
        <Routes>
          <Route path="/AccessTech/AdminCustomisation" element={<AdminCustomisation />} />
        </Routes>
        <Routes>
          <Route path="/AccessTech/GeneralTicketingPage" element={<AdminGeneralTicketingOrders/>} />
        </Routes>
        <Routes>
          <Route path="/AccessTech/FryingTicketingPage" element={<AdminFryingTicketingOrders/>} />
        </Routes>
        <Routes>
          <Route path="/AccessTech/DrinksTicketingPage" element={<AdminDrinksTicketingOrders/>} />
        </Routes>
      </Router>
    </div>
    </CustomisationProvider>
    </ChakraProvider>
  );
}

export default App;
