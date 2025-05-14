
import React from "react";
import { 
  Home, 
  BookOpen, 
  Calendar, 
  Clock, 
  MessageSquare, 
  Settings 
} from "lucide-react";
import NavigationTile from "./NavigationTile";

interface DashboardTilesProps {
  activeTab: string;
}

const DashboardTiles: React.FC<DashboardTilesProps> = ({ activeTab }) => {
  const navigationItems = [
    { 
      icon: Home, 
      label: "Overview", 
      path: "/teacher-dashboard?tab=overview"
    },
    { 
      icon: BookOpen, 
      label: "Courses", 
      path: "/teacher-dashboard?tab=courses"
    },
    { 
      icon: Calendar, 
      label: "Session Requests", 
      path: "/teacher-dashboard?tab=sessions"
    },
    { 
      icon: Clock, 
      label: "Schedule", 
      path: "/teacher-dashboard?tab=schedule"
    },
    { 
      icon: MessageSquare, 
      label: "Availability", 
      path: "/teacher-dashboard?tab=availability"
    },
    { 
      icon: Settings, 
      label: "Profile", 
      path: "/teacher-dashboard?tab=profile"
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
