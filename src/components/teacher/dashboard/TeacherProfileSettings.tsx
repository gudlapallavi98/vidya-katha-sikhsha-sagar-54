
import React from "react";
import { useTabNavigation } from "@/hooks/use-tab-navigation";
import { TeacherProfileForm } from "@/components/profile/teacher/TeacherProfileForm";

const TeacherProfileSettings: React.FC = () => {
  const { activeTab, handleTabChange } = useTabNavigation("personal");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Profile Settings</h2>
        <p className="text-muted-foreground">Manage your teaching profile and preferences</p>
      </div>
      
      <TeacherProfileForm 
        activeTab={activeTab} 
        onTabChange={handleTabChange}
        onCompleted={() => {
          console.log("Profile update completed");
        }}
      />
    </div>
  );
};

export default TeacherProfileSettings;
