import React from 'react';
import Login from './pages/Auth/Login';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Login />
    </>
  );
}

export default App;
