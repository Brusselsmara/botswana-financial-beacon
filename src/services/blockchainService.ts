
import { supabase } from '@/integrations/supabase/client';

export interface BlockchainWallet {
  id: string;
  user_id: string;
  blockchain: string;
  public_key: string;
  is_active: boolean;
  created_at: string;
}

export interface AssetBalance {
  asset: string;
  balance: string;
}

// Create or get a blockchain wallet for the user
export async function getOrCreateBlockchainWallet(): Promise<{ publicKey: string }> {
  try {
    // Call the Stellar operations endpoint to create or fetch account
    const { data, error } = await supabase.functions.invoke('stellar-operations', {
      body: { operation: 'create_account' }
    });

    if (error) {
      console.error('Error creating blockchain wallet:', error);
      throw new Error(error.message || 'Failed to create blockchain wallet');
    }

    return data;
  } catch (error) {
    console.error('Error in getOrCreateBlockchainWallet:', error);
    throw error;
  }
}

// Get blockchain wallet balance
export async function getBlockchainBalance(publicKey: string): Promise<{ balances: AssetBalance[] }> {
  try {
    const { data, error } = await supabase.functions.invoke('stellar-operations', {
      body: { operation: 'get_balance', publicKey }
    });

    if (error) {
      console.error('Error getting blockchain balance:', error);
      throw new Error(error.message || 'Failed to get blockchain balance');
    }

    return data;
  } catch (error) {
    console.error('Error in getBlockchainBalance:', error);
    throw error;
  }
}

// Send blockchain payment
export async function sendBlockchainPayment(
  secretKey: string,
  destination: string,
  amount: number
): Promise<{ transactionHash: string }> {
  try {
    const { data, error } = await supabase.functions.invoke('stellar-operations', {
      body: {
        operation: 'send_payment',
        secretKey,
        destination,
        amount: amount.toString()
      }
    });

    if (error) {
      console.error('Error sending blockchain payment:', error);
      throw new Error(error.message || 'Failed to send blockchain payment');
    }

    return data;
  } catch (error) {
    console.error('Error in sendBlockchainPayment:', error);
    throw error;
  }
}
