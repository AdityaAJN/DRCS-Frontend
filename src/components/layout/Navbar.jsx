import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, LogOut } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass-panel border-b border-slate-800/80 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <Link to="/" className="flex items-center space-x-3">
        <div className="p-2 bg-blue-600/20 rounded-xl border border-blue-500/30 text-blue-400">
          <ShieldAlert size={24} />
        </div>
        <div>
          <span className="font-bold text-lg text-white tracking-wide">DRCS</span>
          <span className="text-[10px] text-blue-400 font-medium block -mt-1">Disaster Coordination</span>
        </div>
      </Link>

      {user && (
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3 glass-card px-3 py-1.5 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-sm">
              {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-white">{user.fullName}</p>
              <p className="text-[10px] text-blue-400 font-semibold">{user.role}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
            title="Sign Out"
          >
            <LogOut size={20} />
          </button>
        </div>
      )}
    </nav>
  );
}