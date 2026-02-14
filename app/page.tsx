"use client";

import { NewSale } from "@/components/sales/NewSale";
import { SalesHistory } from "@/components/sales/SalesHistory";
import { SalesPerformance } from "@/components/sales/SalesPerformance";
import {
  Tabs,
  TabsContent,
  TabsContents,
  TabsList,
  TabsTrigger,
} from "@/components/animate-ui/components/animate/tabs";
import { SalesProvider } from "@/context/SalesContext";
import { History, PlusCircle, BarChart } from "lucide-react";

export default function Home() {
  return (
    <SalesProvider>
      <div className="flex min-h-screen w-full flex-col bg-background">
        <main className="flex flex-1 flex-col gap-4 p-3 md:gap-8 md:p-8">
          <Tabs defaultValue="new-sale">
            <div className="flex items-center justify-center">
              <TabsList className="bg-gray-200">
                <TabsTrigger value="new-sale">
                  <PlusCircle className="mr-1 h-4 w-4" />
                  New Sale
                </TabsTrigger>
                <TabsTrigger value="history">
                  <History className="mr-1 h-4 w-4" />
                  History
                </TabsTrigger>
                <TabsTrigger value="performance">
                  <BarChart className="mr-1 h-4 w-4" />
                  Performance
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContents>
              <TabsContent value="new-sale" className="p-2">
                <NewSale />
              </TabsContent>
              <TabsContent value="history" className="p-2">
                <SalesHistory />
              </TabsContent>
              <TabsContent value="performance" className="p-2">
                <SalesPerformance />
              </TabsContent>
            </TabsContents>
          </Tabs>
        </main>
      </div>
    </SalesProvider>
  );
}
