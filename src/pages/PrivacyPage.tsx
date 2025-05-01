
import { Link } from "react-router-dom";

const PrivacyPage = () => {
  return (
    <div className="container py-16 max-w-4xl">
      <h1 className="font-sanskrit text-4xl font-bold mb-8">Privacy Policy</h1>
      
      <p className="text-muted-foreground mb-6">
        Last Updated: May 1, 2025
      </p>
      
      <p className="mb-8">
        At Vidya Katha Online, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website, mobile application, and services (collectively, the "Services").
      </p>
      
      <div className="space-y-8">
        <section>
          <h2 className="font-sanskrit text-2xl font-bold mb-4">1. Information We Collect</h2>
          <p className="mb-4">
            We collect several types of information from and about users of our Services, including:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Personal identifiers, such as name, email address, phone number, and Aadhar number (optional);</li>
            <li>Account information, such as username and password;</li>
            <li>Educational information, such as courses enrolled in, progress, and performance;</li>
            <li>Payment information, including billing address and payment method details;</li>
            <li>Usage data, such as how you use our Services, what features you access, and how long you stay on our platform;</li>
            <li>Device information, including IP address, browser type, operating system, and device identifiers;</li>
            <li>Location information, based on your IP address or if you choose to share your precise location.</li>
          </ul>
        </section>
        
        <section>
          <h2 className="font-sanskrit text-2xl font-bold mb-4">2. How We Collect Information</h2>
          <p className="mb-4">
            We collect information in the following ways:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Directly from you when you register for an account, enroll in a course, make a payment, or communicate with us;</li>
            <li>Automatically as you navigate through our Services, using cookies, web beacons, and other tracking technologies;</li>
            <li>From third parties, such as payment processors and authentication services.</li>
          </ul>
        </section>
        
        <section>
          <h2 className="font-sanskrit text-2xl font-bold mb-4">3. How We Use Your Information</h2>
          <p className="mb-4">
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide, maintain, and improve our Services;</li>
            <li>Process transactions and send related information, including confirmations and receipts;</li>
            <li>Create and manage your account;</li>
            <li>Respond to your comments, questions, and requests;</li>
            <li>Send you technical notices, updates, security alerts, and administrative messages;</li>
            <li>Communicate with you about products, services, offers, and events, and provide news and information we think will be of interest to you;</li>
            <li>Monitor and analyze trends, usage, and activities in connection with our Services;</li>
            <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities and protect the rights and property of Vidya Katha Online and others;</li>
            <li>Personalize your experience and deliver content and product and service offerings relevant to your interests.</li>
          </ul>
        </section>
        
        <section>
          <h2 className="font-sanskrit text-2xl font-bold mb-4">4. Disclosure of Your Information</h2>
          <p className="mb-4">
            We may disclose your personal information to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Service providers who perform services on our behalf, such as payment processing, data analysis, email delivery, hosting services, and customer service;</li>
            <li>Teachers and other students as necessary for the operation of the Services, such as during live sessions or forum discussions;</li>
            <li>Comply with any court order, law, or legal process, including responding to any government or regulatory request;</li>
            <li>Enforce our Terms of Service and other agreements;</li>
            <li>Protect the rights, property, or safety of Vidya Katha Online, our users, or others;</li>
            <li>In connection with a merger, sale of company assets, financing, or acquisition of all or a portion of our business.</li>
          </ul>
        </section>
        
        <section>
          <h2 className="font-sanskrit text-2xl font-bold mb-4">5. Data Security</h2>
          <p>
            We have implemented measures designed to secure your personal information from accidental loss and from unauthorized access, use, alteration, and disclosure. However, the transmission of information via the internet is not completely secure. We cannot guarantee the security of your personal information transmitted to our Services. Any transmission of personal information is at your own risk.
          </p>
        </section>
        
        <section>
          <h2 className="font-sanskrit text-2xl font-bold mb-4">6. Your Rights and Choices</h2>
          <p className="mb-4">
            You have the right to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access, correct, or delete your personal information;</li>
            <li>Object to processing of your personal information;</li>
            <li>Request restriction of processing of your personal information;</li>
            <li>Request transfer of your personal information;</li>
            <li>Withdraw consent at any time, where we rely on your consent to process your personal information;</li>
            <li>Opt-out of marketing communications by following the unsubscribe link in any marketing email we send.</li>
          </ul>
          <p className="mt-4">
            To exercise these rights, please contact us at <a href="mailto:privacy@vidyakatha.com" className="text-indian-blue hover:underline">privacy@vidyakatha.com</a>.
          </p>
        </section>
        
        <section>
          <h2 className="font-sanskrit text-2xl font-bold mb-4">7. Children's Privacy</h2>
          <p>
            Our Services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we learn we have collected or received personal information from a child under 13 without verification of parental consent, we will delete that information. If you believe we might have any information from or about a child under 13, please contact us at <a href="mailto:privacy@vidyakatha.com" className="text-indian-blue hover:underline">privacy@vidyakatha.com</a>.
          </p>
        </section>
        
        <section>
          <h2 className="font-sanskrit text-2xl font-bold mb-4">8. International Transfers</h2>
          <p>
            Your information may be transferred to and processed in countries other than the country in which you reside. These countries may have data protection laws that are different from the laws of your country. By using our Services, you consent to the transfer of your information to these countries.
          </p>
        </section>
        
        <section>
          <h2 className="font-sanskrit text-2xl font-bold mb-4">9. Changes to Our Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.
          </p>
        </section>
        
        <section>
          <h2 className="font-sanskrit text-2xl font-bold mb-4">10. Contact Information</h2>
          <p>
            If you have any questions about this Privacy Policy or our privacy practices, please contact us at <a href="mailto:privacy@vidyakatha.com" className="text-indian-blue hover:underline">privacy@vidyakatha.com</a> or at our mailing address:
          </p>
          <address className="mt-4 not-italic">
            Vidya Katha Educational Services Pvt. Ltd.<br />
            123, Knowledge Park, Sector 62<br />
            Noida, Uttar Pradesh - 201309<br />
            India
          </address>
        </section>
      </div>
      
      <div className="mt-12">
        <Link to="/terms" className="text-indian-blue hover:underline">Terms of Service</Link>
      </div>
    </div>
  );
};

export default PrivacyPage;
