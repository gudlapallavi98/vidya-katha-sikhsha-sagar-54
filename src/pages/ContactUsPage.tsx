
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Check, Robot, MessageSquare } from "lucide-react";
import { useContactMessages, ContactFormData } from "@/hooks/use-contact-messages";
import { motion } from "framer-motion";

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
  const [isSuccess, setIsSuccess] = useState(false);
  const [robotPosition, setRobotPosition] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRobotPosition((prev) => (prev + 1) % 3);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

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
      
      // Reset form and show success animation on success
      if (success) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          setFormData({
            name: "",
            email: "",
            phone: "",
            subject: "",
            message: ""
          });
        }, 3000);
      }
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
      });
    }
  };

  const flagColors = [
    "bg-indian-saffron", 
    "bg-white border border-gray-200", 
    "bg-indian-green"
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-indian-saffron/10 via-white to-indian-green/10 overflow-hidden relative">
        <div className="container text-center relative z-10">
          <motion.h1 
            className="font-sanskrit text-4xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            Contact <span className="text-indian-saffron">Us</span>
          </motion.h1>
          
          <motion.p 
            className="max-w-2xl mx-auto text-lg text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Have questions or feedback? We'd love to hear from you. Our team is here to help with any inquiries about our courses or platform.
          </motion.p>
        </div>

        {/* Indian Flag Colors Animation */}
        <div className="absolute inset-x-0 top-0 h-2 flex">
          {[...Array(30)].map((_, i) => (
            <motion.div 
              key={i} 
              className={`flex-1 ${flagColors[i % 3]}`}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
            />
          ))}
        </div>
      </section>

      <section className="py-16 relative overflow-hidden">
        <div className="container relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
            {/* Contact Information */}
            <div className="md:col-span-2 space-y-8">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
              >
                <h2 className="font-sanskrit text-2xl font-bold mb-6">Get in Touch</h2>
                <p className="text-muted-foreground mb-8">
                  Whether you're a student, parent, or educator, we're here to assist you with any questions or concerns.
                </p>
              </motion.div>
              
              <div className="space-y-6">
                <motion.div 
                  className="flex gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.7 }}
                >
                  <div className="h-12 w-12 rounded-full bg-indian-saffron/10 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-indian-saffron" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Email Us</h3>
                    <p className="text-muted-foreground">info@etutorss.com</p>
                    <p className="text-muted-foreground">support@etutorss.com</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.7 }}
                >
                  <div className="h-12 w-12 rounded-full bg-indian-blue/10 flex items-center justify-center">
                    <Phone className="h-5 w-5 text-indian-blue" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Call Us</h3>
                    <p className="text-muted-foreground">+91 98765 43210</p>
                    <p className="text-muted-foreground">+91 98765 43211</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.7 }}
                >
                  <div className="h-12 w-12 rounded-full bg-indian-green/10 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-indian-green" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Visit Us</h3>
                    <p className="text-muted-foreground">
                      etutorss Educational Services Pvt. Ltd.<br />
                      123, Knowledge Park, Sector 62<br />
                      Noida, Uttar Pradesh - 201309<br />
                      India
                    </p>
                  </div>
                </motion.div>
              </div>
              
              <motion.div 
                className="pt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.7 }}
              >
                <h3 className="font-medium mb-3">Working Hours</h3>
                <p className="text-muted-foreground">
                  Monday - Saturday: 9:00 AM to 7:00 PM<br />
                  Sunday: Closed
                </p>
              </motion.div>

              {/* Animated Robot */}
              <motion.div
                className="mt-8 relative h-32"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <motion.div 
                  className="absolute bottom-0 left-4"
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: robotPosition === 1 ? 5 : robotPosition === 2 ? -5 : 0
                  }}
                  transition={{ 
                    y: { duration: 2, repeat: Infinity, repeatType: "reverse" },
                    rotate: { duration: 0.5 }
                  }}
                >
                  <div className="relative">
                    <Robot className="h-20 w-20 text-indian-blue" />
                    {/* Speech bubble */}
                    <motion.div 
                      className="absolute -top-12 -right-4 bg-white p-2 rounded-lg shadow-lg"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ 
                        scale: [0, 1.1, 1],
                        opacity: 1
                      }}
                      transition={{ 
                        delay: 1,
                        duration: 0.5
                      }}
                    >
                      <MessageSquare className="h-6 w-6 text-indian-saffron" />
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
            
            {/* Contact Form */}
            <motion.div 
              className="md:col-span-3 bg-white rounded-lg shadow-xl p-6 md:p-8 relative overflow-hidden"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              {/* Success overlay */}
              {isSuccess && (
                <motion.div 
                  className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center z-20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  >
                    <Check className="h-16 w-16 text-indian-green mb-4" />
                  </motion.div>
                  <motion.h3 
                    className="text-xl font-bold text-indian-green"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    Message Sent Successfully!
                  </motion.h3>
                  <motion.p
                    className="text-muted-foreground mt-2 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    Thank you for contacting us.<br />We'll get back to you soon.
                  </motion.p>
                </motion.div>
              )}

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
                      className="focus:ring-indian-saffron"
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
                
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button 
                    type="submit" 
                    className="w-full bg-indian-saffron hover:bg-indian-saffron/90" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending..." : "Send Message"}
                  </Button>
                </motion.div>
              </form>

              {/* Indian flag decoration */}
              <div className="absolute -right-16 -bottom-16 w-32 h-32 opacity-10">
                <div className="w-full h-1/3 bg-indian-saffron"></div>
                <div className="w-full h-1/3 bg-white"></div>
                <div className="w-full h-1/3 bg-indian-green"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 border-2 border-blue-900 rounded-full"></div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Background decorations */}
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-indian-saffron/5 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 rounded-full bg-indian-green/5 animate-pulse"></div>
      </section>

      {/* Map Section with Flag-themed Design */}
      <section className="py-16 bg-gradient-to-br from-indian-saffron/5 via-white to-indian-green/5">
        <div className="container">
          <motion.h2 
            className="font-sanskrit text-2xl font-bold mb-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            Our Location
          </motion.h2>
          <motion.div 
            className="h-[400px] bg-white rounded-lg shadow relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="h-full flex items-center justify-center bg-gray-100">
              <p className="text-muted-foreground">Interactive map will be integrated here</p>
            </div>
            
            {/* Flag-themed sidebar */}
            <div className="absolute left-0 top-0 bottom-0 w-4 flex flex-col">
              <div className="flex-1 bg-indian-saffron"></div>
              <div className="flex-1 bg-white"></div>
              <div className="flex-1 bg-indian-green"></div>
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-4 flex flex-col">
              <div className="flex-1 bg-indian-saffron"></div>
              <div className="flex-1 bg-white"></div>
              <div className="flex-1 bg-indian-green"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section with Indian Theme */}
      <section className="py-16 bg-white">
        <div className="container">
          <motion.h2 
            className="font-sanskrit text-2xl font-bold mb-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            Frequently Asked Questions
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                question: "How do I enroll in a course?",
                answer: "You can browse our course catalog, select a course, and click on the \"Enroll Now\" button. If you're not registered yet, you'll be prompted to create an account."
              },
              {
                question: "How do the live sessions work?",
                answer: "Once you're enrolled, you can view available session times with teachers. Select a time that works for you, and after confirmation, you'll receive a link to join the video session."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit/debit cards, UPI payments, net banking, and select digital wallets. All transactions are secure and encrypted."
              },
              {
                question: "Can I become a teacher on this platform?",
                answer: "Yes! We're always looking for qualified educators. Sign up as a teacher, complete your profile with qualifications and experience, and our team will review your application."
              }
            ].map((faq, index) => (
              <motion.div 
                key={index}
                className="bg-white p-6 rounded-lg shadow border-l-4 border-indian-saffron hover:shadow-lg transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <h3 className="font-medium mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Terms of Service and Privacy Policy Section */}
      <section className="py-16 bg-gradient-to-br from-indian-saffron/5 via-white to-indian-green/5">
        <div className="container max-w-4xl">
          <div className="text-center mb-12">
            <motion.div
              className="inline-flex items-center justify-center mb-4"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              <div className="w-10 h-2 bg-indian-saffron rounded-full"></div>
              <div className="w-10 h-2 mx-1 bg-white border border-gray-200 rounded-full"></div>
              <div className="w-10 h-2 bg-indian-green rounded-full"></div>
            </motion.div>
            <motion.h2 
              className="font-sanskrit text-3xl font-bold"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              Our Policies
            </motion.h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
              className="bg-white p-8 rounded-lg shadow-lg"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <span className="w-4 h-4 mr-2 rounded-full bg-indian-saffron"></span>
                Terms of Service
              </h3>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  By using etutorss services, you agree to these Terms of Service. Our platform connects students with qualified teachers for online education.
                </p>
                <p>
                  Users must maintain respectful communication and adhere to Indian educational standards and cultural values. Any form of discrimination or harassment is strictly prohibited.
                </p>
                <p>
                  Payment for services is processed securely with various options available including UPI and net banking popular in India.
                </p>
                <Button variant="link" className="p-0 h-auto text-indian-blue">
                  Read Full Terms
                </Button>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white p-8 rounded-lg shadow-lg"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <span className="w-4 h-4 mr-2 rounded-full bg-indian-green"></span>
                Privacy Policy
              </h3>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  etutorss is committed to protecting your privacy in accordance with Indian data protection regulations and international standards.
                </p>
                <p>
                  We collect personal information only as necessary to provide our services and enhance your learning experience. Your data is stored securely and not shared with third parties without consent.
                </p>
                <p>
                  You retain rights to access, correct, and delete your personal information at any time through your account settings.
                </p>
                <Button variant="link" className="p-0 h-auto text-indian-blue">
                  Read Full Policy
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUsPage;
