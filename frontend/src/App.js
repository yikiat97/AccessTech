import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import SideBar from "./Components/SideBar";
import Container from "./Components/Container";

function App() {
  return (
    <div className="App">
     <Router>
      <SideBar />
      <Routes>
        <Route path="/" element={<Container />} />
      </Routes>
     </Router>
    </div>
  );
}

export default App;
