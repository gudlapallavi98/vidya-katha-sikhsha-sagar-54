
import React from "react";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface SidebarItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface DashboardSidebarProps {
  title: string;
  subtitle: string;
  userName: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
  items: SidebarItem[];
  accentColor: string;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  title,
  subtitle,
  userName,
  activeTab,
  onTabChange,
  items,
  accentColor,
}) => {
  return (
    <Card className="bg-white shadow-md border-0">
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className={cn("h-16 w-16 rounded-full flex items-center justify-center", `bg-${accentColor}/20`)}>
            <User className={cn("h-8 w-8", `text-${accentColor}`)} />
          </div>
          <div>
            <CardTitle>{userName}</CardTitle>
            <CardDescription>{subtitle}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <nav className="space-y-2">
          {items.map((item) => (
            <Button 
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"} 
              className={cn(
                activeTab === item.id ? `bg-${accentColor}` : "", 
                "w-full justify-start"
              )}
              onClick={() => onTabChange(item.id)}
            >
              {item.icon && <span className="mr-2">{item.icon}</span>}
              {item.label}
            </Button>
          ))}
        </nav>
      </CardContent>
    </Card>
  );
};

export default DashboardSidebar;
