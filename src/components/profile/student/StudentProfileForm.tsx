
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent } from "@/components/ui/tabs";
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
  const [studyPreferences, setStudyPreferences] = useState<string[]>([]);
  const [examHistory, setExamHistory] = useState<{name: string, date: string, score: string}[]>([]);
  
  const {
    form, 
    selectedSubjects, 
    setSelectedSubjects, 
    avatarUrl, 
    setAvatarUrl
  } = useProfileFormData(formSchema);
  
  const updateProfile = useUpdateProfile();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) return;
    
    setIsLoading(true);
    console.log("Submitting student profile form with values:", values);
    
    try {
      // Format date_of_birth to ISO string if it exists
      const formattedData = {
        first_name: values.first_name,
        last_name: values.last_name,
        display_name: values.display_name,
        gender: values.gender,
        date_of_birth: values.date_of_birth ? values.date_of_birth.toISOString().split('T')[0] : undefined,
        city: values.city,
        state: values.state,
        country: values.country,
        bio: values.bio,
        subjects_interested: selectedSubjects,
        avatar_url: avatarUrl,
        profile_completed: true,
        updated_at: new Date().toISOString(),
        education_level: values.education_level,
        study_preferences: studyPreferences,
        exam_history: examHistory.length > 0 ? examHistory : undefined,
        school_name: values.school_name,
        grade_level: values.grade_level
      };

      console.log("Formatted data for student profile:", formattedData);
      await updateProfile.mutateAsync(formattedData);
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated."
      });
      
      if (onCompleted) {
        onCompleted();
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs value={activeTab}>
          <TabsContent value="personal">
            <PersonalInfoTab 
              form={form} 
              avatarUrl={avatarUrl} 
              setAvatarUrl={setAvatarUrl} 
              userId={user?.id || ""}
            />
          </TabsContent>

          <TabsContent value="education">
            <EducationTab form={form} />
          </TabsContent>

          <TabsContent value="preferences">
            <PreferencesTab 
              selectedSubjects={selectedSubjects} 
              setSelectedSubjects={setSelectedSubjects} 
              studyPreferences={studyPreferences}
              setStudyPreferences={setStudyPreferences}
            />
          </TabsContent>

          <TabsContent value="exams">
            <ExamsTab 
              examHistory={examHistory} 
              setExamHistory={setExamHistory} 
            />
          </TabsContent>
        </Tabs>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Saving..." : "Save Profile"}
        </Button>
      </form>
    </Form>
  );
}
