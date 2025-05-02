
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AccountSummary } from "@/components/dashboard/AccountSummary";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { TransactionsList } from "@/components/dashboard/TransactionsList";
import { getWalletBalance, getTransactions } from "@/services/paymentService";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export function Dashboard() {
  const { user } = useAuth();
  const firstName = user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'User';
  
  // Query for wallet balance
  const { 
    data: wallet,
    isLoading: isLoadingWallet,
    error: walletError 
  } = useQuery({
    queryKey: ['wallet'],
    queryFn: getWalletBalance,
    retry: 1
  });

  // Query for recent transactions
  const { 
    data: transactions,
    isLoading: isLoadingTransactions,
    error: transactionsError 
  } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => getTransactions(5),
    retry: 1
  });

  // Handle errors
  useEffect(() => {
    if (walletError) {
      toast.error("Failed to load wallet", {
        description: "Please refresh the page to try again.",
      });
    }
    
    if (transactionsError) {
      toast.error("Failed to load transactions", {
        description: "Please refresh the page to try again.",
      });
    }
  }, [walletError, transactionsError]);

  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome, {firstName}</h1>
        <p className="text-gray-500">Manage your finances with ease</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <AccountSummary 
          balance={wallet?.balance || 0} 
          isLoading={isLoadingWallet}
        />
        <QuickActions />
      </div>
      
      <TransactionsList 
        transactions={transactions || []} 
        isLoading={isLoadingTransactions}
      />
    </div>
  );
}

export default Dashboard;
