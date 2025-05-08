
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FileUploadProps {
  onUploadComplete: (url: string) => void;
  currentImageUrl?: string | null;
  userId: string;
}

export function FileUpload({ onUploadComplete, currentImageUrl, userId }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload an image file.",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Maximum file size is 5MB.",
      });
      return;
    }

    try {
      setIsUploading(true);
      
      // Store image directly in the base64 format in the database instead
      // This avoids the need for storage buckets
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const base64String = e.target?.result as string;
          
          if (base64String) {
            // Set preview URL for immediate feedback
            setPreviewUrl(base64String);
            
            // Pass the base64 string to the parent component
            onUploadComplete(base64String);
            
            toast({
              title: "Upload successful",
              description: "Your profile image has been updated.",
            });
          }
          resolve(null);
        };
        reader.readAsDataURL(file);
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Something went wrong",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className="h-24 w-24">
        {previewUrl ? (
          <AvatarImage src={previewUrl} alt="Profile" />
        ) : (
          <AvatarFallback className="bg-muted">
            <User className="h-12 w-12 text-muted-foreground" />
          </AvatarFallback>
        )}
      </Avatar>
      
      <div className="flex items-center gap-2">
        <Button 
          type="button"
          variant="outline" 
          className="relative"
          disabled={isUploading}
        >
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          <Upload className="h-4 w-4 mr-2" />
          {isUploading ? "Uploading..." : "Upload Photo"}
        </Button>
        
        {previewUrl && (
          <Button
            type="button"
            variant="ghost"
            disabled={isUploading}
            onClick={() => {
              setPreviewUrl(null);
              onUploadComplete("");
            }}
          >
            Remove
          </Button>
        )}
      </div>
    </div>
  );
}
