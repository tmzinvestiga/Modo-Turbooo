import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '../contexts/AuthContext';
import { Zap, Mail, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const EmailVerificationPage: React.FC = () => {
  const [isResending, setIsResending] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const { user, sendEmailVerification, reloadUser, isEmailVerified } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || user?.email || '';

  // Redirect if already verified
  useEffect(() => {
    if (user && isEmailVerified) {
      navigate('/dashboard');
    }
  }, [user, isEmailVerified, navigate]);

  // Redirect if not logged in and no email provided
  useEffect(() => {
    if (!user && !email) {
      navigate('/auth');
    }
  }, [user, email, navigate]);

  const handleResendVerification = async () => {
    if (!email) {
      toast.error('Email não encontrado');
      return;
    }

    setIsResending(true);
    try {
      await sendEmailVerification();
      toast.success('Email de verificação reenviado!');
    } catch (error: any) {
      console.error('Resend verification error:', error);
      if (error.message?.includes('too-many-requests')) {
        toast.error('Muitas tentativas. Aguarde antes de tentar novamente.');
      } else {
        toast.error('Erro ao reenviar email de verificação');
      }
    } finally {
      setIsResending(false);
    }
  };

  const handleCheckVerification = async () => {
    setIsChecking(true);
    try {
      const isVerified = await reloadUser();
      if (isVerified) {
        toast.success('Email verificado com sucesso!');
        navigate('/dashboard');
      } else {
        toast.info('Email ainda não foi verificado. Verifique sua caixa de entrada.');
      }
    } catch (error) {
      console.error('Check verification error:', error);
      toast.error('Erro ao verificar status do email');
    } finally {
      setIsChecking(false);
    }
  };

  const isLoading = isResending || isChecking;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 text-2xl font-bold text-gray-900 dark:text-white hover:opacity-80 transition-opacity">
            <Zap className="h-8 w-8 text-primary" />
            <span>MODO TURBO</span>
          </Link>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 dark:bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Verifique seu email</CardTitle>
            <CardDescription className="text-center">
              Enviamos um link de verificação para
              <br />
              <span className="font-medium text-gray-900 dark:text-gray-100">{email}</span>
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Clique no link do email para ativar sua conta. Se não recebeu o email, verifique sua caixa de spam.
                </AlertDescription>
              </Alert>
            </div>

            <div className="space-y-4">
              <Button
                onClick={handleCheckVerification}
                disabled={isLoading}
                className="w-full"
              >
                {isChecking ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Já verifiquei meu email
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={handleResendVerification}
                disabled={isLoading}
              >
                {isResending ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Reenviando...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reenviar email
                  </>
                )}
              </Button>

              <div className="text-center">
                <Link
                  to="/register"
                  className="text-sm text-primary hover:text-primary/80"
                >
                  Usar um email diferente
                </Link>
              </div>
            </div>

            <div className="text-center pt-4 border-t">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Problemas com a verificação?{' '}
                <Link to="/auth" className="text-primary hover:text-primary/80 font-medium">
                  Voltar ao login
                </Link>
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

