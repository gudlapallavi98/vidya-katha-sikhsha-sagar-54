
import { Link } from "react-router-dom";
import { GraduationCap, Facebook, Twitter, Instagram, Youtube, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-50 border-t">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Logo and About */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-indian-saffron" />
              <h2 className="font-sanskrit text-2xl font-bold">
                <span className="text-indian-saffron">e</span>
                <span className="text-indian-blue">tutorss</span>
              </h2>
            </Link>
            <p className="text-muted-foreground">
              Connecting students with expert teachers for personalized learning in academic subjects, languages, and competitive exam preparation. Traditional wisdom meets modern education.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-muted-foreground hover:text-indian-blue">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-indian-blue">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-indian-blue">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-indian-blue">
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-indian-blue">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-indian-blue">Home</Link>
              </li>
              <li>
                <Link to="/courses" className="text-muted-foreground hover:text-indian-blue">Courses</Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-indian-blue">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-indian-blue">Contact Us</Link>
              </li>
              <li>
                <Link to="/signup" className="text-muted-foreground hover:text-indian-blue">Sign Up</Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-indian-blue">Terms of Service</Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-indian-blue">Privacy Policy</Link>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-indian-blue">Blog</a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-indian-blue">FAQ</a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-indian-blue">Support</a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Contact Info</h3>
            <address className="not-italic text-muted-foreground space-y-2">
              <p>123, Knowledge Park, Sector 62</p>
              <p>Noida, Uttar Pradesh - 201309</p>
              <p>India</p>
              <p className="pt-2">
                <a href="tel:+919876543210" className="hover:text-indian-blue">+91 98765 43210</a>
              </p>
              <p>
                <a href="mailto:info@etutorss.com" className="hover:text-indian-blue">info@etutorss.com</a>
              </p>
            </address>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} etutorss. All rights reserved.
            </p>
            <div className="flex items-center space-x-4">
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-indian-blue">
                Terms
              </Link>
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-indian-blue">
                Privacy
              </Link>
              <Link to="/cookies" className="text-sm text-muted-foreground hover:text-indian-blue">
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
