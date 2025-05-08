
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SubjectsTabProps {
  selectedSubjects: string[];
  setSelectedSubjects: (subjects: string[]) => void;
}

const SUBJECT_SUGGESTIONS = [
  "Mathematics", "Physics", "Chemistry", "Biology", 
  "English Literature", "Hindi", "Sanskrit", "History", 
  "Geography", "Computer Science", "Economics", 
  "Political Science", "Environmental Science", 
  "Art", "Music", "Physical Education",
  // Sanskrit and Vedic studies
  "Sanskrit Grammar", "Vedic Sanskrit", "Rigveda",
  "Yajurveda", "Upaniṣads", "Vedānta",
  "Yoga Philosophy", "Ayurvedic Principles"
];

export function SubjectsTab({ selectedSubjects, setSelectedSubjects }: SubjectsTabProps) {
  const [subjectInput, setSubjectInput] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [isUpdatingSubjects, setIsUpdatingSubjects] = useState(false);
  const { toast } = useToast();

  // Function to ensure subjects are in Supabase subjects table
  const ensureSubjectsInDatabase = async (subjects: string[]) => {
    if (!subjects.length) return;
    
    try {
      setIsUpdatingSubjects(true);
      
      // For each subject, check if it exists and insert if not
      for (const subjectName of subjects) {
        // Check if subject exists
        const { data: existingSubjects } = await supabase
          .from('subjects')
          .select('id, name')
          .eq('name', subjectName);
          
        if (!existingSubjects || existingSubjects.length === 0) {
          // If not exists, insert it
          await supabase
            .from('subjects')
            .insert({ name: subjectName });
        }
      }
    } catch (error) {
      console.error("Error ensuring subjects in database:", error);
    } finally {
      setIsUpdatingSubjects(false);
    }
  };

  // When selected subjects change, ensure they exist in the database
  useEffect(() => {
    ensureSubjectsInDatabase(selectedSubjects);
  }, [selectedSubjects]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setSubjectInput(input);
    
    if (input.trim() === "") {
      setFilteredSuggestions([]);
    } else {
      const filtered = SUBJECT_SUGGESTIONS.filter(subject => 
        subject.toLowerCase().includes(input.toLowerCase()) && 
        !selectedSubjects.includes(subject)
      ).slice(0, 5); // Show max 5 suggestions
      setFilteredSuggestions(filtered);
    }
  };

  const addSubject = (subject: string) => {
    if (subject.trim() && !selectedSubjects.includes(subject)) {
      const newSubjects = [...selectedSubjects, subject];
      setSelectedSubjects(newSubjects);
      setSubjectInput("");
      setFilteredSuggestions([]);
    }
  };

  const removeSubject = (subjectToRemove: string) => {
    setSelectedSubjects(selectedSubjects.filter(subject => subject !== subjectToRemove));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Subjects You Teach</h3>
      <p className="text-sm text-muted-foreground">
        Add the subjects you specialize in teaching. This helps match you with students looking for tutors in these subjects.
      </p>

      <div className="space-y-2">
        <div className="relative">
          <div className="flex gap-2">
            <Input
              value={subjectInput}
              onChange={handleInputChange}
              placeholder="Type a subject and press Enter..."
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSubject(subjectInput);
                }
              }}
            />
            <Button 
              type="button" 
              onClick={() => addSubject(subjectInput)}
              disabled={isUpdatingSubjects}
            >
              Add
            </Button>
          </div>
          
          {filteredSuggestions.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
              {filteredSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="px-4 py-2 hover:bg-accent cursor-pointer"
                  onClick={() => addSubject(suggestion)}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {selectedSubjects.length === 0 ? (
            <p className="text-sm text-muted-foreground">No subjects added yet.</p>
          ) : (
            selectedSubjects.map((subject, index) => (
              <Badge key={index} variant="secondary" className="py-1.5">
                {subject}
                <button 
                  type="button" 
                  onClick={() => removeSubject(subject)} 
                  className="ml-2 text-muted-foreground hover:text-foreground"
                  disabled={isUpdatingSubjects}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))
          )}
        </div>
      </div>

      <div className="bg-muted rounded-md p-4 mt-6">
        <h4 className="font-medium mb-2">Popular Subject Categories</h4>
        <div className="flex flex-wrap gap-2">
          {["Mathematics", "Science", "Languages", "Humanities", "Arts", "Computer Science", "Sanskrit", "Yoga"].map((category) => (
            <Button 
              key={category} 
              variant="outline" 
              size="sm" 
              type="button"
              onClick={() => {
                if (!selectedSubjects.includes(category)) {
                  setSelectedSubjects([...selectedSubjects, category]);
                }
              }}
              disabled={isUpdatingSubjects || selectedSubjects.includes(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
