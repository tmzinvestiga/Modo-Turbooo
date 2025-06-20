import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  sendEmailVerification,
  reload,
  User,
  UserCredential,
  AuthError
} from "firebase/auth";

// Tipos customizados para melhor tipagem
export interface AuthServiceError extends Error {
  code?: string;
  name: string;
}

/**
 * Realiza login com email e senha
 * @param email - Email do usuário
 * @param password - Senha do usuário
 * @throws {AuthServiceError} - Erro se email não verificado ou credenciais inválidas
 */
export async function login(email: string, password: string): Promise<UserCredential> {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    
    // Verificar se o email foi verificado
    if (!result.user.emailVerified) {
      const error: AuthServiceError = new Error('EMAIL_NOT_VERIFIED');
      error.name = 'EMAIL_NOT_VERIFIED';
      throw error;
    }
    
    return result;
  } catch (error: any) {
    // Re-throw Firebase errors ou nossos erros customizados
    throw error;
  }
}

/**
 * Registra um novo usuário com email, senha e nome
 * @param email - Email do usuário
 * @param password - Senha do usuário
 * @param name - Nome completo do usuário
 * @throws {AuthError} - Erro do Firebase se registro falhar
 */
export async function register(email: string, password: string, name: string): Promise<UserCredential> {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    // Atualizar o perfil com o nome
    await updateProfile(result.user, { displayName: name });
    
    // Enviar email de verificação automaticamente
    await sendEmailVerification(result.user);
    
    return result;
  } catch (error: any) {
    throw error;
  }
}

/**
 * Realiza login com Google
 * @throws {AuthError} - Erro do Firebase se login falhar
 */
export async function loginWithGoogle(): Promise<UserCredential> {
  try {
    const provider = new GoogleAuthProvider();
    
    // Configurar provider para solicitar informações básicas
    provider.addScope('email');
    provider.addScope('profile');
    
    const result = await signInWithPopup(auth, provider);
    
    // Usuários do Google são considerados verificados automaticamente
    // O Firebase já marca emailVerified como true para contas Google
    return result;
  } catch (error: any) {
    throw error;
  }
}

/**
 * Envia email de verificação para o usuário
 * @param user - Usuário Firebase
 * @throws {AuthError} - Erro do Firebase se envio falhar
 */
export async function sendVerificationEmail(user: User): Promise<void> {
  try {
    await sendEmailVerification(user);
  } catch (error: any) {
    throw error;
  }
}

/**
 * Recarrega dados do usuário e retorna status de verificação
 * @param user - Usuário Firebase
 * @returns {Promise<boolean>} - Status de verificação do email
 */
export async function reloadUser(user: User): Promise<boolean> {
  try {
    await reload(user);
    return user.emailVerified;
  } catch (error: any) {
    console.error('Error reloading user:', error);
    return false;
  }
}

/**
 * Verifica se o email do usuário foi verificado
 * @param user - Usuário Firebase ou null
 * @returns {boolean} - Status de verificação
 */
export function isEmailVerified(user: User | null): boolean {
  return user?.emailVerified || false;
}

/**
 * Verifica se o usuário está autenticado
 * @param user - Usuário Firebase ou null
 * @returns {boolean} - Status de autenticação
 */
export function isAuthenticated(user: User | null): boolean {
  return user !== null;
}

/**
 * Verifica se o usuário está autenticado e verificado
 * @param user - Usuário Firebase ou null
 * @returns {boolean} - Status de autenticação e verificação
 */
export function isAuthenticatedAndVerified(user: User | null): boolean {
  return isAuthenticated(user) && isEmailVerified(user);
}