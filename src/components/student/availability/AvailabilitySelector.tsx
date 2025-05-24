
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, DollarSign, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AvailabilitySelectorProps {
  teacherId: string;
  onSelectAvailability: (availability: any, type: 'individual' | 'course') => void;
  onBack: () => void;
}

export const AvailabilitySelector: React.FC<AvailabilitySelectorProps> = ({
  teacherId,
  onSelectAvailability,
  onBack
}) => {
  const [selectedType, setSelectedType] = useState<'individual' | 'course'>('individual');

  // Fetch individual availability
  const { data: individualAvailability = [], isLoading: loadingIndividual } = useQuery({
    queryKey: ['individual_availability', teacherId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('teacher_availability')
        .select(`
          *,
          subject:subjects(id, name)
        `)
        .eq('teacher_id', teacherId)
        .eq('status', 'available')
        .gte('available_date', new Date().toISOString().split('T')[0]);
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch course availability
  const { data: courseAvailability = [], isLoading: loadingCourse } = useQuery({
    queryKey: ['course_availability', teacherId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('teacher_id', teacherId)
        .eq('published', true);
      
      if (error) throw error;
      return data;
    },
  });

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loadingIndividual || loadingCourse) {
    return <div className="p-6 text-center">Loading availability...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Select Availability</h2>
        <Button variant="outline" onClick={onBack}>
          Back to Teachers
        </Button>
      </div>

      <Tabs value={selectedType} onValueChange={(value) => setSelectedType(value as 'individual' | 'course')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="individual">Individual Sessions</TabsTrigger>
          <TabsTrigger value="course">Course Sessions</TabsTrigger>
        </TabsList>

        <TabsContent value="individual" className="space-y-4">
          {individualAvailability.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {individualAvailability.map((availability) => (
                <Card key={availability.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      {availability.subject?.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{formatDate(availability.available_date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {formatTime(availability.start_time)} - {formatTime(availability.end_time)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">₹500/hour</span>
                    </div>
                    <Badge variant="secondary" className="w-fit">
                      Individual Session
                    </Badge>
                    <Button 
                      className="w-full"
                      onClick={() => onSelectAvailability(availability, 'individual')}
                    >
                      Select This Slot
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">No individual availability slots found.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="course" className="space-y-4">
          {courseAvailability.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courseAvailability.map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>{course.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {course.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{course.total_lessons} lessons</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">₹{course.price || '2000'}</span>
                    </div>
                    <Badge variant="secondary" className="w-fit">
                      Course
                    </Badge>
                    <Button 
                      className="w-full"
                      onClick={() => onSelectAvailability(course, 'course')}
                    >
                      Enroll in Course
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">No courses available.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
