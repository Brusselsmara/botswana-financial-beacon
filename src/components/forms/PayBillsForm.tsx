
import { useState } from "react";
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

export function PayBillsForm() {
  const [amount, setAmount] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [provider, setProvider] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Bill payment successful", {
        description: `P${amount} paid to ${provider}`,
      });
      
      // Reset form
      setAmount("");
      setAccountNumber("");
    }, 1500);
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
            <Select value={provider} onValueChange={setProvider} required>
              <SelectTrigger id="provider">
                <SelectValue placeholder="Select service provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Utilities</SelectLabel>
                  <SelectItem value="bpc">Botswana Power Corporation</SelectItem>
                  <SelectItem value="wuc">Water Utilities Corporation</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Telecommunications</SelectLabel>
                  <SelectItem value="btc">BTC</SelectItem>
                  <SelectItem value="orange">Orange</SelectItem>
                  <SelectItem value="mascom">Mascom</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Other</SelectLabel>
                  <SelectItem value="dstv">DSTV</SelectItem>
                  <SelectItem value="council">City Council</SelectItem>
                </SelectGroup>
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
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-pulapay-green hover:bg-pulapay-green-dark"
            disabled={isLoading}
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
