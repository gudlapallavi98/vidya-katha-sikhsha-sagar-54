
import { UseFormReturn } from "react-hook-form";
import BasicInfoSection from "./BasicInfoSection";
import LocationSection from "./LocationSection";
import BioSection from "./BioSection";
import SubjectsSection from "./SubjectsSection";
import TeacherSection from "./TeacherSection";

interface ProfileFormContentProps {
  form: UseFormReturn<any>;
  role: "student" | "teacher";
  selectedSubjects: string[];
  setSelectedSubjects: React.Dispatch<React.SetStateAction<string[]>>;
  certificates: string[];
  setCertificates: React.Dispatch<React.SetStateAction<string[]>>;
}

export function ProfileFormContent({
  form,
  role,
  selectedSubjects,
  setSelectedSubjects,
  certificates,
  setCertificates
}: ProfileFormContentProps) {
  return (
    <>
      <BasicInfoSection form={form} />
      <LocationSection form={form} />
      <BioSection form={form} />
      <SubjectsSection 
        selectedSubjects={selectedSubjects} 
        setSelectedSubjects={setSelectedSubjects} 
      />
      
      {role === "teacher" && (
        <TeacherSection 
          form={form} 
          certificates={certificates} 
          setCertificates={setCertificates} 
        />
      )}
    </>
  );
}
