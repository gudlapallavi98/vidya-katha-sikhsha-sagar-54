
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQPage = () => {
  return (
    <div className="container py-16 max-w-4xl">
      <h1 className="font-sanskrit text-4xl font-bold mb-8 text-center">Frequently Asked Questions</h1>
      
      <p className="text-muted-foreground mb-10 text-center">
        Find answers to the most common questions about etutorss services
      </p>
      
      <Accordion type="single" collapsible className="space-y-4">
        <AccordionItem value="item-1" className="border rounded-lg p-2">
          <AccordionTrigger className="text-lg font-medium px-4">How do I sign up for an account?</AccordionTrigger>
          <AccordionContent className="px-4 pb-4 text-muted-foreground">
            Signing up is easy! Click on the "Sign Up" button in the navigation bar, fill out your basic information, verify your email address, and you're ready to start learning or teaching with etutorss.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-2" className="border rounded-lg p-2">
          <AccordionTrigger className="text-lg font-medium px-4">What subjects are offered on etutorss?</AccordionTrigger>
          <AccordionContent className="px-4 pb-4 text-muted-foreground">
            We offer a wide range of subjects including mathematics, science, languages, humanities, arts, and competitive exam preparation. Our platform specializes in traditional Indian knowledge systems with a modern approach to education.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-3" className="border rounded-lg p-2">
          <AccordionTrigger className="text-lg font-medium px-4">How do the live tutoring sessions work?</AccordionTrigger>
          <AccordionContent className="px-4 pb-4 text-muted-foreground">
            Our live sessions are conducted through our integrated video platform. You can book a session with your preferred teacher based on their availability. The sessions include interactive features like screen sharing, whiteboard, and live chat to ensure an effective learning experience.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-4" className="border rounded-lg p-2">
          <AccordionTrigger className="text-lg font-medium px-4">What are the payment options?</AccordionTrigger>
          <AccordionContent className="px-4 pb-4 text-muted-foreground">
            We accept various payment methods including credit/debit cards, UPI, net banking, and digital wallets. All transactions are secured with industry-standard encryption to ensure your financial information is protected.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-5" className="border rounded-lg p-2">
          <AccordionTrigger className="text-lg font-medium px-4">What is the refund policy?</AccordionTrigger>
          <AccordionContent className="px-4 pb-4 text-muted-foreground">
            We offer a 7-day refund policy for courses if you've completed less than 25% of the content. For live sessions, cancellations made at least 24 hours in advance are eligible for a full refund or rescheduling. Please refer to our Terms of Service for detailed information.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-6" className="border rounded-lg p-2">
          <AccordionTrigger className="text-lg font-medium px-4">How are teachers vetted on the platform?</AccordionTrigger>
          <AccordionContent className="px-4 pb-4 text-muted-foreground">
            All our teachers undergo a rigorous verification process including background checks, qualification verification, and demo sessions. We ensure they have the necessary expertise, teaching experience, and communication skills to provide quality education.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-7" className="border rounded-lg p-2">
          <AccordionTrigger className="text-lg font-medium px-4">Can I access the course materials after completion?</AccordionTrigger>
          <AccordionContent className="px-4 pb-4 text-muted-foreground">
            Yes, once you've enrolled in a course, you'll have lifetime access to the course materials, including updates that the teacher may provide in the future. This allows you to revisit concepts and reinforce your learning at any time.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-8" className="border rounded-lg p-2">
          <AccordionTrigger className="text-lg font-medium px-4">How do I become a teacher on etutorss?</AccordionTrigger>
          <AccordionContent className="px-4 pb-4 text-muted-foreground">
            To become a teacher, sign up for an account, complete your profile with your qualifications and expertise, and apply for teacher verification. Once approved, you can set your availability, create course materials, and start accepting student requests.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-9" className="border rounded-lg p-2">
          <AccordionTrigger className="text-lg font-medium px-4">Is there a mobile app available?</AccordionTrigger>
          <AccordionContent className="px-4 pb-4 text-muted-foreground">
            Yes, we offer mobile apps for both iOS and Android platforms. You can download them from the respective app stores to access your courses, join live sessions, and engage with teachers and fellow students on the go.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-10" className="border rounded-lg p-2">
          <AccordionTrigger className="text-lg font-medium px-4">How can I get help if I'm having technical issues?</AccordionTrigger>
          <AccordionContent className="px-4 pb-4 text-muted-foreground">
            For technical support, you can visit our Support page, use the in-app chat assistance, or email us at support@etutorss.com. Our technical team is available to help you resolve any issues you might encounter while using our platform.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <div className="mt-12 text-center">
        <p className="text-muted-foreground">
          Can't find what you're looking for? Visit our <a href="/support" className="text-indian-blue hover:underline">Support page</a> or contact us at <a href="mailto:help@etutorss.com" className="text-indian-blue hover:underline">help@etutorss.com</a>
        </p>
      </div>
    </div>
  );
};

export default FAQPage;
