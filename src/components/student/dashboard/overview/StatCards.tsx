
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Calendar, Video } from "lucide-react";
import { Enrollment, Session } from "@/hooks/types";

interface StatCardsProps {
  enrolledCourses: Enrollment[];
  upcomingSessionsList: Session[];
  completedSessionsList: Session[];
}

const StatCards: React.FC<StatCardsProps> = ({
  enrolledCourses,
  upcomingSessionsList,
  completedSessionsList
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="bg-gradient-to-br from-indian-saffron/10 to-indian-saffron/5">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Enrolled Courses</p>
            <h3 className="text-2xl font-bold">{enrolledCourses.length}</h3>
          </div>
          <div className="h-12 w-12 rounded-full bg-indian-saffron/20 flex items-center justify-center">
            <BookOpen className="h-6 w-6 text-indian-saffron" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-indian-green/10 to-indian-green/5">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Upcoming Sessions</p>
            <h3 className="text-2xl font-bold">{upcomingSessionsList.length}</h3>
          </div>
          <div className="h-12 w-12 rounded-full bg-indian-green/20 flex items-center justify-center">
            <Calendar className="h-6 w-6 text-indian-green" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-indian-blue/10 to-indian-blue/5">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Completed Sessions</p>
            <h3 className="text-2xl font-bold">{completedSessionsList.length}</h3>
          </div>
          <div className="h-12 w-12 rounded-full bg-indian-blue/20 flex items-center justify-center">
            <Video className="h-6 w-6 text-indian-blue" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatCards;
