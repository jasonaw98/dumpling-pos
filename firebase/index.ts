"use client";

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

import { useFirebase, useFirebaseApp, useFirestore, FirebaseProvider } from './provider';
import { FirebaseClientProvider } from './client-provider';
import { useCollection } from './firestore/use-collection';
import { useDoc } from './firestore/use-doc';

let firebaseApp: FirebaseApp | null = null;
let firestore: Firestore | null = null;

function initializeFirebase() {
  if (firebaseApp) {
    return { firebaseApp, firestore };
  }

  if (firebaseConfig && firebaseConfig.apiKey) {
    if (getApps().length === 0) {
      firebaseApp = initializeApp(firebaseConfig);
    } else {
      firebaseApp = getApp();
    }
    firestore = getFirestore(firebaseApp);
  } else {
    console.warn("Firebase config not found or is invalid. Firebase will not be initialized.");
  }
  
  return { firebaseApp, firestore };
}

export {
  initializeFirebase,
  FirebaseProvider,
  FirebaseClientProvider,
  useCollection,
  useDoc,
  useFirebase,
  useFirebaseApp,
  useFirestore,
};
