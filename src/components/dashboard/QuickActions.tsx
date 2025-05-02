
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Send, CreditCard, Phone, Receipt } from "lucide-react";

export function QuickActions() {
  const actions = [
    { 
      name: "Send Money", 
      icon: <Send size={18} />, 
      path: "/send",
      color: "bg-pulapay-blue text-white"
    },
    { 
      name: "Pay Bills", 
      icon: <CreditCard size={18} />, 
      path: "/pay",
      color: "bg-pulapay-green text-white"
    },
    { 
      name: "Airtime", 
      icon: <Phone size={18} />, 
      path: "/top-up",
      color: "bg-pulapay-blue-light text-white"
    },
    { 
      name: "History", 
      icon: <Receipt size={18} />, 
      path: "/transactions",
      color: "bg-pulapay-gray-dark text-white"
    }
  ];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {actions.map((action) => (
            <Button 
              key={action.name}
              className={`flex flex-col items-center gap-2 h-auto py-4 ${action.color}`}
              asChild
            >
              <Link to={action.path}>
                <div className="rounded-full bg-white/20 p-2">
                  {action.icon}
                </div>
                <span className="text-xs font-medium mt-1">{action.name}</span>
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
