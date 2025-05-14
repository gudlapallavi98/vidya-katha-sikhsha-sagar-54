
import React from "react";
import { cn } from "@/lib/utils";

interface DashboardShellProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function DashboardShell({
  children,
  className,
  ...props
}: DashboardShellProps) {
  return (
    <div className={cn("grid items-start gap-8", className)} {...props}>
      {children}
    </div>
  );
}

interface DashboardHeaderProps {
  heading: string;
  subheading?: string;
  children?: React.ReactNode;
}

export function DashboardHeader({
  heading,
  subheading,
  children,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="font-sanskrit text-3xl font-bold tracking-tight">{heading}</h1>
        {subheading && (
          <p className="text-muted-foreground">{subheading}</p>
        )}
      </div>
      {children}
    </div>
  );
}
