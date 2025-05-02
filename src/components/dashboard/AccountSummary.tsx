
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AccountSummaryProps {
  balance: number;
  currency?: string;
  isLoading?: boolean;
}

export function AccountSummary({ balance, currency = "BWP", isLoading = false }: AccountSummaryProps) {
  const formattedBalance = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'BWP',
    minimumFractionDigits: 2
  }).format(balance);
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pulapay-gradient text-white">
        <CardTitle className="text-lg font-medium">Account Balance</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Available Balance</p>
            {isLoading ? (
              <div className="h-8 w-36 bg-gray-200 animate-pulse rounded mt-1"></div>
            ) : (
              <p className="text-3xl font-semibold">{formattedBalance}</p>
            )}
          </div>
          <button className="text-sm text-pulapay-blue hover:underline">
            Add Money
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
