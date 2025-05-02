
import { AccountSummary } from "@/components/dashboard/AccountSummary";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { TransactionsList } from "@/components/dashboard/TransactionsList";

export function Dashboard() {
  // Mock data for demonstration
  const transactions = [
    {
      id: "1",
      type: "debit" as const,
      description: "Transfer to Mpho K.",
      amount: 500,
      date: "Today, 14:30",
      status: "completed" as const
    },
    {
      id: "2",
      type: "credit" as const,
      description: "Deposit from BancABC",
      amount: 2500,
      date: "May 1, 2025",
      status: "completed" as const
    },
    {
      id: "3",
      type: "debit" as const,
      description: "BPC Bill Payment",
      amount: 350.75,
      date: "Apr 28, 2025",
      status: "completed" as const
    },
    {
      id: "4",
      type: "debit" as const,
      description: "Mobile Airtime",
      amount: 50,
      date: "Apr 27, 2025",
      status: "completed" as const
    },
    {
      id: "5",
      type: "credit" as const,
      description: "Refund - Shoprite",
      amount: 125.80,
      date: "Apr 26, 2025",
      status: "completed" as const
    }
  ];

  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome, John</h1>
        <p className="text-gray-500">Manage your finances with ease</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <AccountSummary balance={12350.75} />
        <QuickActions />
      </div>
      
      <TransactionsList transactions={transactions} limit={5} />
    </div>
  );
}

export default Dashboard;
