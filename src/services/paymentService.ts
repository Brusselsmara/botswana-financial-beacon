
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

export interface Transaction {
  id: string;
  transaction_type: 'send' | 'receive' | 'bill_payment';
  amount: number;
  recipient_identifier: string;
  recipient_name?: string;
  description?: string;
  status: 'pending' | 'completed' | 'failed';
  payment_method: 'wallet' | 'bank' | 'card';
  created_at: string;
  updated_at: string;
}

export interface Wallet {
  id: string;
  user_id: string;
  balance: number;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface BillProvider {
  id: string;
  name: string;
  category: string;
  account_format?: string;
}

// Get wallet balance
export async function getWalletBalance(): Promise<Wallet> {
  const { data, error } = await supabase.functions.invoke('get-wallet-balance');
  
  if (error) {
    console.error('Error getting wallet balance:', error);
    throw new Error(error.message || 'Failed to get wallet balance');
  }
  
  return data;
}

// Get transactions
export async function getTransactions(limit?: number): Promise<Transaction[]> {
  // Fix: Pass parameters in the body property for Edge Functions
  const options = limit ? { body: { limit } } : {};
  const { data, error } = await supabase.functions.invoke('get-transactions', options);
  
  if (error) {
    console.error('Error getting transactions:', error);
    throw new Error(error.message || 'Failed to get transactions');
  }
  
  return data;
}

// Process a payment (send money, bill payment)
export async function processPayment(
  transactionType: 'send' | 'receive' | 'bill_payment',
  amount: number,
  recipientIdentifier: string,
  recipientName?: string,
  description?: string,
  paymentMethod: 'wallet' | 'bank' | 'card' = 'wallet'
): Promise<Transaction> {
  const { data, error } = await supabase.functions.invoke('process-payment', {
    body: {
      transactionType,
      amount,
      recipientIdentifier,
      recipientName,
      description,
      paymentMethod
    }
  });
  
  if (error) {
    console.error('Error processing payment:', error);
    throw new Error(error.message || 'Failed to process payment');
  }
  
  return data;
}

// Get bill providers
export async function getBillProviders(): Promise<BillProvider[]> {
  const { data, error } = await supabase
    .from('bill_providers')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching bill providers:', error);
    throw new Error(error.message || 'Failed to fetch bill providers');
  }
  
  return data || [];
}

// Add a payment method
export async function addPaymentMethod(
  methodType: 'bank' | 'card',
  name: string,
  details: any,
  isDefault: boolean = false
): Promise<any> {
  // Fix for error #2: Get the current user's ID and include it in the payment method
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User is not authenticated');
  }
  
  const { data, error } = await supabase
    .from('payment_methods')
    .insert({
      method_type: methodType,
      name,
      details,
      is_default: isDefault,
      user_id: user.id
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error adding payment method:', error);
    throw new Error(error.message || 'Failed to add payment method');
  }
  
  return data;
}

// Get payment methods
export async function getPaymentMethods(): Promise<any[]> {
  const { data, error } = await supabase
    .from('payment_methods')
    .select('*')
    .order('is_default', { ascending: false });
  
  if (error) {
    console.error('Error fetching payment methods:', error);
    throw new Error(error.message || 'Failed to fetch payment methods');
  }
  
  return data || [];
}
