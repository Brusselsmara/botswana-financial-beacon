
import { Link } from "react-router-dom";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t bg-white">
      <div className="container py-6 md:py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full pulapay-gradient flex items-center justify-center">
                <span className="text-white font-bold">P</span>
              </div>
              <span className="text-lg font-bold text-pulapay-blue">Pula Pay</span>
            </div>
            <p className="text-sm text-gray-500">
              Fast, secure, and easy payments for Botswana and beyond.
            </p>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/send" className="text-gray-500 hover:text-pulapay-blue transition-colors">
                  Send Money
                </Link>
              </li>
              <li>
                <Link to="/pay" className="text-gray-500 hover:text-pulapay-blue transition-colors">
                  Pay Bills
                </Link>
              </li>
              <li>
                <Link to="/top-up" className="text-gray-500 hover:text-pulapay-blue transition-colors">
                  Mobile Top-up
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-gray-500 hover:text-pulapay-blue transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-500 hover:text-pulapay-blue transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-500 hover:text-pulapay-blue transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/terms" className="text-gray-500 hover:text-pulapay-blue transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-500 hover:text-pulapay-blue transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-gray-500 hover:text-pulapay-blue transition-colors">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t pt-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-gray-500">
            &copy; {currentYear} Pula Pay Financial Services. All rights reserved.
          </p>
          <p className="text-xs text-gray-500 mt-2 md:mt-0">
            Licensed by Bank of Botswana | Reg No. BP 01234567
          </p>
        </div>
      </div>
    </footer>
  );
}
