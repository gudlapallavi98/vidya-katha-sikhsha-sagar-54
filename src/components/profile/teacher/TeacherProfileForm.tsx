
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useProfileFormData } from "../hooks/useProfileFormData";
import { useUpdateProfile } from "@/hooks/use-profile-data";

// Tab contents
import { PersonalInfoTab } from "./tabs/PersonalInfoTab";
import { TeachingExperienceTab } from "./tabs/TeachingExperienceTab";
import { SubjectsTab } from "./tabs/SubjectsTab";
import { CertificationsTab } from "./tabs/CertificationsTab";

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
  experience: z.string().optional(),
  years_of_experience: z.string().optional(),
  intro_video_url: z.string().url().optional().or(z.literal("")),
  subjects_interested: z.array(z.string()).optional(),
  avatar_url: z.string().optional(),
});

interface TeacherProfileFormProps {
  activeTab: string;
  onCompleted?: () => void;
}

export function TeacherProfileForm({ activeTab, onCompleted }: TeacherProfileFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    form, 
    selectedSubjects, 
    setSelectedSubjects, 
    certificates, 
    setCertificates, 
    avatarUrl, 
    setAvatarUrl
  } = useProfileFormData(formSchema);
  
  const updateProfile = useUpdateProfile();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) return;
    
    setIsLoading(true);
    console.log("Submitting teacher profile form with values:", values);
    
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
        experience: values.experience,
        years_of_experience: values.years_of_experience,
        intro_video_url: values.intro_video_url,
        subjects_interested: selectedSubjects,
        certificates: certificates,
        avatar_url: avatarUrl,
        profile_completed: true,
        updated_at: new Date().toISOString(),
      };

      console.log("Formatted data for teacher profile:", formattedData);
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
        <TabsContent value="personal">
          <PersonalInfoTab 
            form={form} 
            avatarUrl={avatarUrl} 
            setAvatarUrl={setAvatarUrl} 
            userId={user?.id || ""}
          />
        </TabsContent>

        <TabsContent value="experience">
          <TeachingExperienceTab form={form} />
        </TabsContent>

        <TabsContent value="subjects">
          <SubjectsTab 
            selectedSubjects={selectedSubjects} 
            setSelectedSubjects={setSelectedSubjects} 
          />
        </TabsContent>

        <TabsContent value="certifications">
          <CertificationsTab 
            certificates={certificates} 
            setCertificates={setCertificates} 
            userId={user?.id || ""}
          />
        </TabsContent>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Saving..." : "Save Profile"}
        </Button>
      </form>
    </Form>
  );
}
