
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Calendar, 
  MessageSquare,
  Settings
} from "lucide-react";

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  firstName?: string;
  lastName?: string;
}

const AdminSidebar = ({ 
  activeTab, 
  setActiveTab,
  firstName,
  lastName
}: AdminSidebarProps) => {
  const menuItems = [
    { id: "overview", label: "Overview", icon: <LayoutDashboard className="h-5 w-5" /> },
    { id: "users", label: "Users", icon: <Users className="h-5 w-5" /> },
    { id: "courses", label: "Courses", icon: <BookOpen className="h-5 w-5" /> },
    { id: "sessions", label: "Sessions", icon: <Calendar className="h-5 w-5" /> },
    { id: "requests", label: "Session Requests", icon: <MessageSquare className="h-5 w-5" /> },
    { id: "settings", label: "Settings", icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <div className="bg-card rounded-lg shadow-sm border p-4">
      <div className="mb-6 pb-4 border-b">
        <h2 className="font-sanskrit text-xl font-medium">Admin Dashboard</h2>
        {firstName && lastName && (
          <p className="text-sm text-muted-foreground mt-1">
            Welcome, {firstName} {lastName}
          </p>
        )}
      </div>
      
      <nav>
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-3 py-2 rounded-md text-sm ${
                  activeTab === item.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;
