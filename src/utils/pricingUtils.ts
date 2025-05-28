
export interface PricingCalculation {
  teacherRate: number;
  studentAmount: number;
  platformFee: number;
  teacherPayout: number;
}

export const calculatePricing = (teacherRate: number): PricingCalculation => {
  // Round to 2 decimal places for accurate calculations
  const rate = Math.round(teacherRate * 100) / 100;
  const platformFee = Math.round(rate * 0.1 * 100) / 100; // 10% platform fee
  const studentAmount = Math.round((rate + platformFee) * 100) / 100; // Teacher rate + platform fee  
  const teacherPayout = Math.round((rate - platformFee) * 100) / 100; // Teacher rate - platform fee (90% of original rate)

  console.log("Pricing calculation:", {
    originalRate: teacherRate,
    adjustedRate: rate,
    platformFee,
    studentAmount,
    teacherPayout
  });

  return {
    teacherRate: rate,
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
  
  console.log("Creating payment record:", {
    userId,
    sessionRequestId,
    sessionId,
    amount,
    platformFee: pricing.platformFee,
    teacherPayout: pricing.teacherPayout,
    paymentType,
    paymentStatus
  });
  
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

  if (error) {
    console.error("Payment record creation error:", error);
    throw error;
  }
  
  console.log("Payment record created successfully:", data);
  return data;
};
