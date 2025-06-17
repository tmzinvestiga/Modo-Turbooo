import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '../contexts/AuthContext';
import { Zap, Mail, CheckCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export const EmailVerificationPage: React.FC = () => {
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const { verifyEmail, resendVerification } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || localStorage.getItem('pendingVerification') || '';

  const handleResendVerification = async () => {
    if (!email) {
      toast.error('Email não encontrado');
      return;
    }

    setIsResending(true);
    try {
      await resendVerification(email);
      toast.success('Email de verificação reenviado!');
    } catch (error) {
      toast.error('Erro ao reenviar email de verificação');
    } finally {
      setIsResending(false);
    }
  };

  const handleMockVerification = async () => {
    setIsVerifying(true);
    try {
      // Simulate clicking verification link
      await verifyEmail('mock-token');
      toast.success('Email verificado com sucesso!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Erro ao verificar email');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 text-2xl font-bold text-gray-900">
            <Zap className="h-8 w-8 text-blue-600" />
            <span>MODO TURBO</span>
          </Link>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">Verifique seu email</CardTitle>
            <CardDescription className="text-center">
              Enviamos um link de verificação para
              <br />
              <span className="font-medium text-gray-900">{email}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600">
                Clique no link do email para ativar sua conta. Se não recebeu o email, verifique sua caixa de spam.
              </p>
              
              {/* Mock verification button for demo purposes */}
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800 mb-2">
                  <strong>Demo:</strong> Clique abaixo para simular a verificação do email
                </p>
                <Button
                  onClick={handleMockVerification}
                  disabled={isVerifying}
                  className="w-full"
                  variant="outline"
                >
                  {isVerifying ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Verificando...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Simular Verificação
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleResendVerification}
                disabled={isResending}
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
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  Usar um email diferente
                </Link>
              </div>
            </div>

            <div className="text-center pt-4 border-t">
              <span className="text-sm text-gray-600">
                Já verificou seu email?{' '}
                <Link to="/login" className="text-blue-600 hover:text-blue-500 font-medium">
                  Fazer login
                </Link>
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

