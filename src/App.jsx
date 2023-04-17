import { useState } from 'react'
import './App.css'
import PrivateRoute from './utils/PrivateRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import { Route, Routes } from 'react-router-dom';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes>
      <Route path="/" element={<PrivateRoute />}>
        <Route path="home" element={<Home />} />
      </Route>
      {/* <Route
        path="/logout"
        element={<Box onClickLogin={() => handleLogout()} />}
      /> */}
      <Route
        path="/login"
        element={<Login />}
      />
    </Routes>
  )
}

export default App
