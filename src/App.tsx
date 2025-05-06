
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { AuthProvider } from "@/contexts/AuthContext";
import { RequireAuth } from "@/components/auth/RequireAuth";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import SendMoney from "./pages/SendMoney";
import PayBills from "./pages/PayBills";
import Transactions from "./pages/Transactions";
import Blockchain from "./pages/Blockchain";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/signin" element={<Auth />} />
            <Route path="/signup" element={<Auth />} />
            <Route path="/dashboard" element={
              <RequireAuth>
                <Layout><Dashboard /></Layout>
              </RequireAuth>
            } />
            <Route path="/send" element={
              <RequireAuth>
                <Layout><SendMoney /></Layout>
              </RequireAuth>
            } />
            <Route path="/pay" element={
              <RequireAuth>
                <Layout><PayBills /></Layout>
              </RequireAuth>
            } />
            <Route path="/transactions" element={
              <RequireAuth>
                <Layout><Transactions /></Layout>
              </RequireAuth>
            } />
            <Route path="/blockchain" element={
              <RequireAuth>
                <Layout><Blockchain /></Layout>
              </RequireAuth>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
