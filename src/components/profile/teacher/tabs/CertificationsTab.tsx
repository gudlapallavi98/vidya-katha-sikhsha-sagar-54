
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import FileUpload from "@/components/FileUpload";

interface CertificationsTabProps {
  certificates: string[];
  setCertificates: (urls: string[]) => void;
  userId: string;
}

export function CertificationsTab({ certificates, setCertificates, userId }: CertificationsTabProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleCertificateUpload = (url: string) => {
    setCertificates([...certificates, url]);
    setIsUploading(false);
  };

  const handleRemoveCertificate = (urlToRemove: string) => {
    setCertificates(certificates.filter(url => url !== urlToRemove));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Certifications & Credentials</h3>
      <p className="text-sm text-muted-foreground">
        Upload images of your teaching certifications, degrees, and other credentials to establish trust with students.
      </p>

      <div className="space-y-4">
        {certificates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certificates.map((url, index) => (
              <div key={index} className="relative border rounded-md overflow-hidden group">
                <img 
                  src={url} 
                  alt={`Certificate ${index + 1}`} 
                  className="w-full h-40 object-cover" 
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-8 h-8 p-0 rounded-full"
                    onClick={() => handleRemoveCertificate(url)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-black/70 text-white text-sm truncate">
                  Certificate {index + 1}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 border-2 border-dashed rounded-md">
            <p className="text-muted-foreground">No certifications uploaded yet.</p>
          </div>
        )}

        <div className="mt-6">
          <h4 className="text-sm font-medium mb-2">Upload New Certificate</h4>
          {isUploading ? (
            <div className="flex items-center justify-center h-20 border rounded-md">
              <p>Uploading certificate...</p>
            </div>
          ) : (
            <FileUpload
              bucket="avatars"
              folder={`user-${userId}/certificates`}
              onFileUploaded={handleCertificateUpload}
              acceptedFileTypes="image/*"
              buttonLabel="Upload Certificate"
              maxFileSizeMB={2}
            />
          )}
        </div>
      </div>
    </div>
  );
}
