
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { getBillProviders, processPayment } from "@/services/paymentService";
import { useQueryClient } from "@tanstack/react-query";
import { BillProvider } from "@/services/paymentService";

export function PayBillsForm() {
  const [amount, setAmount] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [provider, setProvider] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [billProviders, setBillProviders] = useState<BillProvider[]>([]);
  const [isFetchingProviders, setIsFetchingProviders] = useState(false);
  const queryClient = useQueryClient();
  
  // Fetch bill providers
  useEffect(() => {
    const fetchBillProviders = async () => {
      setIsFetchingProviders(true);
      try {
        const providers = await getBillProviders();
        setBillProviders(providers);
      } catch (error) {
        toast.error("Failed to load bill providers");
      } finally {
        setIsFetchingProviders(false);
      }
    };
    
    fetchBillProviders();
  }, []);
  
  // Group providers by category
  const providersByCategory = billProviders.reduce((acc, provider) => {
    if (!acc[provider.category]) {
      acc[provider.category] = [];
    }
    acc[provider.category].push(provider);
    return acc;
  }, {} as Record<string, BillProvider[]>);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Validate the amount
      const numAmount = parseFloat(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        throw new Error("Please enter a valid amount");
      }
      
      // Find the provider name
      const selectedProvider = billProviders.find(p => p.id === provider);
      if (!selectedProvider) {
        throw new Error("Please select a valid provider");
      }
      
      // Process the payment
      await processPayment(
        'bill_payment',
        numAmount,
        accountNumber,
        selectedProvider.name,
        `Bill payment for ${selectedProvider.name}`,
        'wallet'
      );
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transactions-all'] });
      
      toast.success("Bill payment successful", {
        description: `P${amount} paid to ${selectedProvider.name}`,
      });
      
      // Reset form
      setAmount("");
      setAccountNumber("");
    } catch (error: any) {
      toast.error("Failed to pay bill", {
        description: error.message || "Please try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pay Bills</CardTitle>
        <CardDescription>
          Pay your bills quickly and securely.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="provider">Service Provider</Label>
            <Select value={provider} onValueChange={setProvider} required disabled={isLoading || isFetchingProviders}>
              <SelectTrigger id="provider">
                <SelectValue placeholder={isFetchingProviders ? "Loading providers..." : "Select service provider"} />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(providersByCategory).map(([category, providers]) => (
                  <SelectGroup key={category}>
                    <SelectLabel>{category}</SelectLabel>
                    {providers.map((provider) => (
                      <SelectItem key={provider.id} value={provider.id}>{provider.name}</SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="account-number">Account Number / Reference</Label>
            <Input
              id="account-number"
              placeholder="Enter account number"
              required
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
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
          
          <Button 
            type="submit" 
            className="w-full bg-pulapay-green hover:bg-pulapay-green-dark"
            disabled={isLoading || isFetchingProviders}
          >
            {isLoading ? "Processing..." : "Pay Bill"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-start border-t px-6 py-4">
        <p className="text-xs text-gray-500">
          Payments may take up to 24 hours to reflect on your service provider's system.
        </p>
      </CardFooter>
    </Card>
  );
}
