
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export interface DashboardNavItemProps {
  id: string;
  label: string;
  icon?: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}

interface DashboardNavProps {
  items: DashboardNavItemProps[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  className?: string;
}

const DashboardNav: React.FC<DashboardNavProps> = ({
  items,
  activeTab,
  onTabChange,
  className,
}) => {
  // Handle tab change with explicit event prevention
  const handleTabClick = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default anchor behavior
    onTabChange(id);
  };

  return (
    <nav className={cn("flex flex-col space-y-1.5", className)}>
      {items.map((item) => (
        <Button
          key={item.id}
          variant={activeTab === item.id ? "secondary" : "ghost"}
          className={cn(
            "justify-start",
            activeTab === item.id && "bg-secondary font-medium"
          )}
          onClick={handleTabClick(item.id)}
        >
          {item.icon && <span className="mr-2">{item.icon}</span>}
          {item.label}
        </Button>
      ))}
    </nav>
  );
};

export default DashboardNav;
