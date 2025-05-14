
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from './components/ui/toaster';
import { ToasterProvider } from './hooks/use-toast';

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ToasterProvider>
      <AuthProvider>
        <App />
        <Toaster />
      </AuthProvider>
    </ToasterProvider>
  </BrowserRouter>
);
