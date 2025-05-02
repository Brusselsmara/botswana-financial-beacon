
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Transaction } from "@/services/paymentService";

interface TransactionsListProps {
  transactions: Transaction[];
  limit?: number;
  isLoading?: boolean;
}

export function TransactionsList({ transactions, limit, isLoading = false }: TransactionsListProps) {
  const displayTransactions = limit ? transactions.slice(0, limit) : transactions;
  
  const formatAmount = (amount: number, type: 'credit' | 'debit') => {
    const formattedAmount = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'BWP',
      minimumFractionDigits: 2
    }).format(amount);
    
    return type === 'credit' ? `+${formattedAmount}` : `-${formattedAmount}`;
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">Recent Transactions</CardTitle>
        <div className="text-sm text-pulapay-blue hover:underline cursor-pointer">
          <Link to="/transactions">View All</Link>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="divide-y">
            {[...Array(3)].map((_, index) => (
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
        ) : (
          <div className="divide-y">
            {displayTransactions.length > 0 ? (
              displayTransactions.map((transaction) => (
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
                      {formatAmount(transaction.amount, transaction.transaction_type === 'receive' ? 'credit' : 'debit')}
                    </p>
                    <p className={`text-xs ${
                      transaction.status === 'completed' ? 'text-green-600' : 
                      transaction.status === 'pending' ? 'text-amber-500' : 'text-red-600'
                    }`}>
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                No transactions to display
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
