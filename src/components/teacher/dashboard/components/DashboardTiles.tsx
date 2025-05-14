
import React from "react";
import { Home, Settings } from "lucide-react";
import NavigationTile from "./NavigationTile";

interface DashboardTilesProps {
  activeTab: string;
}

const DashboardTiles: React.FC<DashboardTilesProps> = ({ activeTab }) => {
  // Simplified navigation items
  const navigationItems = [
    { 
      icon: Home, 
      label: "Dashboard", 
      path: "/teacher-dashboard?tab=overview"
    },
    { 
      icon: Settings, 
      label: "Profile", 
      path: "/teacher-dashboard?tab=profile"
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
      {navigationItems.map((item) => {
        const itemTab = new URLSearchParams(item.path.split('?')[1]).get('tab');
        const isActive = itemTab === activeTab;
        
        return (
          <NavigationTile
            key={item.path}
            icon={item.icon}
            label={item.label}
            path={item.path}
            isActive={isActive}
          />
        );
      })}
    </div>
  );
};

export default DashboardTiles;
