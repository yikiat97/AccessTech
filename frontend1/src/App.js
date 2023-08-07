import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLogin from "./pages/admin/Admin_login";
import AdminHomepage from "./pages/admin/Admin_homepage";
import AdminOrderpage from "./pages/admin/Admin_orderpage";
import AdminIngredientpage from "./pages/admin/Admin_ingredientpage";


function App() {
  return (
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
     </Router>
    </div>
  );
}

export default App;
