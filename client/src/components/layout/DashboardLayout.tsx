
import { useState } from 'react';
import type { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

// Ícones SVG inline para evitar dependências externas quebradas
const Icons = {
    Menu: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="18" x2="20" y2="18"></line></svg>,
    Home: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>,
    Target: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>,
    Cards: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>,
    Exam: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>,
    Stats: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10"></path><path d="M12 20V4"></path><path d="M6 20v-6"></path></svg>,
    Settings: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>,
    Globe: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>,
    Document: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>,
    LogOut: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>,
    Eye: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>,
    Users: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
};

interface DashboardLayoutProps {
    children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, clearAuth } = useAuthStore();

    // Determine current view mode (Instructor vs Student)
    const isInstructorOrAdmin = user?.role === 'INSTRUCTOR' || user?.role === 'ADMIN';
    const isStudentPath = location.pathname.startsWith('/student');

    // Menu construction
    const getMenuItems = () => {
        // If Instructor/Admin is viewing as student, show student menu
        if (isInstructorOrAdmin && isStudentPath) {
            return [
                { path: '/student/dashboard', label: 'Dashboard', icon: Icons.Home },
                { path: '/student/training', label: 'Baterias', icon: Icons.Target },
                { path: '/student/flashcards', label: 'Flashcards', icon: Icons.Cards },
                { path: '/student/countries', label: 'Países', icon: Icons.Globe },
                { path: '/student/test', label: 'Avaliação', icon: Icons.Exam },
                { path: '/student/results', label: 'Histórico', icon: Icons.Stats },
            ];
        }

        if (isInstructorOrAdmin) {
            const items = [
                { path: '/instructor/dashboard', label: 'Dashboard', icon: Icons.Home },
                { path: '/instructor/countries', label: 'Nações', icon: Icons.Globe },
                { path: '/instructor/equipment', label: 'Equipamentos', icon: Icons.Settings },
            ];

            if (user?.role === 'ADMIN') {
                items.push({ path: '/admin/users', label: 'Efetivo', icon: Icons.Users });
            }

            items.push(
                { path: '/instructor/tests', label: 'Testes', icon: Icons.Document },
                { path: '/instructor/student-results', label: 'Resultados', icon: Icons.Stats },
            );

            return items;
        }

        // Regular Student
        return [
            { path: '/student/dashboard', label: 'Dashboard', icon: Icons.Home },
            { path: '/student/training', label: 'Baterias', icon: Icons.Target },
            { path: '/student/flashcards', label: 'Flashcards', icon: Icons.Cards },
            { path: '/student/countries', label: 'Países', icon: Icons.Globe },
            { path: '/student/test', label: 'Avaliação', icon: Icons.Exam },
            { path: '/student/results', label: 'Histórico', icon: Icons.Stats },
        ];
    };

    const menuItems = getMenuItems();
    const isActive = (path: string) => location.pathname === path;

    const handleLogout = () => {
        clearAuth();
        window.location.href = '/login';
    };

    return (
        <div className="min-h-screen bg-[#050505] text-[#E5E5E5] flex">

            {/* INSTRUCTOR OVERLAY (View as Student Mode) */}
            {isInstructorOrAdmin && isStudentPath && (
                <div className="fixed top-0 left-0 right-0 h-8 bg-red-600 z-[100] flex items-center justify-center text-white text-xs font-black tracking-widest uppercase shadow-lg">
                    <span>⚠️ MODO DE VISUALIZAÇÃO: ALUNO</span>
                    <button
                        onClick={() => navigate('/instructor/dashboard')}
                        className="ml-4 bg-black/30 hover:bg-black/50 px-3 py-0.5 rounded border border-white/20 transition-colors"
                    >
                        RETORNAR AO PAINEL
                    </button>
                </div>
            )}

            {/* Mobile Header */}
            <div className={`lg:hidden fixed left-0 right-0 h-16 bg-[#121212] border-b border-[#333] z-50 flex items-center justify-between px-4 ${isInstructorOrAdmin && isStudentPath ? 'top-8' : 'top-0'}`}>
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white hover:text-red-500">
                    <Icons.Menu />
                </button>
                <div className="text-xl font-black italic tracking-tighter">
                    <span className="text-white">PVO</span>
                    <span className="text-red-600">POKER</span>
                </div>
                <div className="w-6"></div> {/* Spacer */}
            </div>

            {/* Sidebar Overlay (Mobile) */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar Container */}
            <aside className={`
                fixed lg:sticky left-0 h-screen bg-[#0a0a0a] border-r border-[#333] z-50 transform transition-all duration-300 ease-in-out flex flex-col
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                ${isInstructorOrAdmin && isStudentPath ? 'top-8 h-[calc(100vh-2rem)]' : 'top-0'}
                ${collapsed ? 'w-20' : 'w-64'}
            `}>
                {/* Logo Area */}
                <div className="h-20 flex items-center justify-center border-b border-[#222] gap-3 relative">
                    <img src="/assets/Leoall.gif" alt="Logo" className="h-10 w-auto mix-blend-screen" />
                    {!collapsed && (
                        <div className="text-2xl font-black italic tracking-tighter cursor-default select-none animate-fade-in">
                            <span className="text-white">PVO</span>
                            <span className="text-red-600">POKER</span>
                        </div>
                    )}

                    {/* Collapse Toggle Button (Desktop only) */}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#222] border border-[#333] rounded-full items-center justify-center text-gray-400 hover:text-white hover:border-red-600 transition-colors z-50"
                    >
                        {collapsed ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                        )}
                    </button>
                </div>

                {/* User Info */}
                <div className={`px-4 py-4 border-b border-[#222] bg-[#111] ${collapsed ? 'flex justify-center' : ''}`}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-900/20 border border-red-900 rounded-full flex items-center justify-center shrink-0">
                            <span className="text-red-600 font-bold text-sm">{user?.name?.[0]?.toUpperCase()}</span>
                        </div>
                        {!collapsed && (
                            <div className="overflow-hidden">
                                <p className="text-sm font-bold text-white max-w-[150px] truncate" title={user?.name}>{user?.name}</p>
                                <p className="text-xs text-gray-500 font-mono uppercase">{user?.role}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-6 space-y-1 overflow-y-auto">
                    {/* View Switch Button for Instructors */}
                    {isInstructorOrAdmin && !isStudentPath && (
                        <div className={`px-4 mb-4 ${collapsed ? 'px-2' : ''}`}>
                            <button
                                onClick={() => navigate('/student/dashboard')}
                                className={`w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#111] border border-[#333] hover:border-red-600 text-white text-xs font-bold uppercase transition-all group ${collapsed ? 'px-0' : ''}`}
                                title={collapsed ? 'Ver como Aluno' : ''}
                            >
                                <Icons.Eye />
                                {!collapsed && <span className="group-hover:text-red-600">Ver como Aluno</span>}
                            </button>
                        </div>
                    )}

                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-[#1a1a1a] border-l-4 transition-all font-medium ${isActive(item.path)
                                ? 'text-white bg-[#1a1a1a] border-red-600'
                                : 'border-transparent hover:border-gray-600'}
                                ${collapsed ? 'justify-center px-0' : ''}
                                `}
                            title={collapsed ? item.label : ''}
                        >
                            <item.icon />
                            {!collapsed && <span>{item.label}</span>}
                        </Link>
                    ))}
                </nav>

                {/* User / Footer */}
                <div className="p-4 border-t border-[#222]">
                    <button
                        onClick={handleLogout}
                        className={`flex items-center gap-3 text-gray-500 hover:text-red-500 w-full px-4 py-2 transition-colors text-sm font-medium uppercase tracking-wide group ${collapsed ? 'justify-center px-0' : ''}`}
                        title="Ejetar do Sistema"
                    >
                        {/* Eject Icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:text-red-600 transition-colors">
                            <path d="M12 2L2 22h20L12 2z"></path>
                            <path d="M12 17v-6"></path>
                            <path d="M12 11h.01"></path>
                        </svg>
                        {!collapsed && <span>EJETAR</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`flex-1 min-w-0 ${isInstructorOrAdmin && isStudentPath ? 'pt-8' : ''}`}>
                <div className="pt-16 lg:pt-0 max-w-7xl mx-auto p-4 lg:p-8 animate-fade-in">
                    {children}
                </div>
            </main>
        </div>
    );
}
