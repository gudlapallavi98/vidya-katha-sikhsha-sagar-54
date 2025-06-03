
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface IndianStatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  borderColor?: 'saffron' | 'green' | 'blue';
  className?: string;
}

const IndianStatsCard: React.FC<IndianStatsCardProps> = ({
  title,
  value,
  icon,
  description,
  trend,
  borderColor = 'saffron',
  className,
}) => {
  const borderColorClasses = {
    saffron: 'border-l-[#FF9933]',
    green: 'border-l-[#138808]', 
    blue: 'border-l-[#000080]'
  };

  return (
    <Card className={cn(
      "overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-l-4",
      borderColorClasses[borderColor],
      className
    )}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="p-3 rounded-full bg-gradient-to-br from-orange-50 to-orange-100">
            {React.cloneElement(icon as React.ReactElement, { 
              className: cn("h-6 w-6", {
                "text-[#FF9933]": borderColor === 'saffron',
                "text-[#138808]": borderColor === 'green',
                "text-[#000080]": borderColor === 'blue'
              })
            })}
          </div>
          
          {trend && (
            <div className={cn(
              "flex items-center text-xs font-medium px-2 py-1 rounded-full",
              trend.isPositive 
                ? "text-[#138808] bg-green-50" 
                : "text-red-600 bg-red-50"
            )}>
              <span className="mr-1">
                {trend.isPositive ? "↗" : "↘"} {Math.abs(trend.value)}%
              </span>
            </div>
          )}
        </div>
        
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
          {description && (
            <p className="mt-1 text-xs text-gray-500">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default IndianStatsCard;
