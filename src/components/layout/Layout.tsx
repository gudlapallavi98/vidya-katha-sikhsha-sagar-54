
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Chatbot from "../chatbot/Chatbot";

const Layout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background font-inter">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
};

export default Layout;
