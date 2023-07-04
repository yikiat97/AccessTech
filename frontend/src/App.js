import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import SideBar from "./Components/SideBar";
import Container from "./Components/Container";
import Admin_login from "./Components/admin/Admin_login";


function App() {
  return (
    <div className="App">
     <Router>
     <Routes>
        <Route path="/" element={ <SideBar />} />
      </Routes>
      <Routes>
        <Route path="/" element={<Container />} />
      </Routes>
      <Routes>
        <Route path="/AccessTech/admin" element={<Admin_login />} />
      </Routes>
     </Router>
    </div>
  );
}

export default App;
