"use client";

import { useSales } from "@/context/SalesContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import type { Sale } from "@/lib/types";
import { SaleDetailDialog } from "./SaleDetailDialog";
import { ScrollArea } from "../ui/scroll-area";
import { Skeleton } from "../ui/skeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, FilterX, ListFilter } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PRODUCTS } from "@/lib/products";
import { cn } from "@/lib/utils";

export function SalesHistory() {
  const { sales, loading } = useSales();
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

  const filteredSales = useMemo(() => {
    return sales.filter((sale) => {
      const saleDate = new Date(sale.timestamp);
      if (dateRange?.from && saleDate < dateRange.from) return false;
      if (dateRange?.to) {
        // include the whole day of the to-date
        const toDate = new Date(dateRange.to);
        toDate.setHours(23, 59, 59, 999);
        if (saleDate > toDate) return false;
      }
      if (selectedProducts.length > 0) {
        const hasProduct = sale.items.some((item) =>
          selectedProducts.includes(item.id),
        );
        if (!hasProduct) return false;
      }
      return true;
    });
  }, [sales, dateRange, selectedProducts]);

  const totalRevenue = filteredSales.reduce((acc, sale) => acc + sale.total, 0);
  const totalItemsSold = filteredSales.reduce(
    (acc, sale) =>
      acc + sale.items.reduce((itemAcc, item) => itemAcc + item.quantity, 0),
    0,
  );

  const clearFilters = () => {
    setDateRange(undefined);
    setSelectedProducts([]);
  };

  const isFiltered = dateRange?.from || selectedProducts.length > 0;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Sales History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-5 mb-4">
            <Popover>
              <PopoverTrigger className="flex items-center py-1 border rounded-md p-2 cursor-pointer">
                <CalendarIcon className="mr-2 h-4 w-4 text-green-500" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, yy")} -{" "}
                      {format(dateRange.to, "LLL dd, yy")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, yy")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  captionLayout="dropdown"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center py-1 border rounded-md p-2 cursor-pointer">
                <ListFilter className="mr-2 h-4 w-4 text-yellow-500" />
                Products ({selectedProducts.length})
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Filter by product</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {PRODUCTS.map((product) => (
                    <DropdownMenuCheckboxItem
                      key={product.id}
                      checked={selectedProducts.includes(product.id)}
                      onSelect={(e) => e.preventDefault()}
                      onCheckedChange={(checked) => {
                        return checked
                          ? setSelectedProducts([
                              ...selectedProducts,
                              product.id,
                            ])
                          : setSelectedProducts(
                              selectedProducts.filter(
                                (id) => id !== product.id,
                              ),
                            );
                      }}
                    >
                      {product.name}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            {isFiltered && (
              <Button variant="destructive" size={"sm"} onClick={clearFilters}>
                <FilterX className="mr-1 h-4 w-4" />
                Clear Filters
              </Button>
            )}
          </div>

          <ScrollArea className="h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Salesman</TableHead>
                  <TableHead>Delivery</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-5 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-10" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-10" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-16" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-5 w-20 ml-auto" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-5 w-20 ml-auto" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-8 w-16 ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : filteredSales.length > 0 ? (
                  filteredSales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell>
                        {new Date(sale.timestamp).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{sale.orderId}</TableCell>
                      <TableCell>
                        {sale.items.reduce(
                          (acc, item) => acc + item.quantity,
                          0,
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {sale.paymentMethod}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {sale.salesman}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            "capitalize",
                            sale.deliveryStatus === "Delivered"
                              ? "border-emerald-500 text-emerald-600"
                              : sale.deliveryStatus === "Pending"
                                ? "border-yellow-500 text-yellow-500"
                                : "",
                          )}
                        >
                          {sale.deliveryStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            "capitalize",
                            sale.salesStatus === "Completed"
                              ? "border-emerald-500 text-emerald-600"
                              : sale.salesStatus === "Pending"
                                ? "border-yellow-500 text-yellow-500"
                                : "",
                          )}
                        >
                          {sale.salesStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        RM {sale.total.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => setSelectedSale(sale)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No sales match your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
        <CardFooter className="justify-end space-x-6 border-t p-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Total Items</span>
            <span className="text-sm md:text-lg font-bold">
              {totalItemsSold}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Total Revenue</span>
            <span className="text-sm md:text-lg font-bold flex">
              RM {totalRevenue.toFixed(2)}
            </span>
          </div>
        </CardFooter>
      </Card>
      <SaleDetailDialog
        sale={selectedSale}
        isOpen={!!selectedSale}
        onOpenChange={(isOpen) => !isOpen && setSelectedSale(null)}
      />
    </>
  );
}
