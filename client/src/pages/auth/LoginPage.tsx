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
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-500 font-mono text-xs">SISTEMA ONLINE</span>
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


        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-600 font-mono">
            <span className="text-red-600">█</span> VERSÃO MODERNA 2026 <span className="text-red-600">█</span>
          </p>
          <p className="text-[10px] text-gray-700 mt-2">Baseado no sistema PVO original</p>
        </div>
      </div>

      {/* A-1 AMX Fighter Jet Decor */}
      <img
        src="/login_bg_amx.jpg"
        alt="AMX A-1"
        className="absolute bottom-0 right-0 w-[1400px] max-w-none opacity-30 pointer-events-none translate-x-[20%] translate-y-[10%] z-0 mix-blend-screen md:opacity-50"
      />
    </div >
  );
}
