
import React from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  sidebar: React.ReactNode;
  content: React.ReactNode;
  activeTab: string;
  className?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  sidebar,
  content,
  activeTab,
  className,
}) => {
  return (
    <div className={cn("container py-12", className)}>
      <div className="flex flex-col md:flex-row items-start gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-1/4">
          {sidebar}
        </div>

        {/* Main content */}
        <div className="w-full md:w-3/4">
          <Tabs value={activeTab} className="w-full">
            {content}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
