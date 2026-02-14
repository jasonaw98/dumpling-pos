"use client";

import { useState, useEffect } from 'react';
import { onSnapshot, type DocumentReference, type DocumentSnapshot, type FirestoreError, type DocumentData } from 'firebase/firestore';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

export function useDoc<T = DocumentData>(ref: DocumentReference<T> | null) {
  const [data, setData] = useState<T & {id: string} | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  useEffect(() => {
    if (!ref) {
      setData(null);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    const unsubscribe = onSnapshot(ref,
      (snapshot: DocumentSnapshot<T>) => {
        if (snapshot.exists()) {
          const docData = snapshot.data();
          if (docData) {
            setData({ ...docData, id: snapshot.id });
          } else {
             setData(null);
          }
        } else {
          setData(null);
        }
        setLoading(false);
      },
      async (err: FirestoreError) => {
        setError(err);
        setLoading(false);
        const permissionError = new FirestorePermissionError({
          path: ref.path,
          operation: 'get',
        });
        errorEmitter.emit('permission-error', permissionError);
      }
    );

    return () => unsubscribe();
  }, [ref]);

  return { data, loading, error };
}
