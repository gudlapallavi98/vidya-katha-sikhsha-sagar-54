
interface StudentSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  firstName?: string;
  lastName?: string;
}

const StudentSidebar: React.FC<StudentSidebarProps> = ({
  firstName,
  lastName,
}) => {
  return (
    <div className="bg-white rounded-lg border shadow-sm p-6 sticky top-20">
      <div className="flex flex-col items-center mb-6">
        <div className="w-20 h-20 bg-gradient-to-br from-indian-saffron to-indian-saffron/60 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
          {firstName && lastName
            ? `${firstName.charAt(0)}${lastName.charAt(0)}`
            : "ST"}
        </div>
        <h2 className="text-xl font-medium">
          {firstName && lastName ? `${firstName} ${lastName}` : "Student"}
        </h2>
        <p className="text-muted-foreground text-sm mt-2">
          Use the floating menu to navigate
        </p>
      </div>
    </div>
  );
};

export default StudentSidebar;
