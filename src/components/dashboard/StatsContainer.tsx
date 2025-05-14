
import React from "react";
import { cn } from "@/lib/utils";

interface StatsContainerProps {
  children: React.ReactNode;
  className?: string;
}

const StatsContainer = ({ children, className }: StatsContainerProps) => {
  return (
    <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4", className)}>
      {children}
    </div>
  );
};

export default StatsContainer;
