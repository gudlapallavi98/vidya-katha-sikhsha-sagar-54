
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
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import FileUpload from "@/components/FileUpload";

interface TeacherSectionProps {
  form: UseFormReturn<any>;
  certificates: string[];
  setCertificates: React.Dispatch<React.SetStateAction<string[]>>;
}

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
                bucket="avatars"
                folder={`user-${form.getValues("id") || "temp-id"}/certificates`}
                onFileUploaded={(url) => {
                  handleCertificateUpload(url);
                  setIsUploading(false);
                }}
                acceptedFileTypes="image/*"
                maxFileSizeMB={2}
                buttonLabel="Upload Certificate"
                onUploadStart={() => setIsUploading(true)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherSection;
