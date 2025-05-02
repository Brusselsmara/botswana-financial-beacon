
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Zap, CreditCard } from "lucide-react";

export function Hero() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-4">
            <div className="inline-block rounded-lg bg-pulapay-blue px-3 py-1 text-sm text-white">
              New in Botswana
            </div>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              A Better Way to Send & Receive Money in Botswana
            </h1>
            <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Send money, pay bills, and manage your finances with Pula Pay - faster, cheaper, and more secure than traditional methods.
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild className="bg-pulapay-blue hover:bg-pulapay-blue-dark">
                <Link to="/signup">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/how-it-works">
                  How It Works
                </Link>
              </Button>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Shield className="h-3 w-3 text-pulapay-blue" />
                <span>Secure</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="h-3 w-3 text-pulapay-blue" />
                <span>Fast</span>
              </div>
              <div className="flex items-center gap-1">
                <CreditCard className="h-3 w-3 text-pulapay-blue" />
                <span>Low Fees</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="overflow-hidden rounded-xl border bg-white shadow-xl">
                <div className="p-6">
                  <div className="rounded-lg pulapay-gradient p-4 text-white">
                    <div className="text-sm">Available Balance</div>
                    <div className="text-2xl font-bold">P 12,350.75</div>
                  </div>
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between border-b pb-2">
                      <div>
                        <div className="text-sm font-medium">Sent to John M.</div>
                        <div className="text-xs text-gray-500">Yesterday at 2:30 PM</div>
                      </div>
                      <div className="text-sm font-medium">-P 250.00</div>
                    </div>
                    <div className="flex items-center justify-between border-b pb-2">
                      <div>
                        <div className="text-sm font-medium">BPC Bill Payment</div>
                        <div className="text-xs text-gray-500">May 1, 2025</div>
                      </div>
                      <div className="text-sm font-medium">-P 350.00</div>
                    </div>
                    <div className="flex items-center justify-between border-b pb-2">
                      <div>
                        <div className="text-sm font-medium">Salary Deposit</div>
                        <div className="text-xs text-gray-500">Apr 30, 2025</div>
                      </div>
                      <div className="text-sm font-medium text-green-600">+P 5,000.00</div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between">
                    <Button variant="outline" size="sm">
                      Send Money
                    </Button>
                    <Button size="sm" className="bg-pulapay-green hover:bg-pulapay-green-dark">
                      Pay Bills
                    </Button>
                  </div>
                </div>
              </div>
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-pulapay-blue-light opacity-30 blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-pulapay-blue opacity-30 blur-xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
