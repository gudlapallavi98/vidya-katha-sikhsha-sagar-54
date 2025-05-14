
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DashboardCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  footer?: React.ReactNode;
  isLoading?: boolean;
  children?: React.ReactNode;
  headerAction?: React.ReactNode;
}

const DashboardCard = ({
  title,
  description,
  footer,
  isLoading,
  children,
  className,
  headerAction,
  ...props
}: DashboardCardProps) => {
  return (
    <Card className={cn("overflow-hidden", className)} {...props}>
      {(title || description) && (
        <CardHeader className="flex flex-row items-start justify-between pb-2">
          <div>
            {title && <CardTitle>{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </CardHeader>
      )}
      <CardContent className={cn("pt-4", !title && !description && "pt-6")}>
        {isLoading ? (
          <div className="flex h-[120px] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : (
          children
        )}
      </CardContent>
      {footer && <CardFooter className="border-t bg-muted/50 px-6 py-4">{footer}</CardFooter>}
    </Card>
  );
};

export default DashboardCard;
