
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { FormLabel } from "@/components/ui/form";

interface Subject {
  id: string;
  name: string;
  category: string;
}

interface SubjectsSectionProps {
  selectedSubjects: string[];
  setSelectedSubjects: (subjects: string[]) => void;
}

const SubjectsSection = ({ selectedSubjects, setSelectedSubjects }: SubjectsSectionProps) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const { toast } = useToast();

  // Fetch subjects
  useEffect(() => {
    const fetchSubjects = async () => {
      const { data, error } = await supabase
        .from("subjects")
        .select("*")
        .order("name");

      if (error) {
        console.error("Error fetching subjects:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load subjects. Please try again later.",
        });
        return;
      }

      if (data) {
        setSubjects(data);
      }
    };

    fetchSubjects();
  }, [toast]);

  const handleSubjectToggle = (subjectName: string) => {
    setSelectedSubjects(
      selectedSubjects.includes(subjectName)
        ? selectedSubjects.filter((s) => s !== subjectName)
        : [...selectedSubjects, subjectName]
    );
  };

  return (
    <div className="space-y-2">
      <FormLabel>Subjects Interested</FormLabel>
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {subjects.map((subject) => (
              <div key={subject.id} className="flex items-center space-x-2">
                <Checkbox
                  id={subject.id}
                  checked={selectedSubjects.includes(subject.name)}
                  onCheckedChange={() => handleSubjectToggle(subject.name)}
                />
                <label
                  htmlFor={subject.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {subject.name}
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubjectsSection;
