
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GraduationCap, Menu, X, User, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Navigation items
  const navItems = [
    { name: "Home", path: "/" },
    { name: "Courses", path: "/courses" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const isDashboard = location.pathname.includes("dashboard");

  // Handle logout
  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // Get user role for dashboard link
  const dashboardLink = user?.role === "teacher" ? "/teacher-dashboard" : "/student-dashboard";

  // Get user initials for avatar
  const getInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`;
    }
    return "U";
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur",
        isDashboard ? "shadow-sm" : ""
      )}
    >
      <div className="container flex h-16 items-center justify-between py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <GraduationCap className="h-8 w-8 text-indian-saffron" />
          <h1 className="font-sanskrit text-2xl font-bold">
            <span className="text-orange-500 text-3xl">E</span>
            <span className="text-indian-blue">tutors</span>
            <span className="text-green-500">s</span>
          </h1>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "text-sm font-medium transition-colors hover:text-indian-saffron",
                location.pathname === item.path
                  ? "text-indian-saffron"
                  : "text-muted-foreground"
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Auth Buttons or User Menu */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={user.avatar_url || undefined}
                        alt={user.first_name || "User"}
                      />
                      <AvatarFallback>{getInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    {user.first_name} {user.last_name}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => navigate(dashboardLink)}
                    className="cursor-pointer"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" className="hidden sm:flex">
                  Log in
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-indian-saffron hover:bg-indian-saffron/90">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
          >
            {mobileNavOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileNavOpen && (
        <div className="md:hidden border-t p-4">
          <nav className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-indian-saffron",
                  location.pathname === item.path
                    ? "text-indian-saffron"
                    : "text-muted-foreground"
                )}
                onClick={() => setMobileNavOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {!user && (
              <Link
                to="/login"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-indian-saffron"
                onClick={() => setMobileNavOpen(false)}
              >
                Log in
              </Link>
            )}
            {user && (
              <Link
                to={dashboardLink}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-indian-saffron"
                onClick={() => setMobileNavOpen(false)}
              >
                Dashboard
              </Link>
            )}
            {user && (
              <button
                onClick={() => {
                  handleLogout();
                  setMobileNavOpen(false);
                }}
                className="text-sm font-medium text-left text-muted-foreground transition-colors hover:text-indian-saffron"
              >
                Logout
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
