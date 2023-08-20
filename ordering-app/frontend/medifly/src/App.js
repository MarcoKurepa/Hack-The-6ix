import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import HospitalApp from './hospital/HospitalApp';
import ClientApp from './client/ClientApp';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/hospital' element={<HospitalApp />} />
        <Route path='/client/*' element={<ClientApp />} />
      </Routes>
    </Router>
  );
}

export default App;
