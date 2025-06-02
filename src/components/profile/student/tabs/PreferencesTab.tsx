
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface PreferencesTabProps {
  selectedSubjects: string[];
  setSelectedSubjects: (subjects: string[]) => void;
  studyPreferences: string[];
  setStudyPreferences: (preferences: string[]) => void;
  sessionFormat: string;
  setSessionFormat: (format: string) => void;
}

const SUBJECT_SUGGESTIONS = [
  "Mathematics", "Physics", "Chemistry", "Biology", 
  "English Literature", "Hindi", "Sanskrit", "History", 
  "Geography", "Computer Science", "Economics", 
  "Political Science", "Environmental Science", 
  "Art", "Music", "Physical Education"
];

const LEARNING_PREFERENCES = [
  "Visual Learning", "Auditory Learning", "Reading/Writing", "Kinesthetic Learning",
  "Group Study", "Individual Study", "Project-based Learning", "Problem-based Learning",
  "Live Classes", "Recorded Lessons", "Interactive Quizzes", "Practice Tests"
];

export function PreferencesTab({ 
  selectedSubjects, 
  setSelectedSubjects,
  studyPreferences,
  setStudyPreferences,
  sessionFormat,
  setSessionFormat
}: PreferencesTabProps) {
  
  const toggleSubject = (subject: string) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter(s => s !== subject));
    } else {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

  const togglePreference = (preference: string) => {
    if (studyPreferences.includes(preference)) {
      setStudyPreferences(studyPreferences.filter(p => p !== preference));
    } else {
      setStudyPreferences([...studyPreferences, preference]);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-2">Subjects of Interest</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Select subjects you're interested in learning. This helps us recommend relevant courses for you.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {SUBJECT_SUGGESTIONS.map((subject) => (
            <Button
              key={subject}
              type="button"
              variant={selectedSubjects.includes(subject) ? "default" : "outline"}
              className={`justify-start ${selectedSubjects.includes(subject) ? 'bg-primary text-primary-foreground' : ''}`}
              onClick={() => toggleSubject(subject)}
            >
              {selectedSubjects.includes(subject) && <Check className="mr-2 h-4 w-4" />}
              {subject}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">Learning Style Preferences</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Select your preferred learning methods to help us deliver content in ways that work best for you.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {LEARNING_PREFERENCES.map((preference) => (
            <Card 
              key={preference} 
              className={`cursor-pointer border-2 transition-colors ${studyPreferences.includes(preference) ? 'border-primary' : 'hover:border-muted-foreground/50'}`}
              onClick={() => togglePreference(preference)}
            >
              <CardContent className="p-4 flex items-start">
                <div className={`w-5 h-5 rounded-full mr-3 mt-0.5 flex items-center justify-center border-2 ${studyPreferences.includes(preference) ? 'bg-primary border-primary' : 'border-muted-foreground'}`}>
                  {studyPreferences.includes(preference) && (
                    <Check className="h-3 w-3 text-primary-foreground" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{preference}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">Session Format</h3>
        <p className="text-sm text-muted-foreground mb-4">
          What type of learning sessions do you prefer?
        </p>
        
        <RadioGroup value={sessionFormat} onValueChange={setSessionFormat}>
          <div className="flex flex-col space-y-3">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="one-on-one" id="one-on-one" />
              <Label htmlFor="one-on-one">One-on-one tutoring</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="group" id="group" />
              <Label htmlFor="group">Small group sessions (2-5 students)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="both" id="both" />
              <Label htmlFor="both">Comfortable with both formats</Label>
            </div>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}
