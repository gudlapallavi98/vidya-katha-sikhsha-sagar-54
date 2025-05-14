
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  colorClass: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  colorClass,
}) => {
  return (
    <Card className={cn("bg-gradient-to-br", `from-${colorClass}/10 to-${colorClass}/5`)}>
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
        <div className={cn("h-12 w-12 rounded-full flex items-center justify-center", `bg-${colorClass}/20`)}>
          {React.cloneElement(icon as React.ReactElement, { 
            className: cn("h-6 w-6", `text-${colorClass}`) 
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
