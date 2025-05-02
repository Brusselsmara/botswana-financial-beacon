
import { SendMoneyForm } from "@/components/forms/SendMoneyForm";

export function SendMoney() {
  return (
    <div className="container py-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Send Money</h1>
      <SendMoneyForm />
    </div>
  );
}

export default SendMoney;
