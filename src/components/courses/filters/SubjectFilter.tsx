
import { Checkbox } from "@/components/ui/checkbox";

interface SubjectFilterProps {
  subjects: string[];
  selectedSubjects: string[];
  handleSubjectChange: (subject: string) => void;
}

const SubjectFilter = ({ subjects, selectedSubjects, handleSubjectChange }: SubjectFilterProps) => {
  return (
    <div>
      <h3 className="font-medium mb-4">Subjects</h3>
      <div className="space-y-2">
        {subjects.map((subject) => (
          <div key={subject} className="flex items-center space-x-2">
            <Checkbox 
              id={`subject-${subject}`} 
              checked={selectedSubjects.includes(subject)}
              onCheckedChange={() => handleSubjectChange(subject)}
            />
            <label
              htmlFor={`subject-${subject}`}
              className="text-sm cursor-pointer"
            >
              {subject}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubjectFilter;
