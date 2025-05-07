
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { X, Plus } from "lucide-react";
import { format } from "date-fns";

interface ExamsTabProps {
  examHistory: {name: string, date: string, score: string}[];
  setExamHistory: (history: {name: string, date: string, score: string}[]) => void;
}

export function ExamsTab({ examHistory, setExamHistory }: ExamsTabProps) {
  const [newExam, setNewExam] = useState({ name: "", date: "", score: "" });
  const [isAddingExam, setIsAddingExam] = useState(false);

  const handleExamInputChange = (field: 'name' | 'date' | 'score', value: string) => {
    setNewExam({ ...newExam, [field]: value });
  };

  const addExam = () => {
    if (newExam.name && newExam.date) {
      setExamHistory([...examHistory, newExam]);
      setNewExam({ name: "", date: "", score: "" });
      setIsAddingExam(false);
    }
  };

  const removeExam = (index: number) => {
    const updatedHistory = [...examHistory];
    updatedHistory.splice(index, 1);
    setExamHistory(updatedHistory);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'PPP');
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Exam History</h3>
          <p className="text-sm text-muted-foreground">
            Record your past exam scores to help track your progress and identify areas for improvement.
          </p>
        </div>
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsAddingExam(true)}
          disabled={isAddingExam}
        >
          <Plus className="h-4 w-4 mr-1" /> Add Exam
        </Button>
      </div>

      {isAddingExam && (
        <div className="bg-muted p-4 rounded-md space-y-4">
          <h4 className="font-medium">Add New Exam</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Exam Name</label>
              <Input 
                value={newExam.name}
                onChange={(e) => handleExamInputChange('name', e.target.value)}
                placeholder="CBSE, JEE, NEET, etc."
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Date</label>
              <Input 
                type="date"
                value={newExam.date}
                onChange={(e) => handleExamInputChange('date', e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Score/Grade/Percentile</label>
              <Input 
                value={newExam.score}
                onChange={(e) => handleExamInputChange('score', e.target.value)}
                placeholder="85%, A, 95 percentile"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setIsAddingExam(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={addExam}>
              Save Exam
            </Button>
          </div>
        </div>
      )}

      {examHistory.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Exam Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Score/Grade</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {examHistory.map((exam, index) => (
              <TableRow key={index}>
                <TableCell>{exam.name}</TableCell>
                <TableCell>{formatDate(exam.date)}</TableCell>
                <TableCell>{exam.score}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => removeExam(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center py-8 border-2 border-dashed rounded-md">
          <p className="text-muted-foreground">No exam history recorded yet.</p>
        </div>
      )}
      
      <div className="bg-muted p-4 rounded-md">
        <h4 className="font-medium mb-2">Why track your exam history?</h4>
        <p className="text-sm text-muted-foreground">
          Tracking your exam history helps us identify your strengths and areas for improvement. 
          This allows us to recommend targeted courses and resources to help you improve your performance.
        </p>
      </div>
    </div>
  );
}
