
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { CourseDetailsEnrollment } from "@/components/courses/CourseDetailsEnrollment";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/layout/Layout";

const CourseDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<any>(null);
  const [teacher, setTeacher] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (!id) return;

      try {
        // Fetch course details
        const { data: courseData, error: courseError } = await supabase
          .from('courses')
          .select('*')
          .eq('id', id)
          .single();

        if (courseError) {
          throw courseError;
        }

        setCourse(courseData);

        // Fetch teacher details
        const { data: teacherData, error: teacherError } = await supabase
          .from('profiles')
          .select('first_name, last_name, bio, avatar_url')
          .eq('id', courseData.teacher_id)
          .single();

        if (teacherError) {
          throw teacherError;
        }

        setTeacher(teacherData);
      } catch (error) {
        console.error('Error fetching course details:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load course details"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indian-orange mx-auto"></div>
          <p className="mt-4 text-lg">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (!course || !teacher) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Course not found</h1>
          <p className="text-gray-600">The course you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <CourseDetailsEnrollment course={course} teacher={teacher} />
    </div>
  );
};

// Wrap the component with Layout
const CourseDetailPageWithLayout = () => {
  return (
    <Layout>
      <CourseDetailPage />
    </Layout>
  );
};

export default CourseDetailPageWithLayout;
