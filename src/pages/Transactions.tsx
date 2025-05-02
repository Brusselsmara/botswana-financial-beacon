
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowUpRight, ArrowDownLeft, Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  description: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

export function Transactions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  
  // Mock data for demonstration
  const allTransactions: Transaction[] = [
    {
      id: "1",
      type: "debit",
      description: "Transfer to Mpho K.",
      amount: 500,
      date: "Today, 14:30",
      status: "completed"
    },
    {
      id: "2",
      type: "credit",
      description: "Deposit from BancABC",
      amount: 2500,
      date: "May 1, 2025",
      status: "completed"
    },
    {
      id: "3",
      type: "debit",
      description: "BPC Bill Payment",
      amount: 350.75,
      date: "Apr 28, 2025",
      status: "completed"
    },
    {
      id: "4",
      type: "debit",
      description: "Mobile Airtime",
      amount: 50,
      date: "Apr 27, 2025",
      status: "completed"
    },
    {
      id: "5",
      type: "credit",
      description: "Refund - Shoprite",
      amount: 125.80,
      date: "Apr 26, 2025",
      status: "completed"
    },
    {
      id: "6",
      type: "debit",
      description: "Water Bill - WUC",
      amount: 210.50,
      date: "Apr 22, 2025",
      status: "completed"
    },
    {
      id: "7",
      type: "credit",
      description: "Transfer from Tebogo M.",
      amount: 300,
      date: "Apr 20, 2025",
      status: "completed"
    },
    {
      id: "8",
      type: "debit",
      description: "DSTV Subscription",
      amount: 489,
      date: "Apr 15, 2025",
      status: "completed"
    },
    {
      id: "9",
      type: "debit",
      description: "Choppies - Grocery",
      amount: 356.75,
      date: "Apr 12, 2025",
      status: "completed"
    },
    {
      id: "10",
      type: "credit",
      description: "Salary Deposit",
      amount: 5000,
      date: "Mar 31, 2025",
      status: "completed"
    }
  ];
  
  // Filter transactions based on search term and type filter
  const filteredTransactions = allTransactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || transaction.type === filterType;
    
    return matchesSearch && matchesFilter;
  });
  
  const formatAmount = (amount: number, type: 'credit' | 'debit') => {
    const formattedAmount = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'BWP',
      minimumFractionDigits: 2
    }).format(amount);
    
    return type === 'credit' ? `+${formattedAmount}` : `-${formattedAmount}`;
  };

  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Transaction History</h1>
        <p className="text-gray-500">View and search your transaction history</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search transactions..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-48">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger>
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Transactions</SelectItem>
              <SelectItem value="credit">Money In</SelectItem>
              <SelectItem value="debit">Money Out</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">All Transactions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredTransactions.length > 0 ? (
            <div className="divide-y">
              {filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className={`rounded-full p-2 ${
                      transaction.type === 'credit' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {transaction.type === 'credit' ? (
                        <ArrowDownLeft size={16} />
                      ) : (
                        <ArrowUpRight size={16} />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-xs text-gray-500">{transaction.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${
                      transaction.type === 'credit' ? 'text-green-600' : 'text-gray-900'
                    }`}>
                      {formatAmount(transaction.amount, transaction.type)}
                    </p>
                    <p className={`text-xs ${
                      transaction.status === 'completed' ? 'text-green-600' : 
                      transaction.status === 'pending' ? 'text-amber-500' : 'text-red-600'
                    }`}>
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              No transactions found matching your search criteria
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default Transactions;
