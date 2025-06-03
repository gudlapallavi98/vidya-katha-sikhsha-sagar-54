
import React from "react";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  topNav?: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  sidebar,
  children,
  className,
  topNav,
}) => {
  return (
    <div className={cn("flex min-h-screen bg-[#fdf6ee]", className)}>
      {/* Sidebar */}
      <div className="hidden border-r border-gray-200 bg-white md:block md:w-64 lg:w-72">
        <div className="sticky top-0 h-screen overflow-y-auto">
          {sidebar}
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-x-hidden">
        {/* Top Navigation */}
        {topNav && (
          <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
            {topNav}
          </div>
        )}
        
        <div className="min-h-screen">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
