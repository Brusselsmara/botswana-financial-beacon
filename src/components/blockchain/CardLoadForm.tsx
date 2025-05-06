
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { loadFundsFromCard } from "@/services/blockchainService";
import { useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { CreditCard } from "lucide-react";

export function CardLoadForm({ publicKey }: { publicKey: string }) {
  const [amount, setAmount] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Validate inputs
      const numAmount = parseFloat(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        throw new Error("Please enter a valid amount");
      }
      
      if (!cardNumber || !cardholderName || !expiryDate || !cvv) {
        throw new Error("Please complete all card details");
      }
      
      // Basic card validation
      if (cardNumber.replace(/\s/g, '').length !== 16) {
        throw new Error("Please enter a valid 16-digit card number");
      }
      
      if (cvv.length !== 3) {
        throw new Error("Please enter a valid 3-digit CVV");
      }
      
      // Process the card payment
      await loadFundsFromCard(
        publicKey,
        numAmount,
        "BWP",
        {
          cardNumber: cardNumber.replace(/\s/g, ''),
          cardholderName,
          expiryDate,
          cvv
        }
      );
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['blockchain-wallet'] });
      
      toast.success("Card payment successful", {
        description: `${numAmount.toFixed(2)} BWP has been added to your account`,
      });
      
      // Reset form
      setAmount("");
      setCardNumber("");
      setCardholderName("");
      setExpiryDate("");
      setCvv("");
    } catch (error: any) {
      toast.error("Payment failed", {
        description: error.message || "Please try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Format card number with spaces
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, '');
    const formattedValue = value.replace(/(\d{4})/g, '$1 ').trim();
    setCardNumber(formattedValue);
  };

  // Format expiry date
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    setExpiryDate(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" /> Load with Card
        </CardTitle>
        <CardDescription>
          Add funds to your account using your bank card
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (BWP)</Label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                required
                min="10"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              placeholder="4111 1111 1111 1111"
              required
              maxLength={19}
              value={cardNumber}
              onChange={handleCardNumberChange}
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cardholderName">Cardholder Name</Label>
            <Input
              id="cardholderName"
              placeholder="John Doe"
              required
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                placeholder="MM/YY"
                required
                maxLength={5}
                value={expiryDate}
                onChange={handleExpiryChange}
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                type="password"
                placeholder="123"
                required
                maxLength={3}
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-pulapay-blue hover:bg-pulapay-blue-dark"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Add Funds"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-start border-t px-6 py-4">
        <p className="text-xs text-gray-500">
          Your card details are securely processed. We accept Visa, Mastercard and major debit/credit cards.
        </p>
      </CardFooter>
    </Card>
  );
}
