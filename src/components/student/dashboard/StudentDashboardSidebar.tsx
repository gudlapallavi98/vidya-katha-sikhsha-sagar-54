
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  LayoutDashboard, 
  BookOpen, 
  Calendar, 
  MessageSquare, 
  CreditCard,
  Settings
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface StudentDashboardSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const StudentDashboardSidebar: React.FC<StudentDashboardSidebarProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const { user } = useAuth();

  const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "courses", label: "My Courses", icon: BookOpen },
    { id: "sessions", label: "Sessions", icon: Calendar },
    { id: "payments", label: "Payment History", icon: CreditCard },
    { id: "request-session", label: "Request Session", icon: MessageSquare },
    { id: "profile", label: "Profile Settings", icon: Settings },
  ];

  const handleTabClick = (tabId: string) => {
    console.log("StudentDashboard: Switching to tab:", tabId);
    setActiveTab(tabId);
  };

  // Get user initials for avatar fallback
  const getInitials = () => {
    if (user?.user_metadata?.first_name && user?.user_metadata?.last_name) {
      return `${user.user_metadata.first_name.charAt(0)}${user.user_metadata.last_name.charAt(0)}`;
    }
    return "S";
  };

  const getFirstName = () => {
    return user?.user_metadata?.first_name || "Student";
  };

  return (
    <aside className="h-full flex flex-col bg-white border-r border-gray-200 shadow-sm">
      {/* Personalized Header Section */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="relative group">
            <Avatar className="h-12 w-12 transition-all duration-200 group-hover:ring-2 group-hover:ring-[#FF9933] group-hover:ring-offset-2">
              <AvatarImage 
                src={user?.user_metadata?.avatar_url} 
                alt={getFirstName()}
              />
              <AvatarFallback className="bg-gradient-to-br from-orange-100 to-orange-200 text-[#FF9933] font-semibold text-lg">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-lg text-gray-900 leading-tight">
              Hi, {getFirstName()}! 👋
            </h2>
            <p className="text-sm text-gray-600">Welcome back</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isProfileSettings = item.id === 'profile';
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={`
                  w-full justify-start h-12 px-4 transition-all duration-200 rounded-xl
                  ${isActive 
                    ? 'bg-[#FF9933] text-white hover:bg-[#FF9933]/90 shadow-lg transform scale-[1.02]' 
                    : isProfileSettings
                      ? 'text-gray-700 hover:bg-[#E6F4EA] hover:text-[#138808] hover:shadow-[0_0_8px_rgba(19,136,8,0.2)] hover:scale-[1.02]'
                      : 'text-gray-700 hover:bg-[#138808]/10 hover:text-[#138808] hover:scale-[1.02]'
                  }
                `}
                onClick={() => handleTabClick(item.id)}
              >
                <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-white' : ''}`} />
                <span className="font-medium">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </nav>
    </aside>
  );
};

export default StudentDashboardSidebar;
