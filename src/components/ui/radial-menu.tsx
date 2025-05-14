
import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, User, Settings, Home, Book } from "lucide-react";

interface RadialMenuItemProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  index: number;
  totalItems: number;
  isOpen: boolean;
}

interface RadialMenuProps {
  items?: {
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
  }[];
  className?: string;
  triggerIcon?: React.ReactNode;
}

const RadialMenuItem: React.FC<RadialMenuItemProps> = ({
  icon,
  label,
  onClick,
  index,
  totalItems,
  isOpen,
}) => {
  // Calculate position in the circle
  const radius = 80; // px
  const angle = (index * (2 * Math.PI)) / totalItems; // Divide the circle evenly
  const x = radius * Math.cos(angle);
  const y = radius * Math.sin(angle);

  return (
    <motion.div
      initial={{ scale: 0, x: 0, y: 0 }}
      animate={
        isOpen
          ? {
              scale: 1,
              x: x,
              y: y,
              transition: { delay: index * 0.05, type: "spring" },
            }
          : { scale: 0, x: 0, y: 0 }
      }
      className="absolute z-10"
    >
      <Button
        onClick={onClick}
        variant="default"
        size="icon"
        className="rounded-full shadow-lg bg-primary hover:bg-primary/90 h-12 w-12 flex flex-col items-center justify-center"
        title={label}
      >
        {icon}
        <span className="sr-only">{label}</span>
      </Button>
    </motion.div>
  );
};

export const RadialMenu: React.FC<RadialMenuProps> = ({
  items = [
    { icon: <Home className="h-5 w-5" />, label: "Home", onClick: () => window.location.href = "/" },
    { icon: <User className="h-5 w-5" />, label: "Profile", onClick: () => window.location.href = "/profile" },
    { icon: <Book className="h-5 w-5" />, label: "Courses", onClick: () => window.location.href = "/courses" },
    { icon: <Settings className="h-5 w-5" />, label: "Settings", onClick: () => window.location.href = "/profile?tab=settings" },
  ],
  className,
  triggerIcon = <Menu className="h-6 w-6" />,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isOpen && !target.closest(".radial-menu-container")) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-50 radial-menu-container",
        className
      )}
    >
      {/* Radial menu items */}
      {items.map((item, index) => (
        <RadialMenuItem
          key={`radial-item-${index}`}
          icon={item.icon}
          label={item.label}
          onClick={() => {
            if (item.onClick) {
              item.onClick();
            }
            setIsOpen(false);
          }}
          index={index}
          totalItems={items.length}
          isOpen={isOpen}
        />
      ))}

      {/* Main floating button */}
      <Button
        onClick={(e) => {
          e.stopPropagation();
          toggleMenu();
        }}
        variant="default"
        size="icon"
        className={cn(
          "rounded-full h-14 w-14 shadow-lg bg-primary hover:bg-primary/90 z-20 transition-transform",
          isOpen ? "rotate-45" : ""
        )}
      >
        {triggerIcon}
      </Button>
    </div>
  );
};
