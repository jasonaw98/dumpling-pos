"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useMemo,
} from "react";
import type { Sale, PaymentMethod, SaleItem } from "@/lib/types";
import { useFirestore, useCollection } from "@/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  Query,
  DocumentData,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

interface SalesContextType {
  sales: Sale[];
  addSale: (saleData: {
    items: SaleItem[];
    total: number;
    paymentMethod: PaymentMethod;
    salesman: string;
  }) => void;
  updateSale: (id: string, updates: Partial<Sale>) => Promise<void>;
  deleteSale: (id: string) => Promise<void>;
  loading: boolean;
}

const SalesContext = createContext<SalesContextType | undefined>(undefined);

export function SalesProvider({ children }: { children: ReactNode }) {
  const firestore = useFirestore();
  const [sales, setSales] = useState<Sale[]>([]);

  const salesQuery = useMemo(() => {
    if (firestore) {
      return query(
        collection(firestore, "sales"),
        orderBy("timestamp", "desc"),
      );
    }
    return null;
  }, [firestore]);

  const { data, loading } = useCollection(salesQuery);

  useEffect(() => {
    if (data) {
      const salesData = data.map((d: DocumentData) => {
        const timestamp = d.timestamp?.toDate
          ? d.timestamp.toDate()
          : new Date();
        return {
          id: d.id,
          orderId: d.orderId,
          items: d.items,
          total: d.total,
          paymentMethod: d.paymentMethod,
          salesman: d.salesman,
          deliveryStatus: d.deliveryStatus,
          salesStatus: d.salesStatus,
          timestamp: timestamp.toISOString(),
        } as Sale;
      });
      setSales(salesData);
    } else {
      setSales([]);
    }
  }, [data]);

  const addSale = useCallback(
    (saleData: {
      items: SaleItem[];
      total: number;
      paymentMethod: PaymentMethod;
      salesman: string;
    }) => {
      if (!firestore) return;

      const orderId = Date.now().toString().slice(-6);
      const salesCollectionRef = collection(firestore, "sales");
      addDoc(salesCollectionRef, {
        ...saleData,
        orderId,
        deliveryStatus: "Pending",
        salesStatus: "Pending",
        timestamp: serverTimestamp(),
      }).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: salesCollectionRef.path,
          operation: "create",
          requestResourceData: saleData,
        });
        errorEmitter.emit("permission-error", permissionError);
      });
    },
    [firestore],
  );

  const updateSale = useCallback(
    async (id: string, updates: Partial<Sale>) => {
      if (!firestore) return;
      const saleDocRef = doc(firestore, "sales", id);
      try {
        await updateDoc(saleDocRef, updates);
      } catch (error) {
        console.error("Error updating document: ", error);
        throw error;
      }
    },
    [firestore],
  );

  const deleteSale = useCallback(
    async (id: string) => {
      if (!firestore) return;
      const saleDocRef = doc(firestore, "sales", id);
      try {
        await deleteDoc(saleDocRef);
      } catch (error) {
        console.error("Error deleting document: ", error);
        throw error;
      }
    },
    [firestore],
  );

  return (
    <SalesContext.Provider
      value={{ sales, addSale, deleteSale, updateSale, loading }}
    >
      {children}
    </SalesContext.Provider>
  );
}

export function useSales() {
  const context = useContext(SalesContext);
  if (context === undefined) {
    throw new Error("useSales must be used within a SalesProvider");
  }
  return context;
}
