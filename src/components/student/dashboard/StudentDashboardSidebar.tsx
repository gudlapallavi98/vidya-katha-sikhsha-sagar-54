
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  BookOpen, 
  Calendar, 
  MessageSquare, 
  CreditCard,
  Settings,
  HelpCircle
} from "lucide-react";

interface StudentDashboardSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const StudentDashboardSidebar: React.FC<StudentDashboardSidebarProps> = ({
  activeTab,
  setActiveTab,
}) => {
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

  return (
    <aside className="h-full flex flex-col bg-white border-r border-gray-200 shadow-sm">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-100">
        <h2 className="font-sanskrit text-xl font-bold text-gray-900">
          EduPlatform
        </h2>
        <p className="text-sm text-gray-600 mt-1">Student Portal</p>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={`w-full justify-start h-12 px-4 transition-all duration-200 ${
                  isActive 
                    ? 'bg-[#FF9933] text-white hover:bg-[#FF9933]/90 shadow-md' 
                    : 'text-gray-700 hover:bg-[#138808]/10 hover:text-[#138808]'
                }`}
                onClick={() => handleTabClick(item.id)}
              >
                <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-white' : ''}`} />
                <span className="font-medium">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </nav>

      {/* Help Section */}
      <div className="p-4 border-t border-gray-100">
        <Button
          variant="outline"
          className="w-full justify-start h-10 text-[#000080] border-[#000080]/20 hover:bg-[#000080]/5"
        >
          <HelpCircle className="mr-2 h-4 w-4" />
          Help & Support
        </Button>
      </div>
    </aside>
  );
};

export default StudentDashboardSidebar;
