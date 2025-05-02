
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";

interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  description: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

interface TransactionsListProps {
  transactions: Transaction[];
  limit?: number;
}

export function TransactionsList({ transactions, limit }: TransactionsListProps) {
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
          View All
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {displayTransactions.length > 0 ? (
            displayTransactions.map((transaction) => (
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
            ))
          ) : (
            <div className="p-6 text-center text-gray-500">
              No transactions to display
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
