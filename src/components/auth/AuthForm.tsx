
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export function AuthForm() {
  const location = useLocation();
  const isSignUp = location.pathname === "/signup";
  const { signIn, signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password);
        if (error) {
          toast.error("Sign up failed", {
            description: error.message || "Please try again",
          });
        } else {
          toast.success("Account created successfully", {
            description: "You are now signed in",
          });
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          toast.error("Sign in failed", {
            description: error.message || "Please check your credentials",
          });
        } else {
          toast.success("Signed in successfully");
        }
      }
    } catch (error) {
      toast.error("An error occurred", {
        description: "Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          {isSignUp ? "Create an account" : "Sign in to your account"}
        </CardTitle>
        <CardDescription className="text-center">
          {isSignUp
            ? "Enter your email and password to create an account"
            : "Enter your email and password to sign in"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              {!isSignUp && (
                <Button variant="link" size="sm" className="text-xs font-medium p-0 h-auto">
                  Forgot password?
                </Button>
              )}
            </div>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading
              ? "Please wait..."
              : isSignUp
              ? "Create account"
              : "Sign in"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col">
        <div className="text-sm text-center text-gray-500">
          {isSignUp ? (
            <>
              Already have an account?{" "}
              <Button variant="link" className="p-0 h-auto" asChild>
                <a href="/signin">Sign in</a>
              </Button>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <Button variant="link" className="p-0 h-auto" asChild>
                <a href="/signup">Sign up</a>
              </Button>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
