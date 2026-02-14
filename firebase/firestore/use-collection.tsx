"use client";

import { useState, useEffect } from 'react';
import { onSnapshot, type Query, type DocumentData, type QuerySnapshot, type FirestoreError } from 'firebase/firestore';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

export function useCollection<T = DocumentData>(q: Query<T> | null) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  useEffect(() => {
    if (!q) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = onSnapshot(q,
      (snapshot: QuerySnapshot<T>) => {
        const docs = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        }));
        setData(docs);
        setLoading(false);
        setError(null);
      },
      async (err: FirestoreError) => {
        setError(err);
        setLoading(false);
        const permissionError = new FirestorePermissionError({
            path: `unknown path for collection query`,
            operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
      }
    );

    return () => unsubscribe();
  }, [q]);

  return { data, loading, error };
}
