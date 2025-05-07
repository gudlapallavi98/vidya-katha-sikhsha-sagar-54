
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useProfileFormData } from "../hooks/useProfileFormData";

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
  education_level: z.string().optional(),
  school_name: z.string().optional(),
  grade_level: z.string().optional(),
  study_preferences: z.array(z.string()).optional(),
  subjects_interested: z.array(z.string()).optional(),
  exam_history: z.array(z.object({
    name: z.string(),
    date: z.string(),
    score: z.string()
  })).optional(),
  avatar_url: z.string().optional(),
});

interface StudentProfileFormProps {
  activeTab: string;
  onCompleted?: () => void;
}

export function StudentProfileForm({ activeTab, onCompleted }: StudentProfileFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [examHistory, setExamHistory] = useState<{name: string, date: string, score: string}[]>([]);
  const [studyPreferences, setStudyPreferences] = useState<string[]>([]);
  
  const {
    form, 
    selectedSubjects, 
    setSelectedSubjects, 
    avatarUrl, 
    setAvatarUrl
  } = useProfileFormData(formSchema);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // Format date_of_birth to ISO string if it exists
      const formattedData = {
        first_name: values.first_name,
        last_name: values.last_name,
        display_name: values.display_name,
        gender: values.gender,
        date_of_birth: values.date_of_birth ? values.date_of_birth.toISOString().split('T')[0] : null,
        city: values.city,
        state: values.state,
        country: values.country,
        bio: values.bio,
        education_level: values.education_level,
        school_name: values.school_name,
        grade_level: values.grade_level,
        study_preferences: studyPreferences,
        subjects_interested: selectedSubjects,
        exam_history: examHistory,
        avatar_url: avatarUrl,
        profile_completed: true,
        updated_at: new Date().toISOString(),
      };

      // Update profile with formatted values
      const { error } = await supabase
        .from("profiles")
        .update(formattedData)
        .eq("id", user.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
      
      if (onCompleted) {
        onCompleted();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
      });
      console.error("Profile update error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Saving..." : "Save Profile"}
        </Button>
      </form>
    </Form>
  );
}
