"use client";

import { createContext, useContext, ReactNode } from 'react';
import type { FirebaseApp } from 'firebase/app';
import type { Firestore } from 'firebase/firestore';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

interface FirebaseContextType {
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
}

const FirebaseContext = createContext<FirebaseContextType>({
  firebaseApp: null,
  firestore: null,
});

export function FirebaseProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: FirebaseContextType;
}) {
  return (
    <FirebaseContext.Provider value={value}>
      {children}
      <FirebaseErrorListener />
    </FirebaseContext.Provider>
  );
}

export const useFirebaseApp = () => useContext(FirebaseContext)?.firebaseApp;
export const useFirestore = () => useContext(FirebaseContext)?.firestore;
// A general hook to get all services
export const useFirebase = () => useContext(FirebaseContext);
