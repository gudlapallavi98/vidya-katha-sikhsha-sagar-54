
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface TeacherSectionProps {
  form: UseFormReturn<any>;
  certificates: string[];
  setCertificates: React.Dispatch<React.SetStateAction<string[]>>;
}

const TeacherSection = ({ form, certificates, setCertificates }: TeacherSectionProps) => {
  const [newCertificate, setNewCertificate] = useState("");

  const addCertificate = () => {
    if (newCertificate && !certificates.includes(newCertificate)) {
      setCertificates([...certificates, newCertificate]);
      setNewCertificate("");
    }
  };

  const removeCertificate = (cert: string) => {
    setCertificates(certificates.filter((c) => c !== cert));
  };

  return (
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
  );
};

export default TeacherSection;
