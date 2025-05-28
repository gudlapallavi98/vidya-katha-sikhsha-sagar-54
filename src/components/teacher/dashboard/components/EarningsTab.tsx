
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { TrendingUp } from "lucide-react";
import EarningsOverview from "./earnings/EarningsOverview";
import EarningsTable from "./earnings/EarningsTable";

const EarningsTab: React.FC = () => {
  const { user } = useAuth();

  const { data: earnings = [], isLoading } = useQuery({
    queryKey: ['teacher_earnings', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('teacher_earnings')
        .select(`
          *,
          sessions(title, start_time)
        `)
        .eq('teacher_id', user?.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const totalEarnings = earnings.reduce((sum, earning) => sum + Number(earning.amount), 0);
  const confirmedEarnings = earnings
    .filter(e => e.status === 'confirmed')
    .reduce((sum, earning) => sum + Number(earning.amount), 0);
  const pendingEarnings = earnings
    .filter(e => e.status === 'pending')
    .reduce((sum, earning) => sum + Number(earning.amount), 0);

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading earnings...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Earnings & Payments</h2>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            ₹{totalEarnings.toFixed(2)} total
          </span>
        </div>
      </div>

      <EarningsOverview
        totalEarnings={totalEarnings}
        confirmedEarnings={confirmedEarnings}
        pendingEarnings={pendingEarnings}
      />

      <EarningsTable earnings={earnings} />
    </div>
  );
};

export default EarningsTab;
