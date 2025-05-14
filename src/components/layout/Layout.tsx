
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Chatbot from "../chatbot/Chatbot";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/contexts/AuthContext";

const Layout = () => {
  const location = useLocation();
  const { user } = useAuth(); // Get user from auth context
  
  return (
    <div className="flex min-h-screen flex-col bg-background font-inter">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Chatbot />
      <Toaster />
    </div>
  );
};

export default Layout;
