
import React from "react";
import { cn } from "@/lib/utils";

interface NavigationItemProps {
  id: string;
  label: string;
  icon: React.ElementType;
}

interface HorizontalNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  items: NavigationItemProps[];
  variant?: "teacher" | "student";
}

const HorizontalNavigation: React.FC<HorizontalNavigationProps> = ({ 
  activeTab, 
  onTabChange,
  items,
  variant = "teacher" 
}) => {
  // Determine theme colors based on variant
  const getActiveStyles = (isActive: boolean) => {
    const baseClasses = "flex items-center px-4 py-2 text-sm font-medium transition-colors rounded-md";
    
    if (variant === "teacher") {
      return isActive 
        ? `${baseClasses} bg-indian-blue text-white` 
        : `${baseClasses} hover:bg-indian-blue/10 text-gray-700`;
    } else {
      return isActive 
        ? `${baseClasses} bg-indian-saffron text-white` 
        : `${baseClasses} hover:bg-indian-saffron/10 text-gray-700`;
    }
  };

  return (
    <nav className="max-w-none w-full mb-6 border-b pb-1">
      <ul className="space-x-2 flex flex-wrap">
        {items.map((item) => (
          <li key={item.id} className="inline-block">
            <button
              type="button" 
              onClick={(e) => {
                e.preventDefault();
                onTabChange(item.id);
              }}
              className={cn(getActiveStyles(activeTab === item.id))}
            >
              <item.icon className="w-4 h-4 mr-2" />
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default HorizontalNavigation;
