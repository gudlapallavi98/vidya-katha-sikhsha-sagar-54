
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { useUserProfile } from "@/hooks/use-profile-data";
import { Progress } from "@/components/ui/progress";
import { StudentProfileForm } from "./student/StudentProfileForm";
import { TeacherProfileForm } from "./teacher/TeacherProfileForm";

interface ProfileSettingsFormProps {
  role: "student" | "teacher";
  onCompleted?: () => void;
}

function ProfileSettingsForm({ role, onCompleted }: ProfileSettingsFormProps) {
  const [activeTab, setActiveTab] = useState("personal");
  const { data: profile, isLoading } = useUserProfile();
  const [progressPercentage, setProgressPercentage] = useState(0);

  // Calculate profile completion percentage
  useEffect(() => {
    if (profile) {
      // Define fields that should be filled for a complete profile
      const requiredFields = ["first_name", "last_name", "gender", "date_of_birth", "city", "country"];
      const teacherFields = ["experience", "intro_video_url"];
      const studentFields = ["education_level", "study_preferences"];
      
      // Add role-specific fields
      const allRequiredFields = role === "teacher" 
        ? [...requiredFields, ...teacherFields]
        : [...requiredFields, ...studentFields];
      
      // Count filled fields
      let filledFields = 0;
      allRequiredFields.forEach(field => {
        if (profile[field] && profile[field] !== "") {
          filledFields++;
        }
      });
      
      // Calculate percentage
      const percentage = Math.round((filledFields / allRequiredFields.length) * 100);
      setProgressPercentage(percentage);
    }
  }, [profile, role]);

  if (isLoading) {
    return <div className="p-6">Loading profile...</div>;
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium">Profile Completion</h3>
            <span className="text-sm font-semibold">{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
            <TabsTrigger value="personal">Personal Information</TabsTrigger>
            
            {role === "student" ? (
              <>
                <TabsTrigger value="education">Education</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
                <TabsTrigger value="exams">Exam History</TabsTrigger>
              </>
            ) : (
              <>
                <TabsTrigger value="experience">Teaching Experience</TabsTrigger>
                <TabsTrigger value="subjects">Subjects</TabsTrigger>
                <TabsTrigger value="certifications">Certifications</TabsTrigger>
              </>
            )}
          </TabsList>

          {role === "student" ? (
            <StudentProfileForm activeTab={activeTab} onCompleted={onCompleted} />
          ) : (
            <TeacherProfileForm activeTab={activeTab} onCompleted={onCompleted} />
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default ProfileSettingsForm;
