
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { getOrCreateBlockchainWallet, getBlockchainBalance, getExchangeRate } from "@/services/blockchainService";

interface AccountSummaryProps {
  balance: number;
  currency?: string;
  isLoading?: boolean;
}

export function AccountSummary({ balance, currency = "BWP", isLoading = false }: AccountSummaryProps) {
  const [cryptoBalance, setCryptoBalance] = useState<string>("0");
  const [isLoadingCrypto, setIsLoadingCrypto] = useState<boolean>(false);
  const [exchangeRate, setExchangeRate] = useState<number>(1);
  
  useEffect(() => {
    const fetchBlockchainBalance = async () => {
      setIsLoadingCrypto(true);
      try {
        // Get the wallet
        const { publicKey } = await getOrCreateBlockchainWallet();
        
        // Get the balances
        if (publicKey) {
          const { balances } = await getBlockchainBalance(publicKey);
          // Find XLM balance
          const xlmBalance = balances.find(b => b.asset === 'XLM');
          if (xlmBalance) {
            setCryptoBalance(xlmBalance.balance);
          }
        }
        
        // Get exchange rate
        const rate = await getExchangeRate();
        setExchangeRate(rate);
      } catch (error) {
        console.error("Error fetching blockchain balance:", error);
      } finally {
        setIsLoadingCrypto(false);
      }
    };
    
    fetchBlockchainBalance();
  }, [balance]); // Refetch when fiat balance changes
  
  const formattedBalance = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'BWP',
    minimumFractionDigits: 2
  }).format(balance);
  
  // Calculate equivalent crypto value
  const cryptoEquivalent = balance > 0 && exchangeRate > 0 ? (balance / exchangeRate) : 0;
  const formattedCryptoEquivalent = cryptoEquivalent.toFixed(7);
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pulapay-gradient text-white">
        <CardTitle className="text-lg font-medium">Account Balance</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Available Balance</p>
            {isLoading ? (
              <div className="h-8 w-36 bg-gray-200 animate-pulse rounded mt-1"></div>
            ) : (
              <>
                <p className="text-3xl font-semibold">{formattedBalance}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {isLoadingCrypto ? (
                    <span className="inline-block w-24 h-4 bg-gray-200 animate-pulse rounded"></span>
                  ) : (
                    <>≈ {formattedCryptoEquivalent} XLM</>
                  )}
                </p>
              </>
            )}
          </div>
          <a href="/blockchain" className="text-sm text-pulapay-blue hover:underline">
            Add Money
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
