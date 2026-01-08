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

    // Modal States
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Forms
    const [createFormData, setCreateFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'STUDENT' as Role
    });

    const [editFormData, setEditFormData] = useState({
        id: '',
        name: '',
        email: '',
        password: '',
        blocked: false,
        accessUntil: '', // YYYY-MM-DD
    });

    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await userService.getAllUsers();
            setUsers(data);
        } catch (error) {
            console.error('Error loading users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId: string, newRole: Role) => {
        if (!confirm(`Tem certeza que deseja alterar o nível de acesso para ${newRole}?`)) return;

        try {
            await userService.updateUserRole(userId, newRole);
            loadUsers();
        } catch (error: any) {
            alert('Erro ao atualizar permissão: ' + error.message);
        }
    };

    const handleOpenEdit = (user: User) => {
        setEditFormData({
            id: user.id,
            name: user.name,
            email: user.email,
            password: '', // blank by default
            blocked: user.blocked || false,
            accessUntil: user.accessUntil ? new Date(user.accessUntil).toISOString().split('T')[0] : ''
        });
        setIsEditModalOpen(true);
    };

    const handleUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        try {
            await userService.updateUser(editFormData.id, {
                name: editFormData.name,
                email: editFormData.email,
                password: editFormData.password || undefined,
                blocked: editFormData.blocked,
                accessUntil: editFormData.accessUntil ? new Date(editFormData.accessUntil).toISOString() : null
            });
            alert('Usuário atualizado com sucesso!');
            setIsEditModalOpen(false);
            loadUsers();
        } catch (error: any) {
            alert('Erro ao atualizar: ' + error.message);
        } finally {
            setProcessing(false);
        }
    };

    const handleDeleteUser = async (id: string) => {
        if (!confirm('ATENÇÃO: Isso excluirá permanentemente o usuário e todos os seus dados. Continuar?')) return;
        setProcessing(true);
        try {
            await userService.deleteUser(id);
            loadUsers();
        } catch (error: any) {
            alert('Erro ao excluir: ' + error.message);
        } finally {
            setProcessing(false);
        }
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        try {
            if (createFormData.password.length < 6) {
                alert("A senha deve ter no mínimo 6 caracteres.");
                setProcessing(false);
                return;
            }

            await userService.createUser(createFormData);
            alert("Usuário criado com sucesso!");
            setIsCreateModalOpen(false);
            setCreateFormData({ name: '', email: '', password: '', role: 'STUDENT' });
            loadUsers();
        } catch (error: any) {
            alert("Erro ao criar usuário: " + error.message);
        } finally {
            setProcessing(false);
        }
    };

    const getRoleBadge = (role: Role) => {
        switch (role) {
            case 'ADMIN':
                return <span className="px-2 py-0.5 bg-red-900/40 text-red-500 border border-red-900 text-[10px] font-mono uppercase tracking-wider">COMANDANTE (ADMIN)</span>;
            case 'INSTRUCTOR':
                return <span className="px-2 py-0.5 bg-yellow-900/40 text-yellow-500 border border-yellow-900 text-[10px] font-mono uppercase tracking-wider">INSTRUTOR</span>;
            case 'STUDENT':
                return <span className="px-2 py-0.5 bg-green-900/40 text-green-500 border border-green-900 text-[10px] font-mono uppercase tracking-wider">ALUNO</span>;
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
                    <div className="flex gap-4 items-center">
                        <div className="bg-[#111] px-4 py-2 border border-[#333]">
                            <span className="text-xs text-gray-500 font-mono uppercase">Total de Efetivo: </span>
                            <span className="text-white font-bold">{users.length}</span>
                        </div>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="btn-gaming bg-red-700 hover:bg-red-600 border-red-500"
                        >
                            + Novo Usuário
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-[#0a0a0a] p-4 border border-[#222]">
                    <input
                        type="text"
                        placeholder="BUSCAR POR NOME, EMAIL..."
                        className="w-full bg-[#111] border border-[#333] px-4 py-2 text-white font-mono focus:border-red-600 focus:outline-none uppercase"
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
                            <div key={u.id} className={`group flex flex-col md:flex-row items-center justify-between bg-[#0a0a0a] border border-[#222] p-4 hover:border-red-600 transition-all ${u.blocked ? 'opacity-50 grayscale' : ''}`}>
                                <div className="flex items-center gap-4 mb-4 md:mb-0 w-full md:w-auto">
                                    <div className={`w-10 h-10 border flex items-center justify-center font-bold ${u.blocked ? 'bg-red-900/20 border-red-900 text-red-500' : 'bg-[#111] border-[#333] text-gray-300'}`}>
                                        {u.blocked ? '⛔' : u.name[0]?.toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-white font-bold uppercase">{u.name}</span>
                                            {getRoleBadge(u.role)}
                                            {u.blocked && <span className="text-xs text-red-500 font-bold uppercase border border-red-500 px-1">BLOQUEADO</span>}
                                        </div>
                                        <div className="text-xs text-gray-500 font-mono">{u.email}</div>
                                        {u.accessUntil && (
                                            <div className="text-[10px] text-green-500 font-mono mt-0.5">
                                                Acesso até: {new Date(u.accessUntil).toLocaleDateString()}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                    {u.id !== currentUser?.id && (
                                        <>
                                            <div className="flex flex-col gap-1 mr-4 border-r border-[#333] pr-4">
                                                <div className="text-[10px] text-gray-500 font-mono uppercase text-right mb-1">Patente</div>
                                                <div className="flex gap-1">
                                                    <button onClick={() => handleRoleChange(u.id, 'STUDENT')} disabled={u.role === 'STUDENT'} className={`w-6 h-6 flex items-center justify-center text-[10px] border ${u.role === 'STUDENT' ? 'bg-green-900 border-green-500 text-white' : 'bg-[#111] border-[#333] text-gray-500 hover:border-green-500'}`}>A</button>
                                                    <button onClick={() => handleRoleChange(u.id, 'INSTRUCTOR')} disabled={u.role === 'INSTRUCTOR'} className={`w-6 h-6 flex items-center justify-center text-[10px] border ${u.role === 'INSTRUCTOR' ? 'bg-yellow-900 border-yellow-500 text-white' : 'bg-[#111] border-[#333] text-gray-500 hover:border-yellow-500'}`}>I</button>
                                                    <button onClick={() => handleRoleChange(u.id, 'ADMIN')} disabled={u.role === 'ADMIN'} className={`w-6 h-6 flex items-center justify-center text-[10px] border ${u.role === 'ADMIN' ? 'bg-red-900 border-red-500 text-white' : 'bg-[#111] border-[#333] text-gray-500 hover:border-red-500'}`}>C</button>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => handleOpenEdit(u)}
                                                className="bg-[#111] border border-[#333] hover:border-blue-500 text-blue-500 hover:bg-blue-900/20 px-3 py-1 text-xs font-mono uppercase"
                                            >
                                                EDITAR
                                            </button>

                                            <button
                                                onClick={() => handleDeleteUser(u.id)}
                                                className="bg-[#111] border border-[#333] hover:border-red-500 text-red-500 hover:bg-red-900/20 px-3 py-1 text-xs font-mono uppercase"
                                            >
                                                EXCLUIR
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

                {/* Create Modal */}
                {isCreateModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
                        <div className="bg-[#0f0f0f] border-2 border-red-900 w-full max-w-md p-8 shadow-[0_0_50px_rgba(220,38,38,0.2)] animate-scale-in">
                            <h2 className="text-2xl font-black italic text-white uppercase border-b border-red-900/30 pb-4 mb-6">
                                Adicionar Novo Usuário
                            </h2>
                            <form onSubmit={handleCreateUser} className="space-y-4">
                                <div>
                                    <label className="text-xs font-mono text-gray-500 uppercase">Nome Completo (Patente)</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full bg-[#0a0a0a] border border-[#333] p-3 text-white focus:border-red-600 focus:outline-none uppercase font-bold"
                                        value={createFormData.name}
                                        onChange={e => setCreateFormData({ ...createFormData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-mono text-gray-500 uppercase">Email (Login)</label>
                                    <input
                                        required
                                        type="email"
                                        className="w-full bg-[#0a0a0a] border border-[#333] p-3 text-white focus:border-red-600 focus:outline-none font-mono"
                                        value={createFormData.email}
                                        onChange={e => setCreateFormData({ ...createFormData, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-mono text-gray-500 uppercase">Senha Provisória</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full bg-[#0a0a0a] border border-[#333] p-3 text-white focus:border-red-600 focus:outline-none font-mono tracking-widest"
                                        value={createFormData.password}
                                        onChange={e => setCreateFormData({ ...createFormData, password: e.target.value })}
                                        placeholder="Mínimo 6 caracteres"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-mono text-gray-500 uppercase">Nível de Acesso</label>
                                    <select
                                        className="w-full bg-[#0a0a0a] border border-[#333] p-3 text-white focus:border-red-600 focus:outline-none font-mono uppercase"
                                        value={createFormData.role}
                                        onChange={e => setCreateFormData({ ...createFormData, role: e.target.value as Role })}
                                    >
                                        <option value="STUDENT">ALUNO</option>
                                        <option value="INSTRUCTOR">INSTRUTOR</option>
                                        <option value="ADMIN">COMANDANTE (ADMIN)</option>
                                    </select>
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t border-[#333] mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setIsCreateModalOpen(false)}
                                        className="px-4 py-2 text-gray-500 hover:text-white font-mono uppercase text-sm"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="btn-gaming bg-red-700 hover:bg-red-600 border-red-500"
                                    >
                                        {processing ? '...' : 'Criar Conta'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Edit Modal */}
                {isEditModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
                        <div className="bg-[#0f0f0f] border-2 border-blue-900 w-full max-w-md p-8 shadow-[0_0_50px_rgba(30,58,138,0.2)] animate-scale-in">
                            <h2 className="text-2xl font-black italic text-white uppercase border-b border-blue-900/30 pb-4 mb-6">
                                Editar Usuário
                            </h2>
                            <form onSubmit={handleUpdateUser} className="space-y-4">
                                <div>
                                    <label className="text-xs font-mono text-gray-500 uppercase">Nome</label>
                                    <input
                                        type="text"
                                        className="w-full bg-[#0a0a0a] border border-[#333] p-3 text-white focus:border-blue-600 focus:outline-none uppercase font-bold"
                                        value={editFormData.name}
                                        onChange={e => setEditFormData({ ...editFormData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-mono text-gray-500 uppercase">Email</label>
                                    <input
                                        type="email"
                                        className="w-full bg-[#0a0a0a] border border-[#333] p-3 text-white focus:border-blue-600 focus:outline-none font-mono"
                                        value={editFormData.email}
                                        onChange={e => setEditFormData({ ...editFormData, email: e.target.value })}
                                    />
                                </div>
                                <div className="bg-yellow-900/10 border border-yellow-900/30 p-3">
                                    <label className="text-xs font-mono text-yellow-500 uppercase block mb-1">Redefinir Senha (Opcional)</label>
                                    <input
                                        type="text"
                                        className="w-full bg-[#0a0a0a] border border-[#333] p-2 text-white focus:border-yellow-600 focus:outline-none font-mono tracking-widest text-sm"
                                        value={editFormData.password}
                                        onChange={e => setEditFormData({ ...editFormData, password: e.target.value })}
                                        placeholder="Nova senha..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div className="border border-[#333] p-3 bg-[#0a0a0a]">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 accent-red-600"
                                                checked={editFormData.blocked}
                                                onChange={e => setEditFormData({ ...editFormData, blocked: e.target.checked })}
                                            />
                                            <span className={`text-xs font-bold uppercase ${editFormData.blocked ? 'text-red-500' : 'text-gray-400'}`}>
                                                {editFormData.blocked ? 'BLOQUEADO' : 'ATIVO'}
                                            </span>
                                        </label>
                                    </div>
                                    <div className="border border-[#333] p-3 bg-[#0a0a0a]">
                                        <label className="text-[10px] text-gray-500 uppercase block mb-1">Acesso Até (Opcional)</label>
                                        <input
                                            type="date"
                                            className="w-full bg-transparent text-white text-xs focus:outline-none font-mono"
                                            value={editFormData.accessUntil}
                                            onChange={e => setEditFormData({ ...editFormData, accessUntil: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t border-[#333] mt-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditModalOpen(false)}
                                        className="px-4 py-2 text-gray-500 hover:text-white font-mono uppercase text-sm"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="btn-gaming bg-blue-700 hover:bg-blue-600 border-blue-500"
                                    >
                                        {processing ? '...' : 'Salvar'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
