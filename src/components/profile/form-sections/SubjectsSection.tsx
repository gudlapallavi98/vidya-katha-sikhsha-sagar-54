
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SubjectsSectionProps {
  selectedSubjects: string[];
  setSelectedSubjects: React.Dispatch<React.SetStateAction<string[]>>;
}

// Expanded list of subjects
const subjectOptions = [
  // Sanskrit Language and Literature
  "Sanskrit Grammar (Vyākaraṇa)",
  "Sanskrit Conversation",
  "Sanskrit Poetry (Kāvya)",
  "Sanskrit Prose (Gadya)",
  "Sanskrit Drama (Nāṭaka)",
  "Sanskrit Literature Survey",
  "Vedic Sanskrit",
  
  // Vedic Studies
  "Rigveda",
  "Yajurveda",
  "Samaveda",
  "Atharvaveda",
  "Vedānta",
  "Upaniṣads",
  "Vedic Rituals",
  "Vedic Chanting",
  
  // Philosophical Systems
  "Advaita Vedānta",
  "Dvaita Vedānta",
  "Viśiṣṭādvaita",
  "Sāṅkhya Philosophy",
  "Yoga Philosophy",
  "Nyāya Logic",
  "Vaiśeṣika",
  "Mīmāṃsā",
  "Buddhist Philosophy",
  "Jain Philosophy",
  
  // Yoga and Meditation
  "Haṭha Yoga",
  "Aṣṭāṅga Yoga",
  "Yoga Sūtras of Patañjali",
  "Meditation Techniques",
  "Prāṇāyāma",
  "Yoga for Health",
  "Yogic Philosophy",
  
  // Ayurveda
  "Ayurvedic Principles",
  "Ayurvedic Herbs",
  "Ayurvedic Nutrition",
  "Ayurvedic Lifestyle",
  "Ayurvedic Diagnosis",
  
  // Traditional Arts
  "Indian Classical Dance",
  "Indian Classical Music",
  "Sacred Geometry",
  "Temple Architecture",
  "Iconography",
  "Ritual Arts",
  
  // Historical and Cultural Studies
  "Ancient Indian History",
  "Cultural Heritage of India",
  "Indian Festivals",
  "Indian Mythology",
  
  // Epics and Texts
  "Bhagavad Gītā",
  "Rāmāyaṇa",
  "Mahābhārata",
  "Purāṇas",
  "Dharmaśāstras",
  
  // Modern Applications
  "Sanskrit and Computational Linguistics",
  "Sanskrit and Modern Science",
  "Sanskrit and Wellness"
];

const SubjectsSection = ({ selectedSubjects, setSelectedSubjects }: SubjectsSectionProps) => {
  const [selectedSubject, setSelectedSubject] = React.useState("");

  const handleAddSubject = () => {
    if (selectedSubject && !selectedSubjects.includes(selectedSubject)) {
      setSelectedSubjects([...selectedSubjects, selectedSubject]);
      setSelectedSubject("");
    }
  };

  const handleRemoveSubject = (subject: string) => {
    setSelectedSubjects(selectedSubjects.filter((s) => s !== subject));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Subjects Interested</h3>

      <div className="flex flex-wrap gap-2 mb-4">
        {selectedSubjects.map((subject) => (
          <Badge key={subject} variant="secondary" className="px-3 py-1.5 text-sm">
            {subject}
            <button
              type="button"
              onClick={() => handleRemoveSubject(subject)}
              className="ml-2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        {selectedSubjects.length === 0 && (
          <div className="text-sm text-muted-foreground">No subjects selected</div>
        )}
      </div>

      <div className="flex gap-2">
        <div className="flex-1">
          <Select
            value={selectedSubject}
            onValueChange={setSelectedSubject}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a subject" />
            </SelectTrigger>
            <SelectContent>
              {subjectOptions.map((subject) => (
                <SelectItem
                  key={subject}
                  value={subject}
                  disabled={selectedSubjects.includes(subject)}
                >
                  {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button type="button" onClick={handleAddSubject} disabled={!selectedSubject}>
          Add
        </Button>
      </div>
    </div>
  );
};

export default SubjectsSection;
