import React from 'react'
import Login from './login'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Home'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
