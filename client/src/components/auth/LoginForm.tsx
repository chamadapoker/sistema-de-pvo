import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authService.login(email, password);
      setAuth(data.user, data.token);

      // Redirecionar baseado no role
      if (data.user.role === 'ADMIN' || data.user.role === 'INSTRUCTOR') {
        navigate('/instructor/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || err.message || 'Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-mono uppercase tracking-widest text-gray-400 mb-2">
          Email de Acesso
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-[#111] border-2 border-[#333] text-white px-4 py-3 font-mono focus:border-red-600 focus:outline-none transition-colors"
          placeholder="usuario@pvo.mil.br"
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-mono uppercase tracking-widest text-gray-400 mb-2">
          Senha
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-[#111] border-2 border-[#333] text-white px-4 py-3 font-mono focus:border-red-600 focus:outline-none transition-colors"
          placeholder="••••••••"
          required
        />
      </div>

      {error && (
        <div className="bg-red-900/20 border-l-4 border-red-600 text-red-400 px-4 py-3 font-mono text-sm">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full btn-gaming bg-red-700 hover:bg-red-600 border-red-500 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            AUTENTICANDO...
          </span>
        ) : (
          'ENTRAR NO SISTEMA'
        )}
      </button>
    </form>
  );
}
