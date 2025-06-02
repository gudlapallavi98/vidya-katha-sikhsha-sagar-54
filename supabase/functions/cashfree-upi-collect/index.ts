
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

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get user from JWT token
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (req.method === 'POST') {
      const { amount, upiId } = await req.json()

      if (!amount || !upiId || amount <= 0) {
        return new Response(
          JSON.stringify({ error: 'Invalid amount or UPI ID' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // Generate unique reference ID
      const referenceId = `UPI_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      console.log('Creating UPI collect request:', { referenceId, amount, upiId })

      // Get Cashfree credentials
      const clientId = Deno.env.get('CASHFREE_CLIENT_ID')
      const clientSecret = Deno.env.get('CASHFREE_SECRET_KEY')

      if (!clientId || !clientSecret) {
        return new Response(
          JSON.stringify({ error: 'Cashfree credentials not configured' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // Get Cashfree access token
      const tokenResponse = await fetch('https://api.cashfree.com/pg/auth/realtime', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-client-id': clientId,
          'x-client-secret': clientSecret,
        },
      })

      if (!tokenResponse.ok) {
        console.error('Failed to get Cashfree token:', await tokenResponse.text())
        return new Response(
          JSON.stringify({ error: 'Failed to authenticate with Cashfree' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      const tokenData = await tokenResponse.json()
      const accessToken = tokenData.access_token

      // Create UPI collect request
      const collectPayload = {
        reference_id: referenceId,
        amount: parseFloat(amount),
        currency: 'INR',
        upi_id: upiId,
        description: 'Payment via Etutorss Platform',
        collect_request: {
          method: 'upi',
          expire_by: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes
        }
      }

      console.log('Sending UPI collect request to Cashfree:', collectPayload)

      const collectResponse = await fetch('https://api.cashfree.com/pg/upi/collect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'x-client-id': clientId,
        },
        body: JSON.stringify(collectPayload),
      })

      const collectData = await collectResponse.json()
      console.log('Cashfree collect response:', collectData)

      if (!collectResponse.ok) {
        console.error('Cashfree collect failed:', collectData)
        return new Response(
          JSON.stringify({ 
            error: 'Failed to create UPI collect request',
            details: collectData 
          }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // Store payment in database
      const { data: payment, error: dbError } = await supabaseClient
        .from('upi_payments')
        .insert({
          reference_id: referenceId,
          user_id: user.id,
          amount: parseFloat(amount),
          upi_id: upiId,
          status: 'pending',
          cashfree_response: collectData,
          upi_uri: collectData.upi_uri || null,
        })
        .select()
        .single()

      if (dbError) {
        console.error('Database error:', dbError)
        return new Response(
          JSON.stringify({ error: 'Failed to store payment data' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      return new Response(
        JSON.stringify({
          success: true,
          reference_id: referenceId,
          upi_uri: collectData.upi_uri,
          payment_data: collectData,
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // GET request - check payment status
    if (req.method === 'GET') {
      const url = new URL(req.url)
      const referenceId = url.searchParams.get('reference_id')

      if (!referenceId) {
        return new Response(
          JSON.stringify({ error: 'Reference ID required' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // Get payment from database
      const { data: payment, error: dbError } = await supabaseClient
        .from('upi_payments')
        .select('*')
        .eq('reference_id', referenceId)
        .eq('user_id', user.id)
        .single()

      if (dbError || !payment) {
        return new Response(
          JSON.stringify({ error: 'Payment not found' }),
          { 
            status: 404, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // Check status with Cashfree
      const clientId = Deno.env.get('CASHFREE_CLIENT_ID')
      const clientSecret = Deno.env.get('CASHFREE_SECRET_KEY')

      // Get access token
      const tokenResponse = await fetch('https://api.cashfree.com/pg/auth/realtime', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-client-id': clientId!,
          'x-client-secret': clientSecret!,
        },
      })

      const tokenData = await tokenResponse.json()
      const accessToken = tokenData.access_token

      // Get payment status
      const statusResponse = await fetch(`https://api.cashfree.com/pg/orders/${referenceId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'x-client-id': clientId!,
        },
      })

      const statusData = await statusResponse.json()

      // Update local payment status if different
      if (statusData.order_status && statusData.order_status !== payment.status) {
        await supabaseClient
          .from('upi_payments')
          .update({
            status: statusData.order_status.toLowerCase(),
            cashfree_response: statusData,
          })
          .eq('reference_id', referenceId)
      }

      return new Response(
        JSON.stringify({
          reference_id: referenceId,
          status: statusData.order_status?.toLowerCase() || payment.status,
          payment_data: statusData,
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in cashfree-upi-collect:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
