import React, { useEffect, useState } from 'react';
import { Route, Routes,Navigate  } from 'react-router-dom';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import Signup from './pages/singup';
import Policy from './pages/policy';
import Nasdata from './pages/Nasdata';
import Tag from './pages/tag2';
function App() {
  return (
    <div>
      <Routes>
      <Route exact path="/" element={<Login />} />
      <Route path="/register" element={<Signup />} />
      <Route path="/policy" element={<Policy />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/nasdata" element={<Nasdata />} />
      <Route path="/tag" element={<Tag />} />
      </Routes>
    </div>
  );
}

// function PrivateRoute() {
//   const isLoggedIn = true; // Replace with your authentication logic
//   return isLoggedIn ? (
//     <Routes>
//     <Route path="/dashboard" element={<Dashboard />} />
//       <Route path="/file" element={<File />} />
//     </Routes>
//   ) : (
//     <Navigate to="/" replace />
//   );
// }

export default App;