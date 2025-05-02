
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Normally we'd get this from auth context
  const isLoggedIn = true;
  const username = "John Mokgathisi";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full pulapay-gradient flex items-center justify-center">
              <span className="text-white font-bold">P</span>
            </div>
            <span className="text-lg font-bold text-pulapay-blue">Pula Pay</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium hover:text-pulapay-blue transition-colors">
            Home
          </Link>
          <Link to="/send" className="text-sm font-medium hover:text-pulapay-blue transition-colors">
            Send Money
          </Link>
          <Link to="/pay" className="text-sm font-medium hover:text-pulapay-blue transition-colors">
            Pay Bills
          </Link>
          <Link to="/transactions" className="text-sm font-medium hover:text-pulapay-blue transition-colors">
            Transactions
          </Link>
        </nav>

        {/* User Actions */}
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pulapay-blue">
                    <span className="text-sm font-medium text-white">{username.charAt(0)}</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>My Account</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/signin">Sign in</Link>
              </Button>
              <Button className="bg-pulapay-blue hover:bg-pulapay-blue-dark" size="sm" asChild>
                <Link to="/signup">Sign up</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] animate-fade-in grid-flow-row auto-rows-max overflow-auto bg-white p-6 md:hidden">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-lg font-medium hover:text-pulapay-blue"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/send" 
                className="text-lg font-medium hover:text-pulapay-blue"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Send Money
              </Link>
              <Link 
                to="/pay" 
                className="text-lg font-medium hover:text-pulapay-blue"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pay Bills
              </Link>
              <Link 
                to="/transactions" 
                className="text-lg font-medium hover:text-pulapay-blue"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Transactions
              </Link>
              {isLoggedIn ? (
                <>
                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-pulapay-blue flex items-center justify-center">
                        <span className="text-sm font-medium text-white">{username.charAt(0)}</span>
                      </div>
                      <span className="font-medium">{username}</span>
                    </div>
                  </div>
                  <Link 
                    to="/account" 
                    className="text-lg font-medium hover:text-pulapay-blue"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Account
                  </Link>
                  <Button variant="ghost" className="justify-start p-0 font-medium text-lg hover:text-pulapay-blue" onClick={() => setIsMobileMenuOpen(false)}>
                    Log out
                  </Button>
                </>
              ) : (
                <>
                  <div className="pt-4 border-t flex flex-col space-y-2">
                    <Button variant="outline" asChild>
                      <Link to="/signin" onClick={() => setIsMobileMenuOpen(false)}>
                        Sign in
                      </Link>
                    </Button>
                    <Button className="bg-pulapay-blue hover:bg-pulapay-blue-dark" asChild>
                      <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                        Sign up
                      </Link>
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
