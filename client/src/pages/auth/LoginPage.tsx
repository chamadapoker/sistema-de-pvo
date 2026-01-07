import { LoginForm } from '../../components/auth/LoginForm';

export function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] px-4 relative overflow-hidden">
      {/* Tactical Background Grid */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,0,0.03)_1px,transparent_1px)] bg-[length:40px_40px]"></div>

      {/* Animated Scanline */}
      <div className="absolute top-0 left-0 w-full h-[20%] bg-gradient-to-b from-red-500/10 to-transparent animate-scan pointer-events-none"></div>

      {/* Corner Decorations */}
      <div className="absolute top-0 left-0 w-32 h-32 border-t-4 border-l-4 border-red-600 opacity-30"></div>
      <div className="absolute top-0 right-0 w-32 h-32 border-t-4 border-r-4 border-red-600 opacity-30"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 border-b-4 border-l-4 border-red-600 opacity-30"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 border-b-4 border-r-4 border-red-600 opacity-30"></div>

      {/* Main Content */}
      <div className="max-w-md w-full relative z-10">
        {/* Logo/Title Section */}
        <div className="text-center mb-12">
          <div className="inline-block relative mb-4">
            <div className="text-6xl font-black italic tracking-tighter drop-shadow-[0_0_20px_rgba(220,38,38,0.5)]">
              <span className="text-white">PVO</span>
              <span className="text-red-600">POKER</span>
            </div>
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent"></div>
          </div>
          <p className="text-gray-400 font-mono text-xs uppercase tracking-widest">
            Sistema Tático de Reconhecimento Visual
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
            <span className="text-red-600 font-mono text-xs">SISTEMA ONLINE</span>
          </div>
        </div>

        {/* Login Card */}
        <div className="gaming-card bg-[#0a0a0a] border-2 border-[#222] p-8 group">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-[#333]">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <h2 className="text-2xl font-black italic text-white uppercase tracking-tight">
              Acesso Restrito
            </h2>
          </div>

          <LoginForm />

          {/* Test Credentials */}
          <div className="mt-8 pt-6 border-t border-[#333]">
            <p className="text-xs text-gray-500 font-mono uppercase tracking-widest mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Credenciais de Teste
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Student */}
              <div className="bg-[#111] border border-[#333] p-4 hover:border-red-900 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <p className="text-xs font-bold text-blue-500 uppercase tracking-wider">Aluno</p>
                </div>
                <p className="text-xs text-gray-400 font-mono mb-1">aluno@pvo.mil.br</p>
                <p className="text-xs text-gray-400 font-mono">aluno123</p>
              </div>

              {/* Instructor */}
              <div className="bg-[#111] border border-[#333] p-4 hover:border-red-900 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                  <p className="text-xs font-bold text-yellow-500 uppercase tracking-wider">Instrutor</p>
                </div>
                <p className="text-xs text-gray-400 font-mono mb-1">instrutor@pvo.mil.br</p>
                <p className="text-xs text-gray-400 font-mono">instrutor123</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-600 font-mono">
            <span className="text-red-600">█</span> VERSÃO MODERNA 2026 <span className="text-red-600">█</span>
          </p>
          <p className="text-[10px] text-gray-700 mt-2">Baseado no sistema PVO original</p>
        </div>
      </div>
    </div>
  );
}
