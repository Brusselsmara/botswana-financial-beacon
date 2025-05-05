
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getOrCreateBlockchainWallet, getBlockchainBalance, AssetBalance } from "@/services/blockchainService";
import { toast } from "sonner";
import { Copy, ExternalLink } from "lucide-react";

export function BlockchainWallet() {
  const [publicKey, setPublicKey] = useState<string>("");
  const [balances, setBalances] = useState<AssetBalance[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  // Load or create wallet on component mount
  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    setIsLoading(true);
    try {
      const { publicKey } = await getOrCreateBlockchainWallet();
      setPublicKey(publicKey);
      
      if (publicKey) {
        fetchBalances(publicKey);
      }
    } catch (error) {
      console.error("Error fetching blockchain wallet:", error);
      toast.error("Failed to load blockchain wallet");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBalances = async (key: string) => {
    try {
      const { balances } = await getBlockchainBalance(key);
      setBalances(balances);
    } catch (error) {
      console.error("Error fetching blockchain balances:", error);
      toast.error("Failed to load blockchain balances");
    }
  };

  const createWallet = async () => {
    setIsCreating(true);
    try {
      const { publicKey } = await getOrCreateBlockchainWallet();
      setPublicKey(publicKey);
      fetchBalances(publicKey);
      toast.success("Blockchain wallet created successfully");
    } catch (error) {
      console.error("Error creating blockchain wallet:", error);
      toast.error("Failed to create blockchain wallet");
    } finally {
      setIsCreating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Address copied to clipboard");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Blockchain Wallet</CardTitle>
        <CardDescription>
          Your Stellar blockchain wallet for fast, low-fee transactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
          </div>
        ) : publicKey ? (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Wallet Address</h3>
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                <code className="text-xs md:text-sm truncate max-w-[200px] md:max-w-[300px]">
                  {publicKey}
                </code>
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => copyToClipboard(publicKey)}
                    title="Copy wallet address"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => window.open(`https://stellar.expert/explorer/testnet/account/${publicKey}`, '_blank')}
                    title="View on Explorer"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Balances</h3>
              {balances.length > 0 ? (
                <div className="space-y-2">
                  {balances.map((balance, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                      <span className="font-medium">{balance.asset}</span>
                      <span>{Number(balance.balance).toFixed(7)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No balances found</p>
              )}
            </div>

            <Button 
              onClick={() => fetchBalances(publicKey)} 
              variant="outline" 
              className="w-full"
            >
              Refresh Balances
            </Button>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="mb-4 text-gray-600">You don't have a blockchain wallet yet.</p>
            <Button 
              onClick={createWallet} 
              disabled={isCreating}
              className="bg-pulapay-blue hover:bg-pulapay-blue-dark"
            >
              {isCreating ? "Creating..." : "Create Wallet"}
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-start border-t px-6 py-4">
        <p className="text-xs text-gray-500">
          Your Stellar blockchain wallet supports USDC, XLM, and other assets on the Stellar network. 
          Transactions are secure and typically complete within 3-5 seconds.
        </p>
      </CardFooter>
    </Card>
  );
}
