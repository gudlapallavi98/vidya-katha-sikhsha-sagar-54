
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  description,
  trend,
  className,
}) => {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className={cn("rounded-full p-2", "bg-primary/10")}>
            {React.cloneElement(icon as React.ReactElement, { 
              className: "h-5 w-5 text-primary"
            })}
          </div>
          
          {trend && (
            <div className={cn(
              "flex items-center text-xs font-medium",
              trend.isPositive ? "text-green-600" : "text-red-600"
            )}>
              <span className="mr-1">
                {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
              </span>
              <svg 
                className={cn("h-3 w-3", !trend.isPositive && "rotate-180")} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </div>
          )}
        </div>
        
        <div className="mt-4">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-bold">{value}</p>
          {description && (
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
