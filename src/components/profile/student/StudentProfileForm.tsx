import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useProfileFormData } from "../hooks/useProfileFormData";
import { useUpdateProfile } from "@/hooks/use-profile-data";
import { useToast } from "@/hooks/use-toast";

// Tab contents
import { PersonalInfoTab } from "./tabs/PersonalInfoTab";
import { EducationTab } from "./tabs/EducationTab";
import { PreferencesTab } from "./tabs/PreferencesTab";
import { ExamsTab } from "./tabs/ExamsTab";

// Schema definition
const formSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  display_name: z.string().optional(),
  gender: z.string().optional(),
  date_of_birth: z.date().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  bio: z.string().optional(),
  avatar_url: z.string().optional(),
  education_level: z.string().optional(),
  school_name: z.string().optional(),
  grade_level: z.string().optional(),
});

interface StudentProfileFormProps {
  activeTab: string;
  onCompleted?: () => void;
}

export function StudentProfileForm({ activeTab, onCompleted }: StudentProfileFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    form, 
    selectedSubjects, 
    setSelectedSubjects, 
    avatarUrl, 
    setAvatarUrl,
    studyPreferences,
    setStudyPreferences,
    examHistory,
    setExamHistory
  } = useProfileFormData(formSchema);
  
  const updateProfile = useUpdateProfile();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please log in to update your profile.",
      });
      return;
    }
    
    setIsLoading(true);
    console.log("Submitting student profile form with values:", values);
    console.log("Study preferences:", studyPreferences);
    console.log("Exam history:", examHistory);
    
    try {
      const formattedData = {
        first_name: values.first_name,
        last_name: values.last_name,
        display_name: values.display_name || null,
        gender: values.gender || null,
        date_of_birth: values.date_of_birth || null,
        city: values.city || null,
        state: values.state || null,
        country: values.country || null,
        bio: values.bio || null,
        subjects_interested: selectedSubjects.length > 0 ? selectedSubjects : null,
        avatar_url: avatarUrl || null,
        profile_completed: true,
        updated_at: new Date().toISOString(),
        education_level: values.education_level || null,
        study_preferences: studyPreferences.length > 0 ? studyPreferences : [],
        exam_history: examHistory.length > 0 ? examHistory : [],
        school_name: values.school_name || null,
        grade_level: values.grade_level || null
      };

      console.log("Formatted data for student profile:", formattedData);
      
      // Filter out null values to avoid overwriting with null, but keep empty arrays
      const filteredData = Object.entries(formattedData)
        .filter(([_, value]) => value !== null && value !== undefined && value !== '')
        .reduce((obj: any, [key, value]) => {
          obj[key] = value;
          return obj;
        }, {});

      console.log("Filtered data for update:", filteredData);

      await updateProfile.mutateAsync(filteredData);
      
      if (onCompleted) {
        onCompleted();
      }
    } catch (error) {
      console.error("Profile update error:", error);
      // The error is already handled by the useUpdateProfile hook
    } finally {
      setIsLoading(false);
    }
  };

  // Use conditional rendering based on activeTab
  const renderActiveTabContent = () => {
    switch(activeTab) {
      case "personal":
        return (
          <div className="space-y-6">
            <PersonalInfoTab 
              form={form} 
              avatarUrl={avatarUrl} 
              setAvatarUrl={setAvatarUrl} 
              userId={user?.id || ""}
            />
          </div>
        );
      case "education":
        return (
          <div className="space-y-6">
            <EducationTab form={form} />
          </div>
        );
      case "preferences":
        return (
          <div className="space-y-6">
            <PreferencesTab 
              selectedSubjects={selectedSubjects} 
              setSelectedSubjects={setSelectedSubjects} 
              studyPreferences={studyPreferences}
              setStudyPreferences={setStudyPreferences}
            />
          </div>
        );
      case "exams":
        return (
          <div className="space-y-6">
            <ExamsTab 
              examHistory={examHistory} 
              setExamHistory={setExamHistory} 
            />
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            <PersonalInfoTab 
              form={form} 
              avatarUrl={avatarUrl} 
              setAvatarUrl={setAvatarUrl} 
              userId={user?.id || ""}
            />
          </div>
        );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {renderActiveTabContent()}

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Saving..." : "Save Profile"}
        </Button>
      </form>
    </Form>
  );
}
