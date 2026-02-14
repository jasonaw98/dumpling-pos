'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';

export function FirebaseErrorListener() {
  useEffect(() => {
    const handleError = (error: any) => {
      // This will be caught by the Next.js error overlay in development
      throw error;
    };

    errorEmitter.on('permission-error', handleError);

    // We don't return a cleanup function because we want this to be active 
    // for the entire lifecycle of the app.
  }, []);

  return null;
}
