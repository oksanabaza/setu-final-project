import React, { useState } from 'react';
import './App.css';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const [token, setToken] = useState('');

  return (
    <div className="App">
      {token ? (
        <Dashboard token={token} />
      ) : (
        <Login setToken={setToken} />
      )}
    </div>
  );
}

export default App;