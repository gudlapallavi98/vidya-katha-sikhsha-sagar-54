
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }

  try {
    const webhookData = await req.json()
    console.log('Received Cashfree webhook:', webhookData)

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Extract payment details from webhook
    const {
      order_id: referenceId,
      order_status,
      payment_status,
      order_amount,
    } = webhookData.data || webhookData

    if (!referenceId) {
      console.error('No reference ID in webhook data')
      return new Response(
        JSON.stringify({ error: 'Invalid webhook data' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Update payment status in database
    const { data: updatedPayment, error: updateError } = await supabaseClient
      .from('upi_payments')
      .update({
        status: (order_status || payment_status || 'unknown').toLowerCase(),
        cashfree_response: webhookData,
        updated_at: new Date().toISOString(),
      })
      .eq('reference_id', referenceId)
      .select()

    if (updateError) {
      console.error('Failed to update payment:', updateError)
      return new Response(
        JSON.stringify({ error: 'Failed to update payment' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Payment updated successfully:', updatedPayment)

    // If payment is successful, you can add additional logic here
    // For example, updating session_requests, enrollments, etc.

    return new Response(
      JSON.stringify({ success: true, message: 'Webhook processed' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error processing webhook:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
