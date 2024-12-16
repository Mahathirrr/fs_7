"use client";

import { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '@/lib/auth/hooks/use-auth';

const AuthContext = createContext<ReturnType<typeof useAuth>>({
  user: null,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);