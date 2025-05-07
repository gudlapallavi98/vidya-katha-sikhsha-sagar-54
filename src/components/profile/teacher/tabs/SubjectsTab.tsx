
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface SubjectsTabProps {
  selectedSubjects: string[];
  setSelectedSubjects: (subjects: string[]) => void;
}

const SUBJECT_SUGGESTIONS = [
  "Mathematics", "Physics", "Chemistry", "Biology", 
  "English Literature", "Hindi", "Sanskrit", "History", 
  "Geography", "Computer Science", "Economics", 
  "Political Science", "Environmental Science", 
  "Art", "Music", "Physical Education"
];

export function SubjectsTab({ selectedSubjects, setSelectedSubjects }: SubjectsTabProps) {
  const [subjectInput, setSubjectInput] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

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
      setSelectedSubjects([...selectedSubjects, subject]);
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
          {["Mathematics", "Science", "Languages", "Humanities", "Arts", "Computer Science"].map((category) => (
            <Button 
              key={category} 
              variant="outline" 
              size="sm" 
              type="button"
              onClick={() => {
                // This would ideally open a selection of subjects in this category
                // For now, we'll just add the category
                if (!selectedSubjects.includes(category)) {
                  setSelectedSubjects([...selectedSubjects, category]);
                }
              }}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
