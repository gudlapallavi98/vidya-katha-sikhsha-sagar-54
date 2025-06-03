
import React from "react";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  sidebar,
  children,
  className,
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
        <div className="min-h-screen">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
