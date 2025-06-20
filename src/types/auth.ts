// Tipos relacionados à autenticação

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

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
  confirmPassword: string;
}

export interface AuthFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isEmailVerified: boolean;
}

// Tipos para componentes de autenticação
export interface AuthPageProps {
  initialMode?: 'login' | 'register';
}

export interface ProtectedRouteProps {
  children: React.ReactNode;
  requireEmailVerification?: boolean;
}

// Tipos para contexto de autenticação
export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  sendEmailVerification: () => Promise<void>;
  reloadUser: () => Promise<boolean>;
}

// Tipos para validação de formulários
export interface FormValidationError {
  field: string;
  message: string;
}

export interface FormValidationResult {
  isValid: boolean;
  errors: FormValidationError[];
}

// Constantes de autenticação
export const AUTH_ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  AUTH: '/auth',
  VERIFY_EMAIL: '/verify-email',
  FORGOT_PASSWORD: '/forgot-password',
  DASHBOARD: '/dashboard',
} as const;

export const AUTH_ERRORS = {
  EMAIL_NOT_VERIFIED: 'EMAIL_NOT_VERIFIED',
  USER_NOT_FOUND: 'auth/user-not-found',
  WRONG_PASSWORD: 'auth/wrong-password',
  EMAIL_ALREADY_IN_USE: 'auth/email-already-in-use',
  WEAK_PASSWORD: 'auth/weak-password',
  INVALID_EMAIL: 'auth/invalid-email',
  TOO_MANY_REQUESTS: 'auth/too-many-requests',
  POPUP_CLOSED_BY_USER: 'auth/popup-closed-by-user',
  POPUP_BLOCKED: 'auth/popup-blocked',
} as const;

