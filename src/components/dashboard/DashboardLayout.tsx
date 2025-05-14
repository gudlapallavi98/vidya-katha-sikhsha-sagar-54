
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
    <div className={cn("flex min-h-screen bg-background", className)}>
      {/* Sidebar */}
      <div className="hidden border-r bg-muted/10 md:block md:w-64 lg:w-72">
        <div className="sticky top-0 h-screen overflow-y-auto p-4">
          {sidebar}
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-x-hidden">
        <div className="container py-6 md:py-8 lg:py-10">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
