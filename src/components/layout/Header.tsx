
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X, GraduationCap } from "lucide-react";
import { useMobile } from "@/hooks/use-mobile";

const Header = () => {
  const { user, signOut } = useAuth();
  const { isMobile } = useMobile();
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Courses", path: "/courses" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const NavList = ({ className = "", onItemClick = () => {} }: 
    { className?: string, onItemClick?: () => void }) => (
    <ul className={`${className}`}>
      {navItems.map((item) => (
        <li key={item.path}>
          <Link
            to={item.path}
            className={`text-sm px-4 py-2 rounded transition-colors block hover:bg-muted ${
              isActive(item.path)
                ? "font-medium text-primary"
                : "text-muted-foreground"
            }`}
            onClick={onItemClick}
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-sm border-b shadow-sm"
          : "bg-white border-b"
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 mr-4">
          <Link to="/" className="flex items-center gap-2">
            <GraduationCap className="h-7 w-7 text-indian-saffron" />
            <h1 className="font-sanskrit text-xl font-bold flex items-center">
              <span className="text-indian-saffron">e</span>
              <span className="text-indian-blue">tutorss</span>
            </h1>
          </Link>
        </div>

        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80vw] sm:w-[350px] pr-0">
              <div className="flex flex-row items-center gap-2 mb-6">
                <GraduationCap className="h-6 w-6 text-indian-saffron" />
                <h3 className="font-sanskrit text-lg font-bold">
                  <span className="text-indian-saffron">e</span>
                  <span className="text-indian-blue">tutorss</span>
                </h3>
                <SheetClose className="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </SheetClose>
              </div>
              <div className="grid gap-2 py-4">
                <div className="flex flex-col space-y-3">
                  {!user ? (
                    <>
                      <SheetClose asChild>
                        <NavList />
                      </SheetClose>
                      <SheetClose asChild>
                        <Link to="/login" className="w-full">
                          <Button
                            className="w-full bg-indian-saffron hover:bg-indian-saffron/90"
                            size="sm"
                          >
                            Sign In
                          </Button>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link to="/signup" className="w-full">
                          <Button variant="outline" size="sm" className="w-full">
                            Sign Up
                          </Button>
                        </Link>
                      </SheetClose>
                    </>
                  ) : (
                    <>
                      <SheetClose asChild>
                        <NavList />
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          to={
                            user.user_metadata.role === "student"
                              ? "/student-dashboard"
                              : "/teacher-dashboard"
                          }
                          className="w-full"
                        >
                          <Button
                            size="sm"
                            className="w-full bg-indian-saffron hover:bg-indian-saffron/90"
                          >
                            Dashboard
                          </Button>
                        </Link>
                      </SheetClose>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => signOut()}
                      >
                        Sign Out
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <nav className="flex items-center justify-between flex-1">
            <NavList className="flex" />
            <div className="flex items-center gap-2">
              {!user ? (
                <>
                  <Link to="/login">
                    <Button
                      className="bg-indian-saffron hover:bg-indian-saffron/90"
                      size="sm"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button variant="outline" size="sm">
                      Sign Up
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to={
                      user.user_metadata.role === "student"
                        ? "/student-dashboard"
                        : "/teacher-dashboard"
                    }
                  >
                    <Button
                      size="sm"
                      className="bg-indian-saffron hover:bg-indian-saffron/90"
                    >
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => signOut()}
                  >
                    Sign Out
                  </Button>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
