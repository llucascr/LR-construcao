import { Link, Outlet, useLocation } from 'react-router-dom';
import { Home, Users, Hammer, HardHat, UserCog, Menu, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from '../assets/Logo.PNG';

const MainLayout = () => {
    const location = useLocation();

    const navItems = [
        { path: '/', label: 'Dashboard', icon: Home },
        { path: '/clients', label: 'Clients', icon: Users },
        { path: '/drilling', label: 'Drilling Services', icon: Hammer },
        { path: '/builds', label: 'Build Services', icon: HardHat },

    ];

    const { logout, token } = useAuth();

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md hidden md:flex flex-col">
                <div className="p-6 border-b flex justify-center">
                    <img src={Logo} alt="LR Construções" className="h-12 object-contain" />
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? 'bg-red-50 text-red-600'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <Icon size={20} />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-4 border-t">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <UserCog size={20} className="text-gray-500" />
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-medium truncate">Admin User</p>
                                <p className="text-xs text-gray-500 truncate max-w-[120px]" title={token?.email}>
                                    {token?.email || 'admin@lr.com'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={logout}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Sair"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Mobile Header */}
                <header className="bg-white shadow-sm p-4 md:hidden flex items-center justify-between">
                    <img src={Logo} alt="LR Construções" className="h-8 object-contain" />
                    <button className="p-2 text-gray-600">
                        <Menu size={24} />
                    </button>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
