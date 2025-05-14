
import React from "react";
import { Card } from "@/components/ui/card";
import { BookOpen, Calendar, Video } from "lucide-react";
import DashboardTiles from "./components/DashboardTiles";

interface DashboardViewProps {
  activeTab: string;
  totalCourses: number;
  totalRequests: number;
  completedSessions: number;
}

const DashboardView: React.FC<DashboardViewProps> = ({
  activeTab,
  totalCourses,
  totalRequests,
  completedSessions,
}) => {
  return (
    <div className="space-y-8">
      <h1 className="font-sanskrit text-3xl font-bold">Teacher Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-indian-blue/10 to-indian-blue/5">
          <div className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Active Courses</p>
              <h3 className="text-2xl font-bold">{totalCourses}</h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-indian-blue/20 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-indian-blue" />
            </div>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-indian-saffron/10 to-indian-saffron/5">
          <div className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Session Requests</p>
              <h3 className="text-2xl font-bold">{totalRequests}</h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-indian-saffron/20 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-indian-saffron" />
            </div>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-indian-green/10 to-indian-green/5">
          <div className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Total Sessions</p>
              <h3 className="text-2xl font-bold">
                {completedSessions}
              </h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-indian-green/20 flex items-center justify-center">
              <Video className="h-6 w-6 text-indian-green" />
            </div>
          </div>
        </Card>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Quick Navigation</h2>
        <DashboardTiles activeTab={activeTab} />
      </div>
    </div>
  );
};

export default DashboardView;
