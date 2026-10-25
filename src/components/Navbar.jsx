import { Link, useLocation } from 'react-router-dom';
import { FiBarChart2, FiHome, FiBookOpen, FiCpu, FiCoffee } from 'react-icons/fi';

export default function Navbar() {
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Home', icon: FiHome },
    { to: '/dashboard', label: 'Dashboard', icon: FiBarChart2 },
    { to: '/guide', label: 'Guide', icon: FiBookOpen },
    { to: '/agent', label: 'EdgeAgent', icon: FiCpu },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 backdrop-blur-xs bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-8">
          {/* Zone 1: Brand Wordmark */}
          <Link to="/" className="flex items-center gap-2.5 whitespace-nowrap shrink-0 group">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-xs group-hover:bg-blue-700 transition-colors">
              E
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
              EdgeChart
            </span>
          </Link>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((item) => {
              const isActive = location.pathname === item.to;
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'text-blue-600 bg-blue-50/70 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Zone 3: Primary Action & Support */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="https://coff.ee/clueanalytq"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200/60 transition-colors whitespace-nowrap shrink-0"
              title="Support development"
            >
              <FiCoffee className="w-3.5 h-3.5 text-amber-600" />
              <span>Support</span>
            </a>

            {location.pathname !== '/dashboard' ? (
              <Link
                to="/dashboard"
                className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-2xs whitespace-nowrap shrink-0"
              >
                Open Dashboard
              </Link>
            ) : (
              <div className="text-xs text-slate-500 font-medium hidden sm:inline-block">
                Client Workspace
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
