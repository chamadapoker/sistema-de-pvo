import { LoginForm } from '../../components/auth/LoginForm';

export function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-military-900 mb-2">
            PVO Modern
          </h1>
          <p className="text-gray-600">
            Sistema de Treinamento de Reconhecimento Visual
          </p>
        </div>

        <div className="card">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Entrar no Sistema
          </h2>

          <LoginForm />

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              Usuários de teste:
            </p>
            <div className="mt-3 text-xs text-gray-500 space-y-2">
              <div className="bg-gray-50 p-3 rounded">
                <p className="font-medium">Aluno:</p>
                <p>Email: aluno@pvo.mil.br</p>
                <p>Senha: aluno123</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="font-medium">Instrutor:</p>
                <p>Email: instrutor@pvo.mil.br</p>
                <p>Senha: instrutor123</p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Versão Moderna 2026 - Baseado no sistema PVO original
        </p>
      </div>
    </div>
  );
}
