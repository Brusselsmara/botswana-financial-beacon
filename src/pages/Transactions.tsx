
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowUpRight, ArrowDownLeft, Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { getTransactions } from "@/services/paymentService";
import { toast } from "sonner";
import { Transaction } from "@/services/paymentService";

export function Transactions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  
  // Fetch transactions from API
  const { data: allTransactions = [], isLoading, error } = useQuery({
    queryKey: ['transactions-all'],
    queryFn: () => getTransactions(),
    retry: 1
  });
  
  if (error) {
    toast.error("Failed to load transactions", {
      description: "Please refresh the page to try again.",
    });
  }
  
  // Filter transactions based on search term and type filter
  const filteredTransactions = allTransactions.filter((transaction: Transaction) => {
    const searchFields = [
      transaction.recipient_name || '',
      transaction.recipient_identifier || '',
      transaction.description || ''
    ].join(' ').toLowerCase();
    
    const matchesSearch = searchFields.includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || 
                          (filterType === "credit" && transaction.transaction_type === "receive") ||
                          (filterType === "debit" && (transaction.transaction_type === "send" || transaction.transaction_type === "bill_payment"));
    
    return matchesSearch && matchesFilter;
  });
  
  const formatAmount = (amount: number, type: 'receive' | 'send' | 'bill_payment') => {
    const formattedAmount = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'BWP',
      minimumFractionDigits: 2
    }).format(amount);
    
    return type === 'receive' ? `+${formattedAmount}` : `-${formattedAmount}`;
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
          {isLoading ? (
            <div className="divide-y">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full p-2 bg-gray-200 h-8 w-8"></div>
                    <div>
                      <div className="h-4 w-40 bg-gray-200 animate-pulse rounded mb-2"></div>
                      <div className="h-3 w-20 bg-gray-100 animate-pulse rounded"></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="h-4 w-24 bg-gray-200 animate-pulse rounded mb-2"></div>
                    <div className="h-3 w-16 bg-gray-100 animate-pulse rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredTransactions.length > 0 ? (
            <div className="divide-y">
              {filteredTransactions.map((transaction: Transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className={`rounded-full p-2 ${
                      transaction.transaction_type === 'receive' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {transaction.transaction_type === 'receive' ? (
                        <ArrowDownLeft size={16} />
                      ) : (
                        <ArrowUpRight size={16} />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">
                        {transaction.transaction_type === 'send' ? 
                          `Transfer to ${transaction.recipient_name || transaction.recipient_identifier}` : 
                          transaction.transaction_type === 'receive' ? 
                            `Received from ${transaction.recipient_name || transaction.recipient_identifier}` : 
                            `Payment to ${transaction.recipient_name || transaction.recipient_identifier}`
                        }
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(transaction.created_at).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${
                      transaction.transaction_type === 'receive' ? 'text-green-600' : 'text-gray-900'
                    }`}>
                      {formatAmount(transaction.amount, transaction.transaction_type)}
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
