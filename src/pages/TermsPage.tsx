
import { Link } from "react-router-dom";

const TermsPage = () => {
  return (
    <div className="container py-16 max-w-4xl">
      <h1 className="font-sanskrit text-4xl font-bold mb-8">Terms of Service</h1>
      
      <p className="text-muted-foreground mb-6">
        Last Updated: May 1, 2025
      </p>
      
      <div className="space-y-8">
        <section>
          <h2 className="font-sanskrit text-2xl font-bold mb-4">1. Introduction</h2>
          <p className="mb-4">
            Welcome to etutorss ("we," "our," or "us"). These Terms of Service ("Terms") govern your access to and use of the etutorss website, mobile application, and services (collectively, the "Services").
          </p>
          <p>
            By using our Services, you agree to these Terms. If you do not agree to these Terms, you may not access or use the Services.
          </p>
        </section>
        
        <section>
          <h2 className="font-sanskrit text-2xl font-bold mb-4">2. User Accounts</h2>
          <p className="mb-4">
            To use certain features of our Services, you may need to create a user account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
          </p>
          <p className="mb-4">
            You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
          </p>
          <p>
            We reserve the right to suspend or terminate your account if any information provided during registration or thereafter proves to be inaccurate, not current, or incomplete.
          </p>
        </section>
        
        <section>
          <h2 className="font-sanskrit text-2xl font-bold mb-4">3. Course Enrollment and Payments</h2>
          <p className="mb-4">
            3.1. Enrollment: Upon successful enrollment in a course, you will be granted access to the course materials and live sessions as specified in the course description.
          </p>
          <p className="mb-4">
            3.2. Fees: Course fees are as stated at the time of enrollment. All fees are in Indian Rupees (INR) unless otherwise specified.
          </p>
          <p className="mb-4">
            3.3. Payment: We accept payment through various methods as indicated on our platform. All payments must be made in advance to gain access to the course materials.
          </p>
          <p>
            3.4. Refunds: Refund policies are as specified in each course description. Generally, refunds are available within 7 days of enrollment if you have not accessed more than 25% of the course content.
          </p>
        </section>
        
        <section>
          <h2 className="font-sanskrit text-2xl font-bold mb-4">4. User Conduct</h2>
          <p className="mb-4">
            When using our Services, you agree not to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Violate any applicable laws or regulations;</li>
            <li>Infringe upon the rights of others, including intellectual property rights;</li>
            <li>Share your account credentials with others or allow others to access the Services using your account;</li>
            <li>Attempt to bypass any security measures implemented on the Services;</li>
            <li>Use the Services to distribute malware, viruses, or other malicious code;</li>
            <li>Interfere with or disrupt the integrity or performance of the Services;</li>
            <li>Collect or store personal information about other users without their consent;</li>
            <li>Engage in any behavior that is harassing, defamatory, abusive, or otherwise objectionable.</li>
          </ul>
        </section>
        
        <section>
          <h2 className="font-sanskrit text-2xl font-bold mb-4">5. Intellectual Property</h2>
          <p className="mb-4">
            5.1. Our Content: The Services and their entire contents, features, and functionality (including but not limited to all information, software, text, displays, images, video, and audio, and the design, selection, and arrangement thereof) are owned by etutorss, its licensors, or other providers and are protected by copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
          </p>
          <p>
            5.2. User Content: By submitting content to our Services (such as forum posts, reviews, or assignments), you grant us a non-exclusive, royalty-free, worldwide, perpetual license to use, reproduce, modify, adapt, publish, translate, distribute, and display such content in connection with the Services.
          </p>
        </section>
        
        <section>
          <h2 className="font-sanskrit text-2xl font-bold mb-4">6. Privacy</h2>
          <p>
            Your privacy is important to us. Please refer to our <Link to="/privacy" className="text-indian-blue hover:underline">Privacy Policy</Link> for information about how we collect, use, and disclose your personal information.
          </p>
        </section>
        
        <section>
          <h2 className="font-sanskrit text-2xl font-bold mb-4">7. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, etutorss shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including lost profits, arising out of or in any way connected with your access to or use of the Services, whether based on warranty, contract, tort (including negligence), or any other legal theory, even if we have been advised of the possibility of such damages.
          </p>
        </section>
        
        <section>
          <h2 className="font-sanskrit text-2xl font-bold mb-4">8. Modification of Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. If we make material changes to these Terms, we will notify you by email or by posting a notice on our website. Your continued use of the Services after such modifications constitutes your acceptance of the modified Terms.
          </p>
        </section>
        
        <section>
          <h2 className="font-sanskrit text-2xl font-bold mb-4">9. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
          </p>
        </section>
        
        <section>
          <h2 className="font-sanskrit text-2xl font-bold mb-4">10. Contact Information</h2>
          <p>
            If you have any questions about these Terms, please contact us at <a href="mailto:legal@etutorss.com" className="text-indian-blue hover:underline">legal@etutorss.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsPage;
