
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
  const { data: profile, isLoading, error } = useUserProfile();
  const [progressPercentage, setProgressPercentage] = useState(0);

  console.log("Profile data in ProfileSettingsForm:", profile);
  console.log("Loading state:", isLoading);
  console.log("Error state:", error);

  // Calculate profile completion percentage
  useEffect(() => {
    if (profile) {
      console.log("Calculating progress for profile:", profile);
      
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
        const value = profile[field];
        if (value && value !== "" && (Array.isArray(value) ? value.length > 0 : true)) {
          filledFields++;
        }
      });
      
      // Calculate percentage
      const percentage = Math.round((filledFields / allRequiredFields.length) * 100);
      setProgressPercentage(percentage);
      console.log(`Profile completion: ${filledFields}/${allRequiredFields.length} = ${percentage}%`);
    }
  }, [profile, role]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading profile...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            Error loading profile: {error.message}
          </div>
        </CardContent>
      </Card>
    );
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
            <TabsTrigger value="personal">
              Personal Information
            </TabsTrigger>
            
            {role === "student" ? (
              <>
                <TabsTrigger value="education">
                  Education
                </TabsTrigger>
                <TabsTrigger value="preferences">
                  Learning Preferences
                </TabsTrigger>
                <TabsTrigger value="academic">
                  Academic History
                </TabsTrigger>
              </>
            ) : (
              <>
                <TabsTrigger value="experience">
                  Teaching Experience
                </TabsTrigger>
                <TabsTrigger value="subjects">
                  Subjects
                </TabsTrigger>
                <TabsTrigger value="certifications">
                  Certifications
                </TabsTrigger>
              </>
            )}
          </TabsList>

          <TabsContent value="personal">
            {role === "student" ? (
              <StudentProfileForm activeTab="personal" onCompleted={onCompleted} />
            ) : (
              <TeacherProfileForm activeTab="personal" onCompleted={onCompleted} />
            )}
          </TabsContent>

          {role === "student" ? (
            <>
              <TabsContent value="education">
                <StudentProfileForm activeTab="education" onCompleted={onCompleted} />
              </TabsContent>
              <TabsContent value="preferences">
                <StudentProfileForm activeTab="preferences" onCompleted={onCompleted} />
              </TabsContent>
              <TabsContent value="academic">
                <StudentProfileForm activeTab="exams" onCompleted={onCompleted} />
              </TabsContent>
            </>
          ) : (
            <>
              <TabsContent value="experience">
                <TeacherProfileForm activeTab="experience" onCompleted={onCompleted} />
              </TabsContent>
              <TabsContent value="subjects">
                <TeacherProfileForm activeTab="subjects" onCompleted={onCompleted} />
              </TabsContent>
              <TabsContent value="certifications">
                <TeacherProfileForm activeTab="certifications" onCompleted={onCompleted} />
              </TabsContent>
            </>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default ProfileSettingsForm;
