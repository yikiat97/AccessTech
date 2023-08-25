import * as React from 'react'
import './App.css';
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLogin from "./pages/admin/Admin_login";
import AdminHomepage from "./pages/admin/Admin_homepage";
import AdminOrderpage from "./pages/admin/Admin_orderpage";
import AdminIngredientpage from "./pages/admin/Admin_ingredientpage";
import AdminManagementPage from "./pages/admin/Admin_management";
import AdminTransactionpage from './pages/admin/Admin_transaction';
import AdminTicketingPage from './pages/admin/Admin_ticketing';
import AdminDiscountpage from './pages/admin/Admin_discount';
function App() {
  return (
    <ChakraProvider>
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
        <Route path="/AccessTech/AdminTicketingpage" element={<AdminTicketingPage />} />
      </Routes>
      <Routes>
        <Route path="/AccessTech/AdminDiscountpage" element={<AdminDiscountpage />} />
      </Routes>
      <Routes>
        <Route path="/AccessTech/AdminManagement" element={<AdminManagementPage />} />
      </Routes>
     </Router>
    </div>
    </ChakraProvider>
  );
}

export default App;
