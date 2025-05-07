
import { BlockchainWallet } from "@/components/blockchain/BlockchainWallet";
import { BlockchainSendForm } from "@/components/blockchain/BlockchainSendForm";
import { CardLoadForm } from "@/components/blockchain/CardLoadForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { getOrCreateBlockchainWallet } from "@/services/blockchainService";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function Blockchain() {
  const [publicKey, setPublicKey] = useState<string>("");
  
  useEffect(() => {
    const fetchWalletKey = async () => {
      try {
        const { publicKey } = await getOrCreateBlockchainWallet();
        setPublicKey(publicKey);
      } catch (error) {
        console.error("Error fetching wallet key:", error);
      }
    };
    
    fetchWalletKey();
  }, []);

  return (
    <div className="container py-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Blockchain Payments</h1>
      
      <div className="flex flex-col space-y-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
          <h2 className="text-lg font-semibold text-blue-700 mb-2">Stellar Mainnet</h2>
          <p className="text-blue-600 text-sm">
            This app is now connected to the Stellar public mainnet. New wallets require funding with at least 1 XLM 
            to become active. Please note that all transactions on the mainnet involve real cryptocurrency.
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <BlockchainWallet />
        </div>
        
        <div>
          <Tabs defaultValue="load">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="load" className="flex-1">Load Funds</TabsTrigger>
              <TabsTrigger value="send" className="flex-1">Send</TabsTrigger>
              <TabsTrigger value="receive" className="flex-1">Receive</TabsTrigger>
            </TabsList>
            
            <TabsContent value="load">
              {publicKey ? (
                <CardLoadForm publicKey={publicKey} />
              ) : (
                <Card className="text-center p-6">
                  <p>Loading wallet information...</p>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="send">
              <BlockchainSendForm />
            </TabsContent>
            
            <TabsContent value="receive">
              <Card>
                <CardHeader>
                  <CardTitle>Receive Payments</CardTitle>
                  <CardDescription>
                    Share your address to receive blockchain payments
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border rounded-lg p-4 text-center">
                    <p className="mb-2 text-sm text-gray-500">Your Stellar Address</p>
                    <p className="font-mono text-xs break-all" id="blockchain-address">
                      {publicKey || "Loading..."}
                    </p>
                    <Button 
                      onClick={() => {
                        if (publicKey) {
                          navigator.clipboard.writeText(publicKey);
                          toast.success("Address copied to clipboard");
                        }
                      }}
                      variant="outline"
                      className="mt-2"
                      disabled={!publicKey}
                    >
                      Copy Address
                    </Button>
                  </div>
                  
                  <div className="flex justify-center">
                    <div className="bg-gray-200 w-40 h-40 flex items-center justify-center">
                      {/* QR code would be generated here */}
                      <p className="text-xs text-gray-500">QR Code<br/>Placeholder</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col items-start border-t px-6 py-4">
                  <p className="text-xs text-gray-500">
                    You can receive XLM and other Stellar-based assets using this address.
                    Make sure the sender is sending on the Stellar network.
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default Blockchain;
