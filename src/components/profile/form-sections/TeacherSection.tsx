
import { UseFormReturn } from "react-hook-form";
import { useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/ui/file-upload";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TeacherSectionProps {
  form: UseFormReturn<any>;
  certificates: string[];
  setCertificates: React.Dispatch<React.SetStateAction<string[]>>;
}

// Generate experience options from 1 to 40+ years
const experienceOptions = [
  { value: "< 1", label: "Less than 1 year" },
  ...Array.from({ length: 40 }, (_, i) => ({
    value: (i + 1).toString(),
    label: `${i + 1} ${i + 1 === 1 ? 'year' : 'years'}`
  })),
  { value: "40+", label: "40+ years" }
];

const TeacherSection = ({ form, certificates, setCertificates }: TeacherSectionProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleCertificateUpload = (url: string) => {
    setCertificates((prev) => [...prev, url]);
  };

  const handleRemoveCertificate = (urlToRemove: string) => {
    setCertificates((prev) => prev.filter((url) => url !== urlToRemove));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Teacher Information</h3>

      <FormField
        control={form.control}
        name="years_of_experience"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Years of Experience</FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select years of experience" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {experienceOptions.map((option) => (
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
        name="experience"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Experience Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe your teaching experience..."
                className="resize-none"
                rows={5}
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
            <FormLabel>Introduction Video URL</FormLabel>
            <FormControl>
              <Input
                placeholder="https://youtube.com/..."
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div>
        <FormLabel>Certificates & Credentials</FormLabel>
        <div className="mt-2 space-y-4">
          {certificates.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {certificates.map((url, index) => (
                <div
                  key={index}
                  className="relative bg-muted rounded-md overflow-hidden"
                >
                  <img
                    src={url}
                    alt={`Certificate ${index + 1}`}
                    className="w-full h-32 object-cover"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 w-8 h-8 p-1"
                    onClick={() => handleRemoveCertificate(url)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4">
            {isUploading ? (
              <div className="flex items-center">
                <span className="mr-2">Uploading certificate...</span>
              </div>
            ) : (
              <FileUpload
                onUploadComplete={(url) => {
                  handleCertificateUpload(url);
                  setIsUploading(false);
                }}
                currentImageUrl={null}
                userId={form.getValues("id") || "temp-id"}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherSection;
