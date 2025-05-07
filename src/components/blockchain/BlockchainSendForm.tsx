
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { getOrCreateBlockchainWallet, getBlockchainBalance, sendBlockchainPayment } from "@/services/blockchainService";
import { processPayment } from "@/services/paymentService";
import { useQueryClient } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";

export function BlockchainSendForm() {
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [memo, setMemo] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [secretKey, setSecretKey] = useState(""); // In a real app, don't expose this to frontend!
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [hasBalance, setHasBalance] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    // Fetch user's blockchain wallet
    const loadWallet = async () => {
      try {
        const { publicKey } = await getOrCreateBlockchainWallet();
        setPublicKey(publicKey);
        
        if (publicKey) {
          // Check if the wallet has any balance
          const { balances } = await getBlockchainBalance(publicKey);
          setHasBalance(balances.length > 0);
        }
        
        // In a real application, the secret key should NEVER be exposed to the frontend
        // This is just for demo purposes in a test environment
        const { data } = await fetch('/api/get-secret-key').then(res => res.json());
        if (data?.secretKey) {
          setSecretKey(data.secretKey);
        }
      } catch (error) {
        console.error("Error loading blockchain wallet:", error);
      }
    };
    
    loadWallet();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Validate inputs
      const numAmount = parseFloat(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        throw new Error("Please enter a valid amount");
      }
      
      if (!recipient) {
        throw new Error("Please enter a recipient address");
      }
      
      // In a real application, we would never send the secret key from the frontend
      // Instead, we would use a secure backend service to handle the signing process
      // This is for demonstration purposes only
      if (!secretKey) {
        throw new Error("Secret key not available. This is a security feature in production.");
      }
      
      // Send the blockchain payment
      const { transactionHash } = await sendBlockchainPayment(
        secretKey,
        recipient,
        numAmount
      );
      
      // Record the transaction in our system
      await processPayment(
        'send',
        numAmount,
        recipient,
        undefined,
        memo || 'Blockchain transaction',
        'blockchain'
      );
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transactions-all'] });
      
      toast.success("Blockchain payment sent successfully", {
        description: `Transaction ID: ${transactionHash.slice(0, 8)}...`,
      });
      
      // Reset form
      setAmount("");
      setRecipient("");
      setMemo("");
    } catch (error: any) {
      toast.error("Failed to send blockchain payment", {
        description: error.message || "Please try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send via Blockchain</CardTitle>
        <CardDescription>
          Send cryptocurrency directly to any Stellar address
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!hasBalance ? (
          <div className="bg-amber-50 p-4 rounded-md border border-amber-200 mb-4">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 mr-2" />
              <div>
                <h4 className="font-medium text-amber-800">Wallet Not Activated</h4>
                <p className="text-sm text-amber-700">
                  Your wallet needs at least 1 XLM to send transactions. Please fund your wallet first.
                </p>
              </div>
            </div>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient Address</Label>
            <Input
              id="recipient"
              placeholder="G... Stellar public key"
              required
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              disabled={isLoading || !hasBalance}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (XLM)</Label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                required
                min="0.0000001"
                step="0.0000001"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={isLoading || !hasBalance}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="memo">Memo (Optional)</Label>
            <Input 
              id="memo" 
              placeholder="Add a note to this transaction"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              disabled={isLoading || !hasBalance}
            />
          </div>
          
          <Button
            type="button"
            variant="link"
            className="p-0 h-auto text-xs text-gray-500"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? "Hide" : "Show"} advanced settings
          </Button>
          
          {showAdvanced && (
            <div className="space-y-2">
              <Label htmlFor="public-key">Your Public Key</Label>
              <Input
                id="public-key"
                value={publicKey}
                disabled
                className="font-mono text-xs"
              />
              <p className="text-xs text-gray-500 mt-1">
                This is your public blockchain address on the Stellar network.
              </p>
            </div>
          )}
          
          <Button 
            type="submit" 
            className="w-full bg-pulapay-blue hover:bg-pulapay-blue-dark"
            disabled={isLoading || !hasBalance}
          >
            {isLoading ? "Processing..." : "Send Payment"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-start border-t px-6 py-4">
        <p className="text-xs text-gray-500">
          Blockchain transactions are irreversible. Please double-check the recipient address before sending.
          Network fees are approximately 0.00001 XLM per transaction.
        </p>
      </CardFooter>
    </Card>
  );
}
