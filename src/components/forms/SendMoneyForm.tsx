
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { processPayment } from "@/services/paymentService";
import { useQueryClient } from "@tanstack/react-query";

export function SendMoneyForm() {
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("wallet");
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Validate the amount
      const numAmount = parseFloat(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        throw new Error("Please enter a valid amount");
      }
      
      // Process the payment
      await processPayment(
        'send',
        numAmount,
        recipient,
        undefined, // recipient name
        note,
        paymentMethod as 'wallet' | 'bank' | 'card'
      );
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transactions-all'] });
      
      toast.success("Money sent successfully", {
        description: `P${amount} sent to ${recipient}`,
      });
      
      // Reset form
      setAmount("");
      setRecipient("");
      setNote("");
    } catch (error: any) {
      toast.error("Failed to send money", {
        description: error.message || "Please try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send Money</CardTitle>
        <CardDescription>
          Send money to friends, family, or businesses instantly.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient</Label>
            <Input
              id="recipient"
              placeholder="Phone number, email, or username"
              required
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (BWP)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">P</span>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                className="pl-8"
                required
                min="1"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="payment-method">Payment Method</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod} disabled={isLoading}>
              <SelectTrigger id="payment-method">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="wallet">Pula Pay Wallet</SelectItem>
                <SelectItem value="bank">Bank Account</SelectItem>
                <SelectItem value="card">Debit/Credit Card</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="note">Note (Optional)</Label>
            <Input 
              id="note" 
              placeholder="What's this payment for?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-pulapay-blue hover:bg-pulapay-blue-dark"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Send Money"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-start border-t px-6 py-4">
        <p className="text-xs text-gray-500">
          By clicking "Send Money", you agree to our terms of service and privacy policy.
          Standard transaction fees may apply.
        </p>
      </CardFooter>
    </Card>
  );
}
