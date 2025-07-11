import React from 'react';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './config/AuthContext';

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
