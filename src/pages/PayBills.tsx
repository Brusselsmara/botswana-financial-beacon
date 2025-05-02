
import { PayBillsForm } from "@/components/forms/PayBillsForm";

export function PayBills() {
  return (
    <div className="container py-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Pay Bills</h1>
      <PayBillsForm />
    </div>
  );
}

export default PayBills;
