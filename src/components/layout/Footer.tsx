
import { Link } from "react-router-dom";
import { GraduationCap, Mail } from "lucide-react";

const Footer = () => {
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Prevent default behavior to handle scrolling manually
    e.preventDefault();
    
    // Get the href attribute
    const href = e.currentTarget.getAttribute('href');
    
    if (href) {
      // Navigate to the page without scrolling
      window.location.href = href;
    }
  };

  return (
    <footer className="bg-slate-50 border-t">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-indian-saffron" />
              <h2 className="font-sanskrit text-2xl font-bold">
                <span className="text-orange-500 text-3xl">E</span>
                <span className="text-indian-blue">tutors</span>
                <span className="text-green-500">s</span>
              </h2>
            </Link>
            <p className="text-muted-foreground">
              Connecting students with expert teachers for personalized learning in academic subjects, languages, and competitive exam preparation. Traditional wisdom meets modern education.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-indian-blue transition-colors duration-300" onClick={handleLinkClick}>Home</Link>
              </li>
              <li>
                <Link to="/courses" className="text-muted-foreground hover:text-indian-blue transition-colors duration-300" onClick={handleLinkClick}>Courses</Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-indian-blue transition-colors duration-300" onClick={handleLinkClick}>About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-indian-blue transition-colors duration-300" onClick={handleLinkClick}>Contact Us</Link>
              </li>
              <li>
                <Link to="/signup" className="text-muted-foreground hover:text-indian-blue transition-colors duration-300" onClick={handleLinkClick}>Sign Up</Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-indian-blue transition-colors duration-300" onClick={handleLinkClick}>Terms of Service</Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-indian-blue transition-colors duration-300" onClick={handleLinkClick}>Privacy Policy</Link>
              </li>
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-indian-blue transition-colors duration-300" onClick={handleLinkClick}>FAQ</Link>
              </li>
              <li>
                <Link to="/support" className="text-muted-foreground hover:text-indian-blue transition-colors duration-300" onClick={handleLinkClick}>Support</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Contact Info</h3>
            <address className="not-italic text-muted-foreground space-y-2">
              <p className="flex items-center gap-2 hover:text-indian-blue transition-colors duration-300">
                <Mail className="h-4 w-4" />
                <a href="mailto:info@etutorss.com">info@etutorss.com</a>
              </p>
            </address>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Etutorss. All rights reserved.
            </p>
            <div className="flex items-center space-x-4">
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-indian-blue transition-colors duration-300" onClick={handleLinkClick}>
                Terms
              </Link>
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-indian-blue transition-colors duration-300" onClick={handleLinkClick}>
                Privacy
              </Link>
              <Link to="/cookies" className="text-sm text-muted-foreground hover:text-indian-blue transition-colors duration-300" onClick={handleLinkClick}>
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
