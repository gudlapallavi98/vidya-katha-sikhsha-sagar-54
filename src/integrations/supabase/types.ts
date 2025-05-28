export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      achievements: {
        Row: {
          created_at: string | null
          criteria: string
          description: string
          id: string
          image_url: string | null
          name: string
        }
        Insert: {
          created_at?: string | null
          criteria: string
          description: string
          id?: string
          image_url?: string | null
          name: string
        }
        Update: {
          created_at?: string | null
          criteria?: string
          description?: string
          id?: string
          image_url?: string | null
          name?: string
        }
        Relationships: []
      }
      chatbot_requests: {
        Row: {
          city: string | null
          created_at: string
          description: string | null
          email: string
          id: string
          name: string
          phone: string | null
          request_id: string
          status: string
          updated_at: string
        }
        Insert: {
          city?: string | null
          created_at?: string
          description?: string | null
          email: string
          id?: string
          name: string
          phone?: string | null
          request_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          city?: string | null
          created_at?: string
          description?: string | null
          email?: string
          id?: string
          name?: string
          phone?: string | null
          request_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          status: string
          subject: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          status?: string
          subject?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          status?: string
          subject?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          category: string
          course_link: string | null
          created_at: string | null
          description: string
          enrollment_status: string | null
          id: string
          image_url: string | null
          is_published: boolean | null
          price: number | null
          published_at: string | null
          sample_video: string | null
          student_price: number | null
          teacher_id: string | null
          teacher_rate: number | null
          title: string
          total_lessons: number
          updated_at: string | null
          video_links: Json | null
        }
        Insert: {
          category: string
          course_link?: string | null
          created_at?: string | null
          description: string
          enrollment_status?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          price?: number | null
          published_at?: string | null
          sample_video?: string | null
          student_price?: number | null
          teacher_id?: string | null
          teacher_rate?: number | null
          title: string
          total_lessons?: number
          updated_at?: string | null
          video_links?: Json | null
        }
        Update: {
          category?: string
          course_link?: string | null
          created_at?: string | null
          description?: string
          enrollment_status?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          price?: number | null
          published_at?: string | null
          sample_video?: string | null
          student_price?: number | null
          teacher_id?: string | null
          teacher_rate?: number | null
          title?: string
          total_lessons?: number
          updated_at?: string | null
          video_links?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "courses_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      enrollments: {
        Row: {
          completed_lessons: number | null
          course_id: string | null
          enrolled_at: string | null
          id: string
          last_accessed_at: string | null
          student_id: string | null
        }
        Insert: {
          completed_lessons?: number | null
          course_id?: string | null
          enrolled_at?: string | null
          id?: string
          last_accessed_at?: string | null
          student_id?: string | null
        }
        Update: {
          completed_lessons?: number | null
          course_id?: string | null
          enrolled_at?: string | null
          id?: string
          last_accessed_at?: string | null
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          course_id: string | null
          created_at: string | null
          description: string
          duration: number
          id: string
          materials_url: string | null
          order_index: number
          title: string
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          description: string
          duration: number
          id?: string
          materials_url?: string | null
          order_index: number
          title: string
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          description?: string
          duration?: number
          id?: string
          materials_url?: string | null
          order_index?: number
          title?: string
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      password_reset_otps: {
        Row: {
          created_at: string
          email: string
          expires_at: string
          id: string
          otp: string
          used: boolean | null
          verified: boolean | null
        }
        Insert: {
          created_at?: string
          email: string
          expires_at: string
          id?: string
          otp: string
          used?: boolean | null
          verified?: boolean | null
        }
        Update: {
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          otp?: string
          used?: boolean | null
          verified?: boolean | null
        }
        Relationships: []
      }
      payment_history: {
        Row: {
          amount: number
          created_at: string
          gateway_response: Json | null
          id: string
          notes: string | null
          payment_method: string | null
          payment_status: string
          payment_type: string
          platform_fee: number
          session_id: string | null
          session_request_id: string | null
          teacher_payout: number
          transaction_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          gateway_response?: Json | null
          id?: string
          notes?: string | null
          payment_method?: string | null
          payment_status?: string
          payment_type: string
          platform_fee?: number
          session_id?: string | null
          session_request_id?: string | null
          teacher_payout?: number
          transaction_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          gateway_response?: Json | null
          id?: string
          notes?: string | null
          payment_method?: string | null
          payment_status?: string
          payment_type?: string
          platform_fee?: number
          session_id?: string | null
          session_request_id?: string | null
          teacher_payout?: number
          transaction_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_history_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_history_session_request_id_fkey"
            columns: ["session_request_id"]
            isOneToOne: false
            referencedRelation: "session_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          certificates: string[] | null
          city: string | null
          country: string | null
          created_at: string | null
          date_of_birth: string | null
          display_name: string | null
          education_level: string | null
          exam_history: Json | null
          experience: string | null
          first_name: string
          gender: string | null
          grade_level: string | null
          id: string
          intro_video_url: string | null
          last_name: string
          profile_completed: boolean | null
          role: string
          school_name: string | null
          state: string | null
          study_preferences: string[] | null
          subjects_interested: string[] | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          certificates?: string[] | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          display_name?: string | null
          education_level?: string | null
          exam_history?: Json | null
          experience?: string | null
          first_name: string
          gender?: string | null
          grade_level?: string | null
          id: string
          intro_video_url?: string | null
          last_name: string
          profile_completed?: boolean | null
          role: string
          school_name?: string | null
          state?: string | null
          study_preferences?: string[] | null
          subjects_interested?: string[] | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          certificates?: string[] | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          display_name?: string | null
          education_level?: string | null
          exam_history?: Json | null
          experience?: string | null
          first_name?: string
          gender?: string | null
          grade_level?: string | null
          id?: string
          intro_video_url?: string | null
          last_name?: string
          profile_completed?: boolean | null
          role?: string
          school_name?: string | null
          state?: string | null
          study_preferences?: string[] | null
          subjects_interested?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      progress: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          course_id: string | null
          id: string
          last_watched_at: string | null
          lesson_id: string | null
          student_id: string | null
          watched_duration: number | null
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          course_id?: string | null
          id?: string
          last_watched_at?: string | null
          lesson_id?: string | null
          student_id?: string | null
          watched_duration?: number | null
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          course_id?: string | null
          id?: string
          last_watched_at?: string | null
          lesson_id?: string | null
          student_id?: string | null
          watched_duration?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "progress_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      session_attendees: {
        Row: {
          attended: boolean | null
          id: string
          join_time: string | null
          leave_time: string | null
          session_id: string | null
          student_id: string | null
        }
        Insert: {
          attended?: boolean | null
          id?: string
          join_time?: string | null
          leave_time?: string | null
          session_id?: string | null
          student_id?: string | null
        }
        Update: {
          attended?: boolean | null
          id?: string
          join_time?: string | null
          leave_time?: string | null
          session_id?: string | null
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "session_attendees_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_attendees_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      session_payments: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          payment_gateway: string | null
          payment_method: string
          payment_status: string | null
          session_id: string | null
          session_request_id: string | null
          student_id: string
          teacher_id: string
          transaction_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          payment_gateway?: string | null
          payment_method: string
          payment_status?: string | null
          session_id?: string | null
          session_request_id?: string | null
          student_id: string
          teacher_id: string
          transaction_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          payment_gateway?: string | null
          payment_method?: string
          payment_status?: string | null
          session_id?: string | null
          session_request_id?: string | null
          student_id?: string
          teacher_id?: string
          transaction_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "session_payments_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_payments_session_request_id_fkey"
            columns: ["session_request_id"]
            isOneToOne: false
            referencedRelation: "session_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      session_requests: {
        Row: {
          availability_id: string | null
          course_id: string | null
          created_at: string | null
          id: string
          payment_amount: number | null
          payment_status: string | null
          priority_level: string | null
          proposed_date: string
          proposed_duration: number
          proposed_title: string
          request_message: string | null
          session_type: string | null
          status: string
          student_id: string | null
          teacher_id: string | null
          updated_at: string | null
        }
        Insert: {
          availability_id?: string | null
          course_id?: string | null
          created_at?: string | null
          id?: string
          payment_amount?: number | null
          payment_status?: string | null
          priority_level?: string | null
          proposed_date: string
          proposed_duration: number
          proposed_title: string
          request_message?: string | null
          session_type?: string | null
          status: string
          student_id?: string | null
          teacher_id?: string | null
          updated_at?: string | null
        }
        Update: {
          availability_id?: string | null
          course_id?: string | null
          created_at?: string | null
          id?: string
          payment_amount?: number | null
          payment_status?: string | null
          priority_level?: string | null
          proposed_date?: string
          proposed_duration?: number
          proposed_title?: string
          request_message?: string | null
          session_type?: string | null
          status?: string
          student_id?: string | null
          teacher_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "session_requests_availability_id_fkey"
            columns: ["availability_id"]
            isOneToOne: false
            referencedRelation: "teacher_availability"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_requests_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_requests_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_requests_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          course_id: string | null
          created_at: string | null
          description: string | null
          end_time: string
          id: string
          meeting_link: string | null
          payment_amount: number | null
          payment_method: string | null
          payment_status: string | null
          recording_url: string | null
          session_notes: string | null
          start_time: string
          status: string
          teacher_id: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          end_time: string
          id?: string
          meeting_link?: string | null
          payment_amount?: number | null
          payment_method?: string | null
          payment_status?: string | null
          recording_url?: string | null
          session_notes?: string | null
          start_time: string
          status: string
          teacher_id?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          end_time?: string
          id?: string
          meeting_link?: string | null
          payment_amount?: number | null
          payment_method?: string | null
          payment_status?: string | null
          recording_url?: string | null
          session_notes?: string | null
          start_time?: string
          status?: string
          teacher_id?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sessions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sessions_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      signup_otps: {
        Row: {
          created_at: string
          email: string
          expires_at: string
          id: string
          otp: string
          used: boolean | null
          user_data: Json | null
          verified: boolean | null
        }
        Insert: {
          created_at?: string
          email: string
          expires_at: string
          id?: string
          otp: string
          used?: boolean | null
          user_data?: Json | null
          verified?: boolean | null
        }
        Update: {
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          otp?: string
          used?: boolean | null
          user_data?: Json | null
          verified?: boolean | null
        }
        Relationships: []
      }
      student_achievements: {
        Row: {
          achievement_id: string | null
          earned_at: string | null
          id: string
          student_id: string | null
        }
        Insert: {
          achievement_id?: string | null
          earned_at?: string | null
          id?: string
          student_id?: string | null
        }
        Update: {
          achievement_id?: string | null
          earned_at?: string | null
          id?: string
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_achievements_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subjects: {
        Row: {
          category: string | null
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      teacher_availability: {
        Row: {
          auto_cancel_at: string | null
          available_date: string
          booked_students: number | null
          created_at: string | null
          end_date: string | null
          end_time: string
          id: string
          max_students: number | null
          notes: string | null
          price: number | null
          session_type: string | null
          start_date: string | null
          start_time: string
          status: string | null
          student_price: number | null
          subject_id: string
          teacher_id: string
          teacher_rate: number | null
        }
        Insert: {
          auto_cancel_at?: string | null
          available_date: string
          booked_students?: number | null
          created_at?: string | null
          end_date?: string | null
          end_time: string
          id?: string
          max_students?: number | null
          notes?: string | null
          price?: number | null
          session_type?: string | null
          start_date?: string | null
          start_time: string
          status?: string | null
          student_price?: number | null
          subject_id: string
          teacher_id: string
          teacher_rate?: number | null
        }
        Update: {
          auto_cancel_at?: string | null
          available_date?: string
          booked_students?: number | null
          created_at?: string | null
          end_date?: string | null
          end_time?: string
          id?: string
          max_students?: number | null
          notes?: string | null
          price?: number | null
          session_type?: string | null
          start_date?: string | null
          start_time?: string
          status?: string | null
          student_price?: number | null
          subject_id?: string
          teacher_id?: string
          teacher_rate?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "teacher_availability_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teacher_availability_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      teacher_earnings: {
        Row: {
          amount: number
          created_at: string
          id: string
          notes: string | null
          release_date: string | null
          session_id: string | null
          status: string
          teacher_id: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          notes?: string | null
          release_date?: string | null
          session_id?: string | null
          status?: string
          teacher_id: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          notes?: string | null
          release_date?: string | null
          session_id?: string | null
          status?: string
          teacher_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "teacher_earnings_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      teacher_subjects: {
        Row: {
          created_at: string | null
          id: string
          subject_id: string
          teacher_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          subject_id: string
          teacher_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          subject_id?: string
          teacher_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_pricing: {
        Args: { teacher_rate: number }
        Returns: {
          teacher_amount: number
          student_amount: number
          platform_fee: number
        }[]
      }
      generate_request_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
