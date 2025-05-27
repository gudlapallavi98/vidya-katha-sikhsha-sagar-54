
import React from "react";
import { TeacherProfileForm } from "@/components/profile/teacher/TeacherProfileForm";

const TeacherProfileSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Profile Settings</h2>
        <p className="text-muted-foreground">Manage your teaching profile and preferences</p>
      </div>
      
      <TeacherProfileForm />
    </div>
  );
};

export default TeacherProfileSettings;
