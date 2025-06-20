import { FormValidationResult, FormValidationError, AuthFormData } from '../types/auth';

/**
 * Valida um endereço de email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida uma senha
 */
export function isValidPassword(password: string): boolean {
  return password.length >= 6;
}

/**
 * Valida um nome
 */
export function isValidName(name: string): boolean {
  return name.trim().length >= 2;
}

/**
 * Valida formulário de login
 */
export function validateLoginForm(email: string, password: string): FormValidationResult {
  const errors: FormValidationError[] = [];

  if (!email.trim()) {
    errors.push({ field: 'email', message: 'Email é obrigatório' });
  } else if (!isValidEmail(email)) {
    errors.push({ field: 'email', message: 'Email inválido' });
  }

  if (!password) {
    errors.push({ field: 'password', message: 'Senha é obrigatória' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Valida formulário de registro
 */
export function validateRegisterForm(formData: AuthFormData): FormValidationResult {
  const errors: FormValidationError[] = [];
  const { name, email, password, confirmPassword } = formData;

  if (!name.trim()) {
    errors.push({ field: 'name', message: 'Nome é obrigatório' });
  } else if (!isValidName(name)) {
    errors.push({ field: 'name', message: 'Nome deve ter pelo menos 2 caracteres' });
  }

  if (!email.trim()) {
    errors.push({ field: 'email', message: 'Email é obrigatório' });
  } else if (!isValidEmail(email)) {
    errors.push({ field: 'email', message: 'Email inválido' });
  }

  if (!password) {
    errors.push({ field: 'password', message: 'Senha é obrigatória' });
  } else if (!isValidPassword(password)) {
    errors.push({ field: 'password', message: 'Senha deve ter pelo menos 6 caracteres' });
  }

  if (!confirmPassword) {
    errors.push({ field: 'confirmPassword', message: 'Confirmação de senha é obrigatória' });
  } else if (password !== confirmPassword) {
    errors.push({ field: 'confirmPassword', message: 'As senhas não coincidem' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Converte códigos de erro do Firebase para mensagens amigáveis
 */
export function getFirebaseErrorMessage(errorCode: string): string {
  const errorMessages: Record<string, string> = {
    'auth/user-not-found': 'Usuário não encontrado',
    'auth/wrong-password': 'Senha incorreta',
    'auth/email-already-in-use': 'Este email já está em uso',
    'auth/weak-password': 'A senha é muito fraca',
    'auth/invalid-email': 'Email inválido',
    'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde',
    'auth/popup-closed-by-user': 'Login cancelado pelo usuário',
    'auth/popup-blocked': 'Popup bloqueado. Permita popups para este site',
    'auth/network-request-failed': 'Erro de conexão. Verifique sua internet',
    'auth/internal-error': 'Erro interno. Tente novamente',
    'EMAIL_NOT_VERIFIED': 'Email não verificado',
  };

  return errorMessages[errorCode] || 'Erro desconhecido. Tente novamente';
}

/**
 * Sanitiza dados de entrada do usuário
 */
export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

/**
 * Formata nome do usuário
 */
export function formatUserName(name: string): string {
  return name
    .trim()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

