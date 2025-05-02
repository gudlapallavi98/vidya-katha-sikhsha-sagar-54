
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Check, CalendarIcon, ChevronsUpDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";

interface ProfileSettingsFormProps {
  role: "student" | "teacher";
  onCompleted?: () => void;
}

interface Subject {
  id: string;
  name: string;
  category: string;
}

const genderOptions = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
  { label: "Prefer not to say", value: "not_specified" },
];

const formSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  display_name: z.string().optional(),
  gender: z.string().optional(),
  date_of_birth: z.date().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  bio: z.string().optional(),
  experience: z.string().optional(),
  intro_video_url: z.string().url().optional().or(z.literal("")),
  subjects_interested: z.array(z.string()).optional(),
});

export function ProfileSettingsForm({ role, onCompleted }: ProfileSettingsFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [certificates, setCertificates] = useState<string[]>([]);
  const [newCertificate, setNewCertificate] = useState("");

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      display_name: "",
      gender: "",
      date_of_birth: undefined,
      city: "",
      state: "",
      country: "",
      bio: "",
      experience: "",
      intro_video_url: "",
      subjects_interested: [],
    },
  });

  // Fetch subjects
  useEffect(() => {
    const fetchSubjects = async () => {
      const { data, error } = await supabase
        .from("subjects")
        .select("*")
        .order("name");

      if (error) {
        console.error("Error fetching subjects:", error);
        return;
      }

      if (data) {
        setSubjects(data);
      }
    };

    fetchSubjects();
  }, []);

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }

      if (data) {
        // Update form with existing data
        form.reset({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          display_name: data.display_name || "",
          gender: data.gender || "",
          date_of_birth: data.date_of_birth ? new Date(data.date_of_birth) : undefined,
          city: data.city || "",
          state: data.state || "",
          country: data.country || "",
          bio: data.bio || "",
          experience: data.experience || "",
          intro_video_url: data.intro_video_url || "",
          subjects_interested: data.subjects_interested || [],
        });

        // Set selected subjects and certificates
        setSelectedSubjects(data.subjects_interested || []);
        setCertificates(data.certificates || []);
      }
    };

    fetchUserProfile();
  }, [user, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // Update profile with form values
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: values.first_name,
          last_name: values.last_name,
          display_name: values.display_name,
          gender: values.gender,
          date_of_birth: values.date_of_birth,
          city: values.city,
          state: values.state,
          country: values.country,
          bio: values.bio,
          experience: values.experience,
          intro_video_url: values.intro_video_url,
          subjects_interested: selectedSubjects,
          certificates: certificates,
          profile_completed: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
      
      if (onCompleted) {
        onCompleted();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
      });
      console.error("Profile update error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addCertificate = () => {
    if (newCertificate && !certificates.includes(newCertificate)) {
      setCertificates([...certificates, newCertificate]);
      setNewCertificate("");
    }
  };

  const removeCertificate = (cert: string) => {
    setCertificates(certificates.filter((c) => c !== cert));
  };

  const handleSubjectToggle = (subjectName: string) => {
    setSelectedSubjects((current) =>
      current.includes(subjectName)
        ? current.filter((s) => s !== subjectName)
        : [...current, subjectName]
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="display_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Name</FormLabel>
                <FormControl>
                  <Input placeholder="JohnDoe123" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {genderOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date_of_birth"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date of Birth</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="New Delhi" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input placeholder="Delhi" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input placeholder="India" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us about yourself"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <FormLabel>Subjects Interested</FormLabel>
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {subjects.map((subject) => (
                    <div key={subject.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={subject.id}
                        checked={selectedSubjects.includes(subject.name)}
                        onCheckedChange={() => handleSubjectToggle(subject.name)}
                      />
                      <label
                        htmlFor={subject.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {subject.name}
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {role === "teacher" && (
            <>
              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teaching Experience</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your teaching experience"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="intro_video_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Introduction Video (3 min limit)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://drive.google.com/file/..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormLabel>Certificates</FormLabel>
                <div className="flex flex-wrap gap-2 mb-2">
                  {certificates.map((cert) => (
                    <div
                      key={cert}
                      className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md"
                    >
                      <span className="text-sm">{cert}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => removeCertificate(cert)}
                      >
                        &times;
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newCertificate}
                    onChange={(e) => setNewCertificate(e.target.value)}
                    placeholder="Add a certificate"
                  />
                  <Button
                    type="button"
                    onClick={addCertificate}
                    disabled={!newCertificate}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Saving..." : "Save Profile"}
        </Button>
      </form>
    </Form>
  );
}

export default ProfileSettingsForm;
