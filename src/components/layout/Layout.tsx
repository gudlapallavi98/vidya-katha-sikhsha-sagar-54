
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Chatbot from "../chatbot/Chatbot";
import { Toaster } from "@/components/ui/toaster";
import { RadialMenu } from "@/components/ui/radial-menu";

const Layout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background font-inter">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <RadialMenu />
      <Footer />
      <Chatbot />
      <Toaster />
    </div>
  );
};

export default Layout;
