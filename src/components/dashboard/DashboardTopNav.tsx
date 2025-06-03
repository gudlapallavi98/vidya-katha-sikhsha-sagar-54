
import React from "react";
import { cn } from "@/lib/utils";
import { useLocation, Link } from "react-router-dom";

interface NavItem {
  name: string;
  path: string;
  isActive?: boolean;
}

interface DashboardTopNavProps {
  className?: string;
}

const DashboardTopNav: React.FC<DashboardTopNavProps> = ({ className }) => {
  const location = useLocation();

  const navItems: NavItem[] = [
    { name: "Home", path: "/" },
    { name: "Courses", path: "/courses" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className={cn("px-6 py-4", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "relative px-3 py-2 text-sm font-medium transition-all duration-200 rounded-lg",
                  isActive
                    ? "text-[#FF9933]"
                    : "text-gray-600 hover:text-[#FF9933] hover:bg-orange-50"
                )}
              >
                {item.name}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#FF9933] to-[#138808] rounded-full animate-in slide-in-from-bottom-1 duration-300" />
                )}
              </Link>
            );
          })}
        </div>
        
        {/* Optional: Add a subtle tricolor accent */}
        <div className="hidden md:flex items-center space-x-1">
          <div className="w-2 h-2 rounded-full bg-[#FF9933]"></div>
          <div className="w-2 h-2 rounded-full bg-white border border-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-[#138808]"></div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardTopNav;
