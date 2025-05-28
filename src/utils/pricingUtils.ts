
export interface PricingCalculation {
  teacherRate: number;
  studentAmount: number;
  platformFee: number;
  teacherPayout: number;
}

export const calculatePricing = (teacherRate: number): PricingCalculation => {
  const platformFee = Math.round(teacherRate * 0.1 * 100) / 100; // 10% platform fee
  const studentAmount = Math.round((teacherRate + platformFee) * 100) / 100; // Teacher rate + platform fee
  const teacherPayout = Math.round((teacherRate - platformFee) * 100) / 100; // Teacher rate - platform fee

  return {
    teacherRate,
    studentAmount,
    platformFee,
    teacherPayout
  };
};

export const formatCurrency = (amount: number): string => {
  return `₹${amount.toFixed(2)}`;
};

export const createPaymentRecord = async (
  userId: string,
  sessionRequestId: string | null,
  sessionId: string | null,
  pricing: PricingCalculation,
  paymentType: 'student_payment' | 'teacher_payout',
  paymentStatus: 'pending' | 'completed' | 'failed' = 'pending'
) => {
  const { supabase } = await import('@/integrations/supabase/client');
  
  const amount = paymentType === 'student_payment' ? pricing.studentAmount : pricing.teacherPayout;
  
  const { data, error } = await supabase
    .from('payment_history')
    .insert({
      user_id: userId,
      session_request_id: sessionRequestId,
      session_id: sessionId,
      amount: amount,
      platform_fee: pricing.platformFee,
      teacher_payout: pricing.teacherPayout,
      payment_type: paymentType,
      payment_status: paymentStatus,
      payment_method: 'upi'
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};
