
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  bucket: string;
  folder: string;
  onFileUploaded: (url: string) => void;
  acceptedFileTypes?: string;
  maxFileSizeMB?: number;
  buttonLabel?: string;
  buttonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  onUploadStart?: () => void;
}

const FileUpload = ({
  bucket,
  folder,
  onFileUploaded,
  acceptedFileTypes = "image/*",
  maxFileSizeMB = 5,
  buttonLabel = "Upload File",
  buttonVariant = "default",
  onUploadStart,
}: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size
    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > maxFileSizeMB) {
      toast({
        title: "File too large",
        description: `File size must be less than ${maxFileSizeMB}MB`,
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);
      if (onUploadStart) {
        onUploadStart();
      }

      // Create a unique file name to prevent collisions
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = folder ? `${folder}/${fileName}` : fileName;

      const { error: uploadError, data } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      onFileUploaded(publicUrlData.publicUrl);

      toast({
        title: "Upload successful",
        description: "Your file has been uploaded.",
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
      console.error("Error uploading file:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <Input
        type="file"
        id="file-upload"
        onChange={handleFileChange}
        accept={acceptedFileTypes}
        className="hidden"
        disabled={uploading}
      />
      <label htmlFor="file-upload">
        <Button
          type="button"
          variant={buttonVariant}
          className="cursor-pointer w-full"
          disabled={uploading}
          asChild
        >
          <span>
            <Upload className="mr-2 h-4 w-4" />
            {uploading ? "Uploading..." : buttonLabel}
          </span>
        </Button>
      </label>
    </div>
  );
};

export default FileUpload;
