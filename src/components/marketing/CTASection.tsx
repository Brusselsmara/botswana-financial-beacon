
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function CTASection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 pulapay-gradient">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center text-white">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Ready to Experience Better Financial Services?
            </h2>
            <p className="mx-auto max-w-[700px] text-white/80 md:text-xl">
              Join thousands of Batswana already using Pula Pay for their everyday financial needs.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <Button asChild size="lg" className="bg-white text-pulapay-blue hover:bg-gray-100">
              <Link to="/signup">
                Create Free Account
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
              <Link to="/contact">
                Contact Sales
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
