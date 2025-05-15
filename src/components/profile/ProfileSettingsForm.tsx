import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

        <div>
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
            <TabsTrigger 
              value="personal" 
              onClick={() => setActiveTab("personal")}
              className={activeTab === "personal" ? "data-[state=active]" : ""}
            >
              Personal Information
            </TabsTrigger>
            
            {role === "student" ? (
              <>
                <TabsTrigger 
                  value="education" 
                  onClick={() => setActiveTab("education")}
                  className={activeTab === "education" ? "data-[state=active]" : ""}
                >
                  Education
                </TabsTrigger>
                <TabsTrigger 
                  value="preferences" 
                  onClick={() => setActiveTab("preferences")}
                  className={activeTab === "preferences" ? "data-[state=active]" : ""}
                >
                  Preferences
                </TabsTrigger>
                <TabsTrigger 
                  value="exams" 
                  onClick={() => setActiveTab("exams")}
                  className={activeTab === "exams" ? "data-[state=active]" : ""}
                >
                  Exam History
                </TabsTrigger>
              </>
            ) : (
              <>
                <TabsTrigger 
                  value="experience" 
                  onClick={() => setActiveTab("experience")}
                  className={activeTab === "experience" ? "data-[state=active]" : ""}
                >
                  Teaching Experience
                </TabsTrigger>
                <TabsTrigger 
                  value="subjects" 
                  onClick={() => setActiveTab("subjects")}
                  className={activeTab === "subjects" ? "data-[state=active]" : ""}
                >
                  Subjects
                </TabsTrigger>
                <TabsTrigger 
                  value="certifications" 
                  onClick={() => setActiveTab("certifications")}
                  className={activeTab === "certifications" ? "data-[state=active]" : ""}
                >
                  Certifications
                </TabsTrigger>
              </>
            )}
          </TabsList>

          {role === "student" ? (
            <StudentProfileForm activeTab={activeTab} onCompleted={onCompleted} />
          ) : (
            <TeacherProfileForm activeTab={activeTab} onCompleted={onCompleted} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default ProfileSettingsForm;
