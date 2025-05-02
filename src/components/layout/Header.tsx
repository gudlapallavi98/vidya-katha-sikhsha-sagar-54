
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, ChevronDown, GraduationCap, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch the user's role and name from the profile
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const { data } = await supabase
            .from('profiles')
            .select('role, display_name, first_name')
            .eq('id', user.id)
            .single();
            
          if (data) {
            setUserRole(data.role);
            // Use display_name if available, otherwise use first_name
            setUserName(data.display_name || data.first_name || null);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    
    fetchUserData();
  }, [user]);

  // Check if page is scrolled
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (userName) {
      return userName.charAt(0).toUpperCase();
    } 
    return user?.email?.charAt(0).toUpperCase() || 'U';
  };

  // Check if a link is active
  const isActivePath = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header 
      className={`border-b transition-all duration-300 ease-in-out sticky top-0 z-50 ${
        isScrolled 
          ? "border-border/40 bg-background/90 backdrop-blur-md shadow-md" 
          : "border-transparent bg-gradient-to-b from-background/80 to-background/60"
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <GraduationCap className="h-8 w-8 text-indian-saffron" />
            </motion.div>
            <span className="font-sanskrit text-2xl font-bold">
              <span className="text-indian-saffron group-hover:text-indian-blue transition-colors duration-300">e</span>{" "}
              <span className="text-indian-blue group-hover:text-indian-saffron transition-colors duration-300">Guru</span>
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="flex items-center gap-1 group transition-all duration-200 hover:text-indian-saffron"
                >
                  Courses 
                  <ChevronDown className="h-4 w-4 transition-transform duration-300 group-hover:rotate-180" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="w-56 bg-background/90 backdrop-blur-md border border-muted/20 shadow-xl animate-in fade-in-80 zoom-in-95"
                sideOffset={8}
              >
                {[
                  { path: "/courses?category=school", text: "School Courses" },
                  { path: "/courses?category=college", text: "College Courses" },
                  { path: "/courses?category=tech", text: "Tech Courses" },
                  { path: "/courses?category=language", text: "Language Courses" },
                  { path: "/courses?category=competitive", text: "Competitive Exams" },
                ].map((item, index) => (
                  <DropdownMenuItem key={index} className="focus:bg-accent/10">
                    <Link 
                      to={item.path} 
                      className="w-full py-1 hover:text-indian-saffron transition-colors"
                    >
                      {item.text}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Link 
              to="/about" 
              className={`relative px-3 py-2 transition-colors duration-300 ${
                isActivePath('/about') 
                  ? "text-indian-saffron" 
                  : "text-foreground hover:text-indian-saffron"
              }`}
            >
              About Us
              {isActivePath('/about') && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indian-saffron"></div>
              )}
            </Link>
            
            <Link 
              to="/contact" 
              className={`relative px-3 py-2 transition-colors duration-300 ${
                isActivePath('/contact') 
                  ? "text-indian-saffron" 
                  : "text-foreground hover:text-indian-saffron"
              }`}
            >
              Contact
              {isActivePath('/contact') && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indian-saffron"></div>
              )}
            </Link>
          </nav>
        </div>
        
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              {userRole === 'student' && (
                <Link to="/student-dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
              )}
              {userRole === 'teacher' && (
                <Link to="/teacher-dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 hover:bg-accent/10">
                    <Avatar className="h-8 w-8 ring-2 ring-background">
                      <AvatarFallback className="bg-indian-saffron/20 text-indian-saffron">{getUserInitials()}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{userName || 'Account'}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="bg-background/90 backdrop-blur-md border border-muted/20 shadow-xl animate-in fade-in-80 zoom-in-95"
                >
                  <DropdownMenuItem className="focus:bg-accent/10">
                    <Link to={userRole === 'student' ? "/student-dashboard?tab=profile" : "/teacher-dashboard?tab=profile"} className="w-full">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut} className="focus:bg-accent/10">
                    <LogOut className="h-4 w-4 mr-2" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button 
                  variant="ghost" 
                  className="hover:bg-accent/10 hover:text-indian-saffron transition-all duration-200"
                >
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button 
                  className="bg-indian-saffron hover:bg-indian-saffron/90 shadow-glow-saffron transition-all duration-300 hover:scale-105"
                >
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
        
        <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
          <Menu className="h-6 w-6" />
        </Button>
      </div>
      
      {isMenuOpen && (
        <div className="container md:hidden py-4 space-y-4 border-t animate-in slide-in-from-top-5 duration-200">
          <div className="flex flex-col gap-2">
            <Link to="/courses" className="px-2 py-1 hover:bg-muted rounded-md transition-colors hover:text-indian-saffron">
              Courses
            </Link>
            <Link to="/about" className="px-2 py-1 hover:bg-muted rounded-md transition-colors hover:text-indian-saffron">
              About Us
            </Link>
            <Link to="/contact" className="px-2 py-1 hover:bg-muted rounded-md transition-colors hover:text-indian-saffron">
              Contact
            </Link>
            {user && userRole === 'student' && (
              <Link to="/student-dashboard" className="px-2 py-1 hover:bg-muted rounded-md transition-colors hover:text-indian-saffron">
                Dashboard
              </Link>
            )}
            {user && userRole === 'teacher' && (
              <Link to="/teacher-dashboard" className="px-2 py-1 hover:bg-muted rounded-md transition-colors hover:text-indian-saffron">
                Dashboard
              </Link>
            )}
          </div>
          <div className="flex gap-4">
            {user ? (
              <Button onClick={handleSignOut} variant="outline" className="w-full hover:bg-accent/10 hover:border-indian-saffron transition-all duration-200">
                <LogOut className="h-4 w-4 mr-2" /> Sign Out
              </Button>
            ) : (
              <>
                <Link to="/login" className="flex-1">
                  <Button variant="outline" className="w-full hover:bg-accent/10 hover:border-indian-saffron transition-all duration-200">Login</Button>
                </Link>
                <Link to="/signup" className="flex-1">
                  <Button className="w-full bg-indian-saffron hover:bg-indian-saffron/90 shadow-glow-saffron transition-all duration-300 hover:scale-105">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
