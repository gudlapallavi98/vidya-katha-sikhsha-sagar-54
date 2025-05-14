
import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, User, Settings, Home, Book, Calendar, Clock, MessageSquare } from "lucide-react";
import { useLocation } from "react-router-dom";

interface RadialMenuItemProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  index: number;
  totalItems: number;
  isOpen: boolean;
  isActive: boolean;
}

interface RadialMenuProps {
  items?: {
    icon: React.ReactNode;
    label: string;
    path: string;
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
  isActive,
}) => {
  // Calculate position in a semicircle on the left side
  const radius = 100; // px - increased radius for better visibility
  // Distribute items in a semicircle on the left side (from -90° to 90°)
  const angle = (index * Math.PI) / (totalItems - 1) - Math.PI / 2;
  const x = -radius * Math.cos(angle); // Negative to go to the left
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
      className="absolute z-50"
    >
      <Button
        onClick={onClick}
        variant="default"
        size="icon"
        className={cn(
          "rounded-full shadow-lg h-12 w-12 flex flex-col items-center justify-center",
          isActive 
            ? "bg-blue-500 hover:bg-blue-600" 
            : "bg-primary hover:bg-primary/90"
        )}
        title={label}
      >
        {icon}
        <span className="sr-only">{label}</span>
      </Button>
    </motion.div>
  );
};

export const RadialMenu: React.FC<RadialMenuProps> = ({
  items = [],
  className,
  triggerIcon = <Menu className="h-6 w-6" />,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();
  const currentPath = location.pathname;
  
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

  // Get current tab from URL
  const searchParams = new URLSearchParams(location.search);
  const currentTab = searchParams.get('tab') || "overview";

  return (
    <div
      className={cn(
        "fixed bottom-6 left-6 z-[100] radial-menu-container",
        className
      )}
    >
      {/* Radial menu items */}
      {items.map((item, index) => {
        // Check if this item is active based on path and query params
        const itemPath = item.path.split("?")[0];
        const itemQuery = new URLSearchParams(item.path.split("?")[1] || "");
        const itemTab = itemQuery.get("tab") || "";
        
        const isActive = 
          (itemPath === currentPath) && 
          (itemTab === "" || itemTab === currentTab);
          
        return (
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
            isActive={isActive}
          />
        );
      })}

      {/* Main floating button */}
      <Button
        onClick={(e) => {
          e.stopPropagation();
          toggleMenu();
        }}
        variant="default"
        size="icon"
        className={cn(
          "rounded-full h-14 w-14 shadow-lg bg-blue-500 hover:bg-blue-600 z-[101] transition-transform",
          isOpen ? "rotate-45" : ""
        )}
      >
        {triggerIcon}
      </Button>
    </div>
  );
};
