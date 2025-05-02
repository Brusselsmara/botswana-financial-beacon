
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";

export function AuthForm() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call for authentication
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Signed in successfully");
      navigate("/");
    }, 1500);
  };
  
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call for registration
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Account created successfully");
      navigate("/");
    }, 1500);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex justify-center mb-4">
          <div className="h-12 w-12 rounded-full pulapay-gradient flex items-center justify-center">
            <span className="text-white font-bold text-lg">P</span>
          </div>
        </div>
        <CardTitle className="text-center">Welcome to Pula Pay</CardTitle>
        <CardDescription className="text-center">
          The future of payments in Botswana
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <Input id="signin-email" type="email" placeholder="name@example.com" required />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="signin-password">Password</Label>
                  <Link to="/reset-password" className="text-xs text-pulapay-blue hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input id="signin-password" type="password" required />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-pulapay-blue hover:bg-pulapay-blue-dark"
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">Full Name</Label>
                <Input id="signup-name" placeholder="John Mokgathisi" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input id="signup-email" type="email" placeholder="name@example.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-phone">Phone Number</Label>
                <Input id="signup-phone" placeholder="71234567" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input id="signup-password" type="password" required />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-pulapay-blue hover:bg-pulapay-blue-dark"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col items-center gap-2 border-t p-6">
        <div className="text-xs text-gray-500 text-center">
          By continuing, you agree to Pula Pay's Terms of Service and Privacy Policy.
        </div>
      </CardFooter>
    </Card>
  );
}
