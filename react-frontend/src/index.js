import React from 'react';
import ReactDOM from 'react-dom/client';
import WrappedApp from './App';
import { AuthProvider } from './AuthContext'; // ✅ Import AuthProvider

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>  {/* ✅ Wrap with AuthProvider */}
      <WrappedApp />
    </AuthProvider>
  </React.StrictMode>
);
