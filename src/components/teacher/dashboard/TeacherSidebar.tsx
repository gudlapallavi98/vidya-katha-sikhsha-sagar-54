
import { User } from "lucide-react";

interface TeacherSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TeacherSidebar = ({ activeTab, setActiveTab }: TeacherSidebarProps) => {
  return (
    <div className="w-full md:w-1/4 bg-white rounded-lg border shadow-sm p-6 sticky top-20 mb-6 md:mb-0">
      <div className="flex flex-col items-center mb-6">
        <div className="w-20 h-20 bg-gradient-to-br from-indian-blue to-indian-blue/60 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
          TE
        </div>
        <h2 className="text-xl font-medium">Teacher</h2>
        <p className="text-muted-foreground text-sm mt-2">
          Use the floating menu to navigate
        </p>
      </div>
    </div>
  );
};

export default TeacherSidebar;
