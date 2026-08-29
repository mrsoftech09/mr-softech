import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Server, ScrollText, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import CinematicBackground from '../components/CinematicBackground';

const links = [
  ['/dashboard', 'Dashboard', LayoutDashboard],
  ['/clients', 'Clients', Server],
  ['/audit-logs', 'Audit logs', ScrollText]
];

export default function AppLayout() {
  const { user, logout } = useAuth(),
        [open, setOpen] = useState(false),
        nav = useNavigate();

  const signout = async () => {
    await logout();
    nav('/login');
  };

  return (
    <div className="relative min-h-screen md:flex">
      <CinematicBackground />
      <aside
        className={`${
          open ? 'block' : 'hidden'
        } md:block fixed md:sticky top-0 z-20 h-screen w-64 border-r border-white/10 bg-[#070b13]/75 p-5 backdrop-blur-xl`}
      >
        <button
          className="md:hidden absolute right-4"
          onClick={() => setOpen(false)}
        >
          <X />
        </button>
        <div className="flex items-center gap-2">
          <img
            src="/mr-cloud-logo.png"
            alt="MR CLOUD"
            className="h-10 w-10 rounded-lg object-cover"
          />
          <div>
            <p className="text-sm font-black tracking-wide text-cyan">MR CLOUD</p>
            <p className="text-[9px] text-slate-400">A Unit of MR SOFTECH</p>
          </div>
        </div>
        <p className="mt-1 text-xs text-slate-500">INFRASTRUCTURE OPS</p>
        <nav className="mt-10 space-y-2">
          {links.map(([to, label, Icon]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg p-3 ${
                  isActive
                    ? 'bg-cyan text-ink'
                    : 'text-slate-300 hover:bg-white/10'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="absolute bottom-5">
          <p className="text-xs text-slate-500">{user?.email}</p>
          <button
            onClick={signout}
            className="mt-3 flex items-center gap-2 text-sm text-slate-300"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>
      <main className="min-w-0 flex-1">
        <header className="md:hidden p-4">
          <button onClick={() => setOpen(true)} aria-label="Open navigation">
            <Menu />
          </button>
        </header>
        <div className="mx-auto max-w-7xl p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}