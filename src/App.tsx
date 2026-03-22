import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { useAuthStore } from '@/infrastructure/auth/useAuthStore';

function App() {
  const restoreSession = useAuthStore(s => s.restoreSession);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  return <RouterProvider router={router} />;
}

export default App
