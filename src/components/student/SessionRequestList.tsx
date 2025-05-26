
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAllTeachers } from "@/hooks/use-teacher-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import TeacherProfileCard from "./TeacherProfileCard";

interface SessionRequestListProps {
  onSelectTeacher: (teacherId: string) => void;
}

const SessionRequestList = ({ onSelectTeacher }: SessionRequestListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: teachers = [], isLoading } = useAllTeachers();
  const navigate = useNavigate();

  // Filter teachers based on search query
  const filteredTeachers = teachers.filter((teacher) => {
    if (!searchQuery) return true;
    
    const fullName = `${teacher.first_name} ${teacher.last_name}`.toLowerCase();
    const searchLower = searchQuery.toLowerCase();
    
    return (
      fullName.includes(searchLower) || 
      (teacher.bio && teacher.bio.toLowerCase().includes(searchLower)) ||
      (teacher.subjects_interested && 
        teacher.subjects_interested.some(subject => 
          subject.toLowerCase().includes(searchLower)
        )) ||
      (teacher.city && teacher.city.toLowerCase().includes(searchLower)) ||
      (teacher.experience && teacher.experience.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search teachers by name, subject, or experience..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading teachers...</div>
      ) : filteredTeachers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeachers.map((teacher) => (
            <TeacherProfileCard
              key={teacher.id}
              id={teacher.id}
              firstName={teacher.first_name}
              lastName={teacher.last_name}
              bio={teacher.bio}
              experience={teacher.experience}
              avatarUrl={teacher.avatar_url}
              subjects={teacher.subjects_interested}
              city={teacher.city}
              country={teacher.country}
              onBookSession={() => onSelectTeacher(teacher.id)}
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
              {searchQuery
                ? "No teachers match your search criteria. Try different keywords."
                : "There are no teachers available at the moment."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SessionRequestList;
