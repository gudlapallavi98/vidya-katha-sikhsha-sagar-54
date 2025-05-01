
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Fetch the user's role from the profile
  const fetchUserRole = async () => {
    if (user) {
      try {
        const { data } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
          
        if (data) {
          setUserRole(data.role);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    }
  };

  // Call fetchUserRole when user changes
  useState(() => {
    fetchUserRole();
  });

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <header className="border-b border-border/40 bg-background sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-indian-saffron" />
            <span className="font-sanskrit text-2xl font-bold">
              <span className="text-indian-saffron">Vidya</span>{" "}
              <span className="text-indian-blue">Katha</span>
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1">
                  Courses <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuItem>
                  <Link to="/courses?category=school" className="w-full">School Courses</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/courses?category=college" className="w-full">College Courses</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/courses?category=tech" className="w-full">Tech Courses</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/courses?category=language" className="w-full">Language Courses</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/courses?category=competitive" className="w-full">Competitive Exams</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link to="/about" className="text-foreground hover:text-indian-saffron transition-colors">
              About Us
            </Link>
            <Link to="/contact" className="text-foreground hover:text-indian-saffron transition-colors">
              Contact
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
                  <Button variant="ghost" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Account</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Link to="/profile" className="w-full">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-indian-saffron hover:bg-indian-saffron/90">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
        
        <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
          <Menu className="h-6 w-6" />
        </Button>
      </div>
      
      {isMenuOpen && (
        <div className="container md:hidden py-4 space-y-4 border-t">
          <div className="flex flex-col gap-2">
            <Link to="/courses" className="px-2 py-1 hover:bg-muted rounded-md">
              Courses
            </Link>
            <Link to="/about" className="px-2 py-1 hover:bg-muted rounded-md">
              About Us
            </Link>
            <Link to="/contact" className="px-2 py-1 hover:bg-muted rounded-md">
              Contact
            </Link>
            {user && userRole === 'student' && (
              <Link to="/student-dashboard" className="px-2 py-1 hover:bg-muted rounded-md">
                Dashboard
              </Link>
            )}
            {user && userRole === 'teacher' && (
              <Link to="/teacher-dashboard" className="px-2 py-1 hover:bg-muted rounded-md">
                Dashboard
              </Link>
            )}
          </div>
          <div className="flex gap-4">
            {user ? (
              <Button onClick={handleSignOut} variant="outline" className="w-full">
                <LogOut className="h-4 w-4 mr-2" /> Sign Out
              </Button>
            ) : (
              <>
                <Link to="/login" className="flex-1">
                  <Button variant="outline" className="w-full">Login</Button>
                </Link>
                <Link to="/signup" className="flex-1">
                  <Button className="w-full bg-indian-saffron hover:bg-indian-saffron/90">Sign Up</Button>
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
