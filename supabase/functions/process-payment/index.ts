
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the current user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the request body
    const { 
      transactionType, 
      amount, 
      recipientIdentifier,
      recipientName,
      description, 
      paymentMethod 
    } = await req.json();

    // Basic validation
    if (!transactionType || !amount || !recipientIdentifier || !paymentMethod) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the user's wallet
    const { data: walletData, error: walletError } = await supabaseClient
      .from('wallets')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (walletError || !walletData) {
      return new Response(
        JSON.stringify({ error: 'Wallet not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // For send money and bill payment, check if enough balance
    if ((transactionType === 'send' || transactionType === 'bill_payment') && walletData.balance < amount) {
      return new Response(
        JSON.stringify({ error: 'Insufficient funds' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Process the transaction based on type
    if (transactionType === 'send') {
      // Deduct from sender's wallet
      const { error: updateError } = await supabaseClient
        .from('wallets')
        .update({ balance: walletData.balance - amount })
        .eq('user_id', user.id);

      if (updateError) {
        return new Response(
          JSON.stringify({ error: 'Failed to update wallet' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } else if (transactionType === 'receive') {
      // Add to receiver's wallet
      const { error: updateError } = await supabaseClient
        .from('wallets')
        .update({ balance: walletData.balance + amount })
        .eq('user_id', user.id);

      if (updateError) {
        return new Response(
          JSON.stringify({ error: 'Failed to update wallet' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } else if (transactionType === 'bill_payment') {
      // Deduct from user's wallet
      const { error: updateError } = await supabaseClient
        .from('wallets')
        .update({ balance: walletData.balance - amount })
        .eq('user_id', user.id);

      if (updateError) {
        return new Response(
          JSON.stringify({ error: 'Failed to update wallet' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Record the transaction
    const { data: transactionData, error: transactionError } = await supabaseClient
      .from('transactions')
      .insert({
        user_id: user.id,
        transaction_type: transactionType,
        amount,
        recipient_identifier: recipientIdentifier,
        recipient_name: recipientName,
        description,
        payment_method: paymentMethod,
        status: 'completed'
      })
      .select()
      .single();

    if (transactionError) {
      return new Response(
        JSON.stringify({ error: 'Failed to create transaction record' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: transactionData }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
