
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Chatbot from "../chatbot/Chatbot";
import { Toaster } from "@/components/ui/toaster";
import { RadialMenu } from "@/components/ui/radial-menu";
import { Home, Book, User, Calendar, Clock, MessageSquare, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const Layout = () => {
  const location = useLocation();
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const { user } = useAuth(); // Get user from auth context
  
  useEffect(() => {
    // Determine which menu items to show based on the current route
    const path = location.pathname;
    
    if (path === "/teacher-dashboard" || path.startsWith("/teacher-dashboard")) {
      // Configure menu items for teacher dashboard
      setMenuItems([
        { 
          icon: <Home className="h-5 w-5" />, 
          label: "Overview", 
          path: "/teacher-dashboard?tab=overview", 
          onClick: () => window.location.href = "/teacher-dashboard?tab=overview" 
        },
        { 
          icon: <Book className="h-5 w-5" />, 
          label: "Courses", 
          path: "/teacher-dashboard?tab=courses", 
          onClick: () => window.location.href = "/teacher-dashboard?tab=courses" 
        },
        { 
          icon: <Calendar className="h-5 w-5" />, 
          label: "Session Requests", 
          path: "/teacher-dashboard?tab=session-requests", 
          onClick: () => window.location.href = "/teacher-dashboard?tab=session-requests" 
        },
        { 
          icon: <Clock className="h-5 w-5" />, 
          label: "Schedule", 
          path: "/teacher-dashboard?tab=schedule", 
          onClick: () => window.location.href = "/teacher-dashboard?tab=schedule" 
        },
        { 
          icon: <MessageSquare className="h-5 w-5" />, 
          label: "Availability", 
          path: "/teacher-dashboard?tab=availability", 
          onClick: () => window.location.href = "/teacher-dashboard?tab=availability" 
        },
        { 
          icon: <Settings className="h-5 w-5" />, 
          label: "Profile", 
          path: "/teacher-dashboard?tab=profile", 
          onClick: () => window.location.href = "/teacher-dashboard?tab=profile" 
        },
      ]);
    } else if (path === "/student-dashboard" || path.startsWith("/student-dashboard")) {
      // Configure menu items for student dashboard
      setMenuItems([
        { 
          icon: <Home className="h-5 w-5" />, 
          label: "Overview", 
          path: "/student-dashboard?tab=overview", 
          onClick: () => window.location.href = "/student-dashboard?tab=overview" 
        },
        { 
          icon: <Book className="h-5 w-5" />, 
          label: "My Courses", 
          path: "/student-dashboard?tab=courses", 
          onClick: () => window.location.href = "/student-dashboard?tab=courses" 
        },
        { 
          icon: <Calendar className="h-5 w-5" />, 
          label: "Upcoming Sessions", 
          path: "/student-dashboard?tab=sessions", 
          onClick: () => window.location.href = "/student-dashboard?tab=sessions" 
        },
        { 
          icon: <Clock className="h-5 w-5" />, 
          label: "Past Sessions", 
          path: "/student-dashboard?tab=past-sessions", 
          onClick: () => window.location.href = "/student-dashboard?tab=past-sessions" 
        },
        { 
          icon: <MessageSquare className="h-5 w-5" />, 
          label: "Request Session", 
          path: "/student-dashboard?tab=request-session", 
          onClick: () => window.location.href = "/student-dashboard?tab=request-session" 
        },
        { 
          icon: <Settings className="h-5 w-5" />, 
          label: "Profile", 
          path: "/student-dashboard?tab=profile", 
          onClick: () => window.location.href = "/student-dashboard?tab=profile" 
        },
      ]);
    } else {
      // Default menu items for other pages
      setMenuItems([
        { icon: <Home className="h-5 w-5" />, label: "Home", path: "/", onClick: () => window.location.href = "/" },
        { icon: <User className="h-5 w-5" />, label: "Profile", path: "/profile", onClick: () => window.location.href = "/profile" },
        { icon: <Book className="h-5 w-5" />, label: "Courses", path: "/courses", onClick: () => window.location.href = "/courses" },
        { icon: <Settings className="h-5 w-5" />, label: "Settings", path: "/profile", onClick: () => window.location.href = "/profile?tab=settings" },
      ]);
    }
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-background font-inter">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      {/* Only show RadialMenu if user is logged in */}
      {user && <RadialMenu items={menuItems} />}
      <Footer />
      <Chatbot />
      <Toaster />
    </div>
  );
};

export default Layout;
