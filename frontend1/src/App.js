import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLogin from "./pages/admin/Admin_login";
import AdminHomepage from "./pages/admin/Admin_homepage";


function App() {
  return (
    <div className="App">
     <Router>
      <Routes>
        <Route path="/AccessTech/admin" element={<AdminLogin />} />
      </Routes>
      <Routes>
        <Route path="/AccessTech/admin_homepage" element={<AdminHomepage />} />
      </Routes>
     </Router>
    </div>
  );
}

export default App;
