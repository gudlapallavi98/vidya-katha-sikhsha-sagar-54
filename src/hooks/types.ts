export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url: string | null;
  total_lessons: number;
  teacher_id: string;
  teacher?: {
    id: string;
    first_name: string;
    last_name: string;
  };
}

export interface Enrollment {
  id: string;
  student_id: string;
  course_id: string;
  enrolled_at: string;
  completed_lessons: number;
  last_accessed_at: string;
  course: Course;
}

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  description: string;
  duration: number;
  order_index: number;
  video_url: string | null;
  materials_url: string | null;
  created_at: string;
}

export interface Progress {
  id: string;
  student_id: string;
  lesson_id: string;
  course_id: string;
  completed: boolean;
  watched_duration: number;
  completed_at: string | null;
  last_watched_at: string;
  lesson?: Lesson;
}

export interface Session {
  id: string;
  course_id: string;
  teacher_id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  meeting_link: string | null;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  course?: {
    title: string;
  };
}

export interface SessionRequestStudent {
  first_name: string;
  last_name: string;
  email: string;
}

export interface SessionRequest {
  id: string;
  student_id: string;
  proposed_title: string;
  proposed_date: string;
  proposed_duration: number;
  request_message: string | null;
  status: string;
  created_at: string;
  student: SessionRequestStudent;
  course: {
    title: string;
  } | null;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  criteria: string;
}

export interface StudentAchievement {
  id: string;
  student_id: string;
  achievement_id: string;
  earned_at: string;
  achievement?: Achievement;
}

export interface Teacher {
  id: string;
  first_name: string;
  last_name: string;
  subjects_interested?: string[];
  bio?: string;
  years_of_experience?: string;
  education_level?: string;
}
