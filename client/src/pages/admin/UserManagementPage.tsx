import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { userService } from '../../services/userService';
import { useAuthStore } from '../../store/authStore';
import type { User, Role } from '../../types';

export function UserManagementPage() {
    const { user: currentUser } = useAuthStore();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await userService.getAllUsers();
            setUsers(data);
        } catch (error) {
            console.error('Error loading users:', error);
            // alert('Erro ao carregar usuários. Verifique se você é Admin.');
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId: string, newRole: Role) => {
        if (!confirm(`Tem certeza que deseja alterar o nível de acesso para ${newRole}?`)) return;

        try {
            await userService.updateUserRole(userId, newRole);
            // Optimistic update or reload
            loadUsers();
        } catch (error: any) {
            alert('Erro ao atualizar permissão: ' + error.message);
        }
    };

    const getRoleBadge = (role: Role) => {
        switch (role) {
            case 'ADMIN':
                return <span className="px-2 py-0.5 bg-red-900/40 text-red-500 border border-red-900 text-[10px] font-mono uppercase tracking-wider">COMANDANTE (ADMIN)</span>;
            case 'INSTRUCTOR':
                return <span className="px-2 py-0.5 bg-yellow-900/40 text-yellow-500 border border-yellow-900 text-[10px] font-mono uppercase tracking-wider">INSTRUTOR</span>;
            case 'STUDENT':
                return <span className="px-2 py-0.5 bg-green-900/40 text-green-500 border border-green-900 text-[10px] font-mono uppercase tracking-wider">CADETE</span>;
            default:
                return null;
        }
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout>
            <div className="space-y-8 animate-fade-in pb-20">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-red-900/30 pb-6 gap-4">
                    <div>
                        <h1 className="text-4xl font-black italic text-white uppercase tracking-tighter">
                            <span className="text-red-600">Comando</span> // Pessoal
                        </h1>
                        <p className="text-sm text-gray-500 font-mono uppercase tracking-widest mt-2">
                            Gerenciamento de Patentes e Acessos
                        </p>
                    </div>
                    <div className="bg-[#111] px-4 py-2 border border-[#333]">
                        <span className="text-xs text-gray-500 font-mono uppercase">Total de Efetivo: </span>
                        <span className="text-white font-bold">{users.length}</span>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-[#0a0a0a] p-4 border border-[#222]">
                    <input
                        type="text"
                        placeholder="BUSCAR POR NOME, EMAIL..."
                        className="w-full bg-[#111] border border-[#333] px-4 py-2 text-white font-mono focus:border-red-600 focus:outline-none"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* List */}
                <div className="space-y-2">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        </div>
                    ) : (
                        filteredUsers.map(u => (
                            <div key={u.id} className="group flex flex-col md:flex-row items-center justify-between bg-[#0a0a0a] border border-[#222] p-4 hover:border-red-600 transition-all">
                                <div className="flex items-center gap-4 mb-4 md:mb-0 w-full md:w-auto">
                                    <div className="w-10 h-10 bg-[#111] border border-[#333] flex items-center justify-center text-red-600 font-bold">
                                        {u.name[0]?.toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-white font-bold uppercase">{u.name}</span>
                                            {getRoleBadge(u.role)}
                                        </div>
                                        <div className="text-xs text-gray-500 font-mono">{u.email}</div>
                                        <div className="text-[10px] text-gray-600 font-mono mt-1">ID: {u.id}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                    {u.id !== currentUser?.id && (
                                        <>
                                            <button
                                                onClick={() => handleRoleChange(u.id, 'STUDENT')}
                                                disabled={u.role === 'STUDENT'}
                                                className={`px-3 py-1 text-[10px] font-mono uppercase border ${u.role === 'STUDENT' ? 'bg-green-900/20 border-green-900 text-green-500 cursor-default' : 'bg-[#111] border-[#333] text-gray-400 hover:border-green-600 hover:text-green-500'}`}
                                            >
                                                Cadete
                                            </button>
                                            <button
                                                onClick={() => handleRoleChange(u.id, 'INSTRUCTOR')}
                                                disabled={u.role === 'INSTRUCTOR'}
                                                className={`px-3 py-1 text-[10px] font-mono uppercase border ${u.role === 'INSTRUCTOR' ? 'bg-yellow-900/20 border-yellow-900 text-yellow-500 cursor-default' : 'bg-[#111] border-[#333] text-gray-400 hover:border-yellow-600 hover:text-yellow-500'}`}
                                            >
                                                Instrutor
                                            </button>
                                            <button
                                                onClick={() => handleRoleChange(u.id, 'ADMIN')}
                                                disabled={u.role === 'ADMIN'}
                                                className={`px-3 py-1 text-[10px] font-mono uppercase border ${u.role === 'ADMIN' ? 'bg-red-900/20 border-red-900 text-red-500 cursor-default' : 'bg-[#111] border-[#333] text-gray-400 hover:border-red-600 hover:text-red-500'}`}
                                            >
                                                Comandante
                                            </button>
                                        </>
                                    )}
                                    {u.id === currentUser?.id && (
                                        <span className="text-xs text-gray-500 italic px-4">Esta conta (Você)</span>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
