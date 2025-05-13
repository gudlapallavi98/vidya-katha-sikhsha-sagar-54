
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTeacherSearch } from "@/hooks/useTeacherSearch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Calendar, BookOpen } from "lucide-react";
import TeacherProfileCard from "./TeacherProfileCard";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { addDays, format } from "date-fns";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface SessionRequestListProps {
  onSelectTeacher: (teacherId: string) => void;
}

const SessionRequestList = ({ onSelectTeacher }: SessionRequestListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedExperience, setSelectedExperience] = useState<string>("any");
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [sortBy, setSortBy] = useState<string>("date");
  const { toast } = useToast();
  
  const { teachers, isLoading, error } = useTeacherSearch({
    searchQuery,
    subjectId: selectedSubject === "all" ? "" : selectedSubject,
    dateRange: date,
    experienceLevel: selectedExperience === "any" ? undefined : selectedExperience as any,
    sortBy: sortBy as any
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch teachers. Please try again later."
      });
    }
  }, [error, toast]);

  // List of subjects - in a real app, you might fetch this from an API
  const subjects = [
    { id: "math", name: "Mathematics" },
    { id: "sci", name: "Science" },
    { id: "eng", name: "English" },
    { id: "hist", name: "History" }
  ];

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedSubject("all");
    setSelectedExperience("any");
    setDate(undefined);
    setSortBy("date");
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search teachers by name or subject..."
            className="pl-10"
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
        </div>
      
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Subject Filter */}
          <div>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-full">
                <BookOpen className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Date Range Picker */}
          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Filter by date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                  disabled={(date) =>
                    date < new Date(new Date().setHours(0, 0, 0, 0))
                  }
                />
              </PopoverContent>
            </Popover>
          </div>
          
          {/* Experience Level Filter */}
          <div>
            <Select value={selectedExperience} onValueChange={setSelectedExperience}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by experience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Experience</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <Tabs defaultValue="date" value={sortBy} onValueChange={setSortBy}>
            <TabsList>
              <TabsTrigger value="date">Sort by Date</TabsTrigger>
              <TabsTrigger value="name">Sort by Name</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Button variant="outline" size="sm" onClick={handleResetFilters}>
            Reset Filters
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3">Loading teachers...</span>
        </div>
      ) : error ? (
        <Card className="mt-6">
          <CardContent className="pt-6">
            <div className="text-center py-4 text-red-500">
              <p>An error occurred while fetching teachers</p>
              <Button 
                variant="outline" 
                className="mt-2" 
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : teachers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teachers.map((teacher) => (
            <TeacherProfileCard
              key={`${teacher.id}-${teacher.teacher_id}`}
              id={teacher.teacher_id}
              firstName={teacher.teacher.first_name}
              lastName={teacher.teacher.last_name}
              bio={teacher.teacher.bio || ""}
              experience={teacher.teacher.experience || ""}
              avatarUrl={teacher.teacher.avatar_url || ""}
              subjects={[teacher.subject.name]}
              availableDate={new Date(teacher.available_date).toLocaleDateString()}
              availableTime={`${teacher.start_time.substring(0, 5)} - ${teacher.end_time.substring(0, 5)}`}
              onBookSession={() => onSelectTeacher(teacher.teacher_id)}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-center">No Teachers Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              {searchQuery || selectedSubject !== "all" || date || selectedExperience !== "any"
                ? "No teachers match your search criteria. Try different filters."
                : "There are no teachers available at the moment."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SessionRequestList;
