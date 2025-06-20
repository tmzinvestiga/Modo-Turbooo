import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '../contexts/AuthContext';
import { Zap, Mail, Lock, Eye, EyeOff, User, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const AuthPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, login, register, loginWithGoogle, isLoading, sendEmailVerification } = useAuth();
  
  // Determine initial mode based on route
  const [isLogin, setIsLogin] = useState(() => {
    const path = location.pathname;
    return path === '/login' || path === '/auth';
  });
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');
  const [showEmailNotVerified, setShowEmailNotVerified] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Update mode when route changes
  useEffect(() => {
    const path = location.pathname;
    setIsLogin(path === '/login' || path === '/auth');
    setError('');
  }, [location.pathname]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const validateForm = () => {
    const { name, email, password, confirmPassword } = formData;
    
    if (isLogin) {
      if (!email || !password) {
        setError('Por favor, preencha todos os campos');
        return false;
      }
    } else {
      if (!name || !email || !password || !confirmPassword) {
        setError('Por favor, preencha todos os campos');
        return false;
      }
      
      if (password !== confirmPassword) {
        setError('As senhas não coincidem');
        return false;
      }
      
      if (password.length < 6) {
        setError('A senha deve ter pelo menos 6 caracteres');
        return false;
      }
      
      if (!acceptTerms) {
        setError('Você deve aceitar os termos de uso');
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;
    
    setFormLoading(true);
    
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        toast.success('Login realizado com sucesso!');
        navigate('/dashboard');
      } else {
        await register(formData.email, formData.password, formData.name);
        toast.success('Conta criada! Verifique seu email para ativar.');
        navigate('/verify-email', { state: { email: formData.email } });
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      
      // Handle specific Firebase errors
      if (error.name === 'EMAIL_NOT_VERIFIED') {
        setShowEmailNotVerified(true);
        setPendingEmail(formData.email);
        setError('');
      } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        setError('Email ou senha incorretos');
      } else if (error.code === 'auth/email-already-in-use') {
        setError('Este email já está em uso');
      } else if (error.code === 'auth/weak-password') {
        setError('A senha é muito fraca');
      } else if (error.code === 'auth/invalid-email') {
        setError('Email inválido');
      } else if (error.code === 'auth/too-many-requests') {
        setError('Muitas tentativas. Tente novamente mais tarde');
      } else {
        setError(isLogin ? 'Erro ao fazer login. Tente novamente.' : 'Erro ao criar conta. Tente novamente.');
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError('');
    setFormLoading(true);
    
    try {
      await loginWithGoogle();
      toast.success('Autenticação com Google realizada com sucesso!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Google auth error:', error);
      
      if (error.code === 'auth/popup-closed-by-user') {
        setError('Login cancelado pelo usuário');
      } else if (error.code === 'auth/popup-blocked') {
        setError('Popup bloqueado. Permita popups para este site');
      } else {
        setError('Erro ao autenticar com Google. Tente novamente.');
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      await sendEmailVerification();
      toast.success('Email de verificação reenviado!');
    } catch (error) {
      toast.error('Erro ao reenviar email de verificação');
    }
  };

  const toggleMode = () => {
    const newMode = !isLogin;
    setIsLogin(newMode);
    setError('');
    setShowEmailNotVerified(false);
    setPendingEmail('');
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setAcceptTerms(false);
    
    // Update URL without triggering navigation
    const newPath = newMode ? '/login' : '/register';
    window.history.replaceState(null, '', newPath);
  };

  const isFormDisabled = isLoading || formLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 text-2xl font-bold text-gray-900 dark:text-white hover:opacity-80 transition-opacity">
            <Zap className="h-8 w-8 text-primary" />
            <span>MODO TURBO</span>
          </Link>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {isLogin ? 'Entre na sua conta' : 'Crie sua conta gratuita'}
          </p>
        </div>

        {/* Auth Card */}
        <Card className="shadow-xl border-0 bg-white/80 dark:bg-card/80 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              {isLogin ? 'Bem-vindo de volta' : 'Criar conta'}
            </CardTitle>
            <CardDescription className="text-center">
              {isLogin 
                ? 'Entre com sua conta para continuar' 
                : 'Comece sua jornada de produtividade hoje'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Email Not Verified Alert */}
            {showEmailNotVerified && (
              <Alert>
                <Mail className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p>Seu email ainda não foi verificado. Verifique sua caixa de entrada e spam.</p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleResendVerification}
                        disabled={isFormDisabled}
                      >
                        Reenviar email
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setShowEmailNotVerified(false);
                          setPendingEmail('');
                        }}
                        disabled={isFormDisabled}
                      >
                        Tentar novamente
                      </Button>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Google Auth Button */}
            <Button
              variant="outline"
              className="w-full"
              onClick={handleGoogleAuth}
              disabled={isFormDisabled}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {isFormDisabled ? 'Processando...' : 'Continuar com Google'}
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-card px-2 text-gray-500">
                  Ou continue com
                </span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Field (Register only) */}
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Seu nome completo"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="pl-10"
                      disabled={isFormDisabled}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="pl-10"
                    disabled={isFormDisabled}
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={isLogin ? 'Sua senha' : 'Mínimo 6 caracteres'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="pl-10 pr-10"
                    disabled={isFormDisabled}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                    disabled={isFormDisabled}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field (Register only) */}
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirme sua senha"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="pl-10 pr-10"
                      disabled={isFormDisabled}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                      disabled={isFormDisabled}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Forgot Password Link (Login only) */}
              {isLogin && (
                <div className="flex items-center justify-end">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-primary hover:text-primary/80"
                  >
                    Esqueceu a senha?
                  </Link>
                </div>
              )}

              {/* Terms Checkbox (Register only) */}
              {!isLogin && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={acceptTerms}
                    onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                    disabled={isFormDisabled}
                  />
                  <Label htmlFor="terms" className="text-sm">
                    Aceito os{' '}
                    <Link to="/terms" className="text-primary hover:text-primary/80">
                      termos de uso
                    </Link>{' '}
                    e{' '}
                    <Link to="/privacy" className="text-primary hover:text-primary/80">
                      política de privacidade
                    </Link>
                  </Label>
                </div>
              )}

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={isFormDisabled}>
                {formLoading 
                  ? (isLogin ? 'Entrando...' : 'Criando conta...') 
                  : (isLogin ? 'Entrar' : 'Criar conta')
                }
              </Button>
            </form>

            {/* Toggle Mode */}
            <div className="text-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}{' '}
                <button
                  onClick={toggleMode}
                  className="text-primary hover:text-primary/80 font-medium disabled:opacity-50"
                  disabled={isFormDisabled}
                >
                  {isLogin ? 'Registre-se' : 'Faça login'}
                </button>
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

