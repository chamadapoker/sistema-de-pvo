import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

export function Navbar() {
    const { user, clearAuth } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        clearAuth();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <h1 className="text-2xl font-bold text-primary-600">PVO Modern</h1>
                        <span className="ml-4 text-sm text-gray-500">
                            Sistema de Reconhecimento Visual
                        </span>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                            <p className="text-xs text-gray-500">
                                {user?.role === 'STUDENT' && 'Aluno'}
                                {user?.role === 'INSTRUCTOR' && 'Instrutor'}
                                {user?.role === 'ADMIN' && 'Administrador'}
                            </p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="btn btn-secondary text-sm"
                        >
                            Sair
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
