
import React from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface NavigationTileProps {
  icon: LucideIcon;
  label: string;
  path: string;
  isActive?: boolean;
}

const NavigationTile: React.FC<NavigationTileProps> = ({
  icon: Icon,
  label,
  path,
  isActive = false,
}) => {
  const navigate = useNavigate();
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(path);
  };
  
  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-md",
        isActive 
          ? "bg-gradient-to-br from-indian-blue/20 to-indian-blue/10 border-indian-blue/30" 
          : "hover:bg-accent"
      )}
      onClick={handleClick}
    >
      <CardContent className="p-6 flex flex-col items-center justify-center text-center">
        <div className={cn(
          "p-4 rounded-full mb-3",
          isActive
            ? "bg-indian-blue/20 text-indian-blue"
            : "bg-muted text-muted-foreground"
        )}>
          <Icon className="h-8 w-8" />
        </div>
        <h3 className={cn(
          "font-medium text-sm",
          isActive ? "text-indian-blue" : "text-muted-foreground"
        )}>
          {label}
        </h3>
      </CardContent>
    </Card>
  );
};

export default NavigationTile;
