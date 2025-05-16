
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MessageSquare } from "lucide-react";

const SupportPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !message) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill out all required fields.",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate form submission - in a real app, this would be a call to an API
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast({
        title: "Support request submitted",
        description: "We'll get back to you as soon as possible.",
      });
      
      // Reset form
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to submit",
        description: "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container py-16">
      <h1 className="font-sanskrit text-4xl font-bold mb-8 text-center">Support Center</h1>
      
      <p className="text-muted-foreground mb-10 text-center max-w-3xl mx-auto">
        Need help with something? Our support team is here to assist you. 
        Fill out the form below or choose one of our other contact methods.
      </p>
      
      <div className="grid gap-8 md:grid-cols-12">
        <div className="md:col-span-8">
          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>
                Fill out this form and we'll get back to you as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input 
                      id="name" 
                      placeholder="Your name" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="your.email@example.com" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      required 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input 
                    id="subject" 
                    placeholder="What's this about?" 
                    value={subject} 
                    onChange={(e) => setSubject(e.target.value)} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Please provide details about your issue or question..." 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)} 
                    rows={6}
                    required 
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full md:w-auto bg-indian-saffron hover:bg-indian-saffron/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Support Request"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Us
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">General inquiries and support:</p>
              <a href="mailto:support@etutorss.com" className="text-indian-blue hover:underline">
                support@etutorss.com
              </a>
              
              <p className="text-sm text-muted-foreground mt-4 mb-2">For business and partnerships:</p>
              <a href="mailto:business@etutorss.com" className="text-indian-blue hover:underline">
                business@etutorss.com
              </a>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Call Us
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">Support line:</p>
              <a href="tel:+918045678901" className="text-indian-blue hover:underline">
                +91 80456 78901
              </a>
              
              <p className="text-sm text-muted-foreground mt-4 mb-2">Hours of operation:</p>
              <p>Monday - Friday: 9 AM - 8 PM IST</p>
              <p>Saturday: 10 AM - 6 PM IST</p>
              <p>Sunday: Closed</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Live Chat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                For immediate assistance, try our live chat support available at the bottom-right of this page during business hours.
              </p>
              
              <Button 
                className="w-full bg-indian-blue hover:bg-indian-blue/90"
                onClick={() => {
                  toast({
                    title: "Live chat",
                    description: "Our chat support will be with you shortly."
                  });
                }}
              >
                Start Live Chat
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
        <p className="text-center mb-8">
          Find quick answers to common questions on our <a href="/faq" className="text-indian-blue hover:underline">FAQ page</a>.
        </p>
      </div>
    </div>
  );
};

export default SupportPage;
