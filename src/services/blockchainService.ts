
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

export interface CardDetails {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
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

// Load funds from card to blockchain wallet
export async function loadFundsFromCard(
  publicKey: string,
  amount: number,
  currency: string,
  cardDetails: CardDetails
): Promise<{ amount: number; currency: string; timestamp: string }> {
  try {
    // Mask card number for security
    const maskedCard = {
      ...cardDetails,
      cardNumber: cardDetails.cardNumber.replace(/\d(?=\d{4})/g, "*")
    };
    
    const { data, error } = await supabase.functions.invoke('stellar-operations', {
      body: {
        operation: 'load_funds',
        publicKey,
        amount: amount.toString(),
        currency,
        cardDetails: maskedCard
      }
    });

    if (error) {
      console.error('Error loading funds from card:', error);
      throw new Error(error.message || 'Failed to load funds from card');
    }

    return data;
  } catch (error) {
    console.error('Error in loadFundsFromCard:', error);
    throw error;
  }
}

// Get currency exchange rate (XLM to BWP)
export async function getExchangeRate(): Promise<number> {
  // In a real app, this would fetch from an exchange rate API
  // For demo purposes, we'll use a fixed rate
  return 12.5; // 1 XLM = 12.5 BWP
}
