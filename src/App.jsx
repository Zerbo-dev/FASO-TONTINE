import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Payments from './pages/Payments';
import CreateGroup from './pages/CreateGroup';
import GroupDetails from './pages/GroupDetails';
import Projects from './pages/Projects';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/create-group" element={<CreateGroup />} />
        <Route path="/group-details" element={<GroupDetails />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;