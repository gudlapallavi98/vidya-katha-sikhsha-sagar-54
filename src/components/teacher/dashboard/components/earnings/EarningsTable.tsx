
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign } from "lucide-react";

interface Earning {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  release_date?: string;
  sessions?: {
    title: string;
    start_time: string;
  };
}

interface EarningsTableProps {
  earnings: Earning[];
}

const EarningsTable: React.FC<EarningsTableProps> = ({ earnings }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reverted':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (earnings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Earnings History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Earnings Yet</h3>
            <p className="text-muted-foreground">
              Your earnings from completed sessions will appear here
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Earnings History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Session</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Release Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {earnings.map((earning) => (
              <TableRow key={earning.id}>
                <TableCell>
                  {new Date(earning.created_at).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </TableCell>
                <TableCell>
                  <div className="font-medium">
                    {earning.sessions?.title || 'Session'}
                  </div>
                  {earning.sessions?.start_time && (
                    <div className="text-sm text-muted-foreground">
                      {new Date(earning.sessions.start_time).toLocaleDateString('en-IN')}
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-semibold">
                  ₹{earning.amount.toFixed(2)}
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(earning.status)}>
                    {earning.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {earning.release_date ? 
                    new Date(earning.release_date).toLocaleDateString('en-IN') : 
                    '-'
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default EarningsTable;
