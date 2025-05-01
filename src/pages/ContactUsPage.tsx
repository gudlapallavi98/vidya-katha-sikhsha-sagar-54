
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin } from "lucide-react";
import { useContactMessages, ContactFormData } from "@/hooks/use-contact-messages";

const ContactUsPage = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const { isLoading, submitContactMessage } = useContactMessages();
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Form validation
      if (!formData.name || !formData.email || !formData.message) {
        throw new Error("Please fill in all required fields");
      }
      
      const success = await submitContactMessage(formData);
      
      // Reset form on success
      if (success) {
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: ""
        });
      }
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-indian-saffron/5 via-white to-indian-green/5">
        <div className="container text-center">
          <h1 className="font-sanskrit text-4xl md:text-5xl font-bold mb-6">
            Contact <span className="text-indian-saffron">Us</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            Have questions or feedback? We'd love to hear from you. Our team is here to help with any inquiries about our courses or platform.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
            {/* Contact Information */}
            <div className="md:col-span-2 space-y-8">
              <div>
                <h2 className="font-sanskrit text-2xl font-bold mb-6">Get in Touch</h2>
                <p className="text-muted-foreground mb-8">
                  Whether you're a student, parent, or educator, we're here to assist you with any questions or concerns.
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-indian-saffron/10 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-indian-saffron" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Email Us</h3>
                    <p className="text-muted-foreground">support@vidyakatha.com</p>
                    <p className="text-muted-foreground">info@vidyakatha.com</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-indian-blue/10 flex items-center justify-center">
                    <Phone className="h-5 w-5 text-indian-blue" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Call Us</h3>
                    <p className="text-muted-foreground">+91 98765 43210</p>
                    <p className="text-muted-foreground">+91 98765 43211</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-indian-green/10 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-indian-green" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Visit Us</h3>
                    <p className="text-muted-foreground">
                      Vidya Katha Educational Services Pvt. Ltd.<br />
                      123, Knowledge Park, Sector 62<br />
                      Noida, Uttar Pradesh - 201309<br />
                      India
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="pt-6">
                <h3 className="font-medium mb-3">Working Hours</h3>
                <p className="text-muted-foreground">
                  Monday - Saturday: 9:00 AM to 7:00 PM<br />
                  Sunday: Closed
                </p>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="md:col-span-3 bg-white rounded-lg shadow-lg p-6 md:p-8">
              <h2 className="font-sanskrit text-2xl font-bold mb-6">Send Us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
                    <Input 
                      id="name"
                      name="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                    <Input 
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone"
                      name="phone"
                      placeholder="Your phone number"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input 
                      id="subject"
                      name="subject"
                      placeholder="Subject of your message"
                      value={formData.subject}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Message <span className="text-red-500">*</span></Label>
                  <Textarea 
                    id="message"
                    name="message"
                    placeholder="Type your message here..."
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-indian-saffron hover:bg-indian-saffron/90" 
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section (Placeholder) */}
      <section className="py-16 bg-muted">
        <div className="container">
          <h2 className="font-sanskrit text-2xl font-bold mb-6 text-center">Our Location</h2>
          <div className="h-[400px] bg-white rounded-lg shadow">
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">Interactive map will be integrated here</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container">
          <h2 className="font-sanskrit text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-medium mb-2">How do I enroll in a course?</h3>
              <p className="text-muted-foreground">
                You can browse our course catalog, select a course, and click on the "Enroll Now" button. If you're not registered yet, you'll be prompted to create an account.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-medium mb-2">How do the live sessions work?</h3>
              <p className="text-muted-foreground">
                Once you're enrolled, you can view available session times with teachers. Select a time that works for you, and after confirmation, you'll receive a link to join the video session.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-medium mb-2">What payment methods do you accept?</h3>
              <p className="text-muted-foreground">
                We accept all major credit/debit cards, UPI payments, net banking, and select digital wallets. All transactions are secure and encrypted.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-medium mb-2">Can I become a teacher on this platform?</h3>
              <p className="text-muted-foreground">
                Yes! We're always looking for qualified educators. Sign up as a teacher, complete your profile with qualifications and experience, and our team will review your application.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUsPage;
