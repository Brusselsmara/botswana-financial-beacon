
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import * as StellarSdk from "https://esm.sh/stellar-sdk@11.2.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Configure Stellar network connection (using mainnet)
const server = new StellarSdk.Horizon.Server("https://horizon.stellar.org");
const networkPassphrase = StellarSdk.Networks.PUBLIC;

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

    // Get the current user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      console.error("Authentication error:", userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get request body for operation details
    const requestData = await req.json();
    const { operation, publicKey, amount, destination, secretKey } = requestData;

    console.log(`Processing operation: ${operation} for user ${user.id}`);

    // Get or create a Stellar account for the user
    if (operation === 'create_account') {
      try {
        console.log(`Checking if user ${user.id} already has a Stellar account`);
        // Check if user already has a Stellar account
        const { data: existingWallet, error: walletError } = await supabaseClient
          .from('blockchain_wallets')
          .select('public_key, encrypted_secret')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .single();

        if (walletError && !walletError.message.includes('No rows found')) {
          console.error(`Error checking existing wallet:`, walletError);
          throw new Error(`Failed to check for existing wallet: ${walletError.message}`);
        }

        if (existingWallet) {
          console.log(`Found existing wallet: ${existingWallet.public_key}`);
          return new Response(
            JSON.stringify({ 
              success: true, 
              data: { publicKey: existingWallet.public_key } 
            }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log("Generating new Stellar keypair");
        // Generate a new Stellar keypair
        const keypair = StellarSdk.Keypair.random();
        const publicKey = keypair.publicKey();
        const secretKey = keypair.secret();

        console.log(`New keypair generated with public key: ${publicKey}`);

        // Note: On mainnet, we cannot use Friendbot - account needs to be funded externally
        console.log("IMPORTANT: This account needs to be funded externally - minimum 1 XLM");

        // Store the wallet info in the database
        console.log("Storing wallet in database");
        const { error: insertError } = await supabaseClient
          .from('blockchain_wallets')
          .insert({
            user_id: user.id,
            blockchain: 'stellar',
            public_key: publicKey,
            encrypted_secret: secretKey, // In production, use proper encryption
            is_active: true
          });

        if (insertError) {
          console.error("Error storing wallet:", insertError);
          throw new Error(`Failed to store wallet: ${insertError.message}`);
        }

        console.log("Wallet stored successfully");

        return new Response(
          JSON.stringify({ 
            success: true, 
            data: { publicKey } 
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (error) {
        console.error('Error creating Stellar account:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to create Stellar account', details: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Get account balance
    if (operation === 'get_balance') {
      try {
        if (!publicKey) {
          return new Response(
            JSON.stringify({ error: 'Public key is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const account = await server.loadAccount(publicKey);
        
        // Extract balances
        const balances = account.balances.map((balance: any) => {
          return {
            asset: balance.asset_type === 'native' ? 'XLM' : `${balance.asset_code}:${balance.asset_issuer}`,
            balance: balance.balance
          };
        });

        return new Response(
          JSON.stringify({ success: true, data: { balances } }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (error) {
        console.error('Error getting Stellar account balance:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to get Stellar account balance', details: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Send payment
    if (operation === 'send_payment') {
      try {
        if (!secretKey || !destination || !amount) {
          return new Response(
            JSON.stringify({ error: 'Secret key, destination, and amount are required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Parse amount to ensure it's a valid number
        const paymentAmount = parseFloat(amount);
        if (isNaN(paymentAmount) || paymentAmount <= 0) {
          return new Response(
            JSON.stringify({ error: 'Invalid amount' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Load sender account
        const sourceKeypair = StellarSdk.Keypair.fromSecret(secretKey);
        const sourcePublicKey = sourceKeypair.publicKey();
        const sourceAccount = await server.loadAccount(sourcePublicKey);

        // Create a payment operation
        const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
          fee: StellarSdk.BASE_FEE,
          networkPassphrase
        })
          .addOperation(
            StellarSdk.Operation.payment({
              destination,
              asset: StellarSdk.Asset.native(),
              amount: paymentAmount.toString()
            })
          )
          .setTimeout(180)
          .build();

        // Sign and submit transaction
        transaction.sign(sourceKeypair);
        const result = await server.submitTransaction(transaction);

        // Record the transaction in our database
        await supabaseClient
          .from('transactions')
          .insert({
            user_id: user.id,
            transaction_type: 'send',
            amount: paymentAmount,
            recipient_identifier: destination,
            description: 'Blockchain payment via Stellar',
            payment_method: 'blockchain',
            status: 'completed',
            blockchain_tx_hash: result.hash
          });

        return new Response(
          JSON.stringify({ 
            success: true, 
            data: { 
              transactionHash: result.hash,
              resultXdr: result.result_xdr
            } 
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (error) {
        console.error('Error sending Stellar payment:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to send Stellar payment', details: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Load funds from card to blockchain wallet
    if (operation === 'load_funds') {
      try {
        const { cardDetails, amount, currency } = requestData;
        
        if (!publicKey || !amount || !cardDetails) {
          return new Response(
            JSON.stringify({ error: 'Public key, amount, and card details are required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // In a real implementation, you would integrate with a payment processor here
        // For this demo, we'll simulate a successful transaction and update balances
        
        // Record the transaction as a "load" transaction
        await supabaseClient
          .from('transactions')
          .insert({
            user_id: user.id,
            transaction_type: 'load',
            amount: parseFloat(amount),
            recipient_identifier: publicKey,
            description: 'Card load to blockchain wallet',
            payment_method: 'card',
            status: 'completed',
            currency: currency || 'BWP'
          });

        // Update user's wallet balance
        await supabaseClient
          .from('wallets')
          .upsert({
            user_id: user.id,
            balance: supabaseClient.rpc('increment_balance', { amount_to_add: parseFloat(amount) }),
            currency: currency || 'BWP',
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id'
          });

        return new Response(
          JSON.stringify({ 
            success: true, 
            data: { 
              amount,
              currency: currency || 'BWP',
              timestamp: new Date().toISOString()
            } 
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (error) {
        console.error('Error loading funds:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to load funds from card', details: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    return new Response(
      JSON.stringify({ error: 'Invalid operation' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
