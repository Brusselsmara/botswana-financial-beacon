
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Send, ArrowDownUp, Smartphone, Shield, Clock } from "lucide-react";

export function Features() {
  const features = [
    {
      icon: <Send className="h-12 w-12 text-pulapay-blue" />,
      title: "Send Money",
      description: "Send money to anyone in Botswana instantly, using just their phone number or email."
    },
    {
      icon: <CreditCard className="h-12 w-12 text-pulapay-green" />,
      title: "Pay Bills",
      description: "Pay your BPC, WUC, and other bills directly from your Pula Pay account."
    },
    {
      icon: <ArrowDownUp className="h-12 w-12 text-pulapay-blue-light" />,
      title: "Bank Transfers",
      description: "Connect your bank account for seamless transfers in and out of your Pula Pay wallet."
    },
    {
      icon: <Smartphone className="h-12 w-12 text-pulapay-blue-dark" />,
      title: "Mobile Top-ups",
      description: "Purchase airtime and data for any mobile network in Botswana."
    },
    {
      icon: <Shield className="h-12 w-12 text-pulapay-green-dark" />,
      title: "Secure Payments",
      description: "Bank-level encryption and security to keep your money and data safe."
    },
    {
      icon: <Clock className="h-12 w-12 text-pulapay-gray-dark" />,
      title: "24/7 Access",
      description: "Access your money and make transactions any time, day or night."
    }
  ];
  
  return (
    <section className="w-full py-12 md:py-24 bg-gray-50">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-3xl font-bold tracking-tight">Everything You Need in One App</h2>
          <p className="mt-4 text-gray-500 md:text-xl">
            Pula Pay combines all your financial needs in one simple, secure application.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="transition-all hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="mb-4">{feature.icon}</div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
