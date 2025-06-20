import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import * as authService from "../services/authService";
import { User as FirebaseUser, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";

// Tipos TypeScript melhorados
export interface User {
  id: string;
  email: string | null;
  name?: string | null;
  emailVerified: boolean;
}

export interface AuthError extends Error {
  code?: string;
  name: string;
}

export interface AuthContextType {
  // Estado do usuário
  user: User | null;
  isLoading: boolean;
  isEmailVerified: boolean;
  
  // Ações de autenticação
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  
  // Ações de verificação de email
  sendEmailVerification: () => Promise<void>;
  reloadUser: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sincroniza estado do usuário com Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName,
          emailVerified: firebaseUser.emailVerified,
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      await authService.login(email, password);
      // O onAuthStateChanged vai atualizar o estado automaticamente
    } catch (error: any) {
      // Re-throw com tratamento específico para email não verificado
      if (error.message === 'EMAIL_NOT_VERIFIED') {
        const customError: AuthError = new Error('Email não verificado');
        customError.name = 'EMAIL_NOT_VERIFIED';
        throw customError;
      }
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string): Promise<void> => {
    try {
      await authService.register(email, password, name);
      // O onAuthStateChanged vai atualizar o estado automaticamente
    } catch (error) {
      throw error;
    }
  };

  const loginWithGoogle = async (): Promise<void> => {
    try {
      await authService.loginWithGoogle();
      // O onAuthStateChanged vai atualizar o estado automaticamente
    } catch (error) {
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      throw error;
    }
  };

  const sendEmailVerification = async (): Promise<void> => {
    if (!auth.currentUser) {
      throw new Error('Nenhum usuário logado');
    }
    
    try {
      await authService.sendVerificationEmail(auth.currentUser);
    } catch (error) {
      throw error;
    }
  };

  const reloadUser = async (): Promise<boolean> => {
    if (!auth.currentUser) {
      return false;
    }
    
    try {
      const isVerified = await authService.reloadUser(auth.currentUser);
      
      // Atualizar o estado local se o usuário existe
      if (user) {
        setUser({
          ...user,
          emailVerified: isVerified,
        });
      }
      
      return isVerified;
    } catch (error) {
      console.error('Error reloading user:', error);
      return false;
    }
  };

  // Computed properties
  const isEmailVerified = user?.emailVerified || false;

  const contextValue: AuthContextType = {
    user,
    isLoading,
    isEmailVerified,
    login,
    register,
    loginWithGoogle,
    logout,
    sendEmailVerification,
    reloadUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook customizado com verificação de contexto
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
};

