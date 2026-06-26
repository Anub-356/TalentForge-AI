import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Brain, Search, ChevronRight } from 'lucide-react';
import { useAuth } from '../AuthContext';
import candidateData from '../data/ranked_candidates.json';

export default function RecruiterLayout({ children }) {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);

  const navItems = [
    { name: 'Dashboard', path: '/recruiter' },
    { name: 'Rankings', path: '/recruiter/rankings' },
    { name: 'Jobs', path: '/recruiter/jobs' },
    { name: 'Analytics', path: '/recruiter/analytics' },
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (value) => {
    setSearchTerm(value);
    if (!value.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    const q = value.toLowerCase();
    const matches = candidateData.candidates.filter(c =>
      c.id.toLowerCase().includes(q) ||
      c.tier.toLowerCase().includes(q) ||
      (c.trustStatus && c.trustStatus.toLowerCase().includes(q))
    ).slice(0, 6);

    setSearchResults(matches);
    setShowDropdown(matches.length > 0);

    // If exactly 1 result, still show dropdown but let user confirm
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (searchResults.length === 1) {
        navigate(`/candidate/${searchResults[0].id}`);
        setShowDropdown(false);
        setSearchTerm('');
      }
    }
    if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  };

  const handleResultClick = (id) => {
    navigate(`/candidate/${id}`);
    setShowDropdown(false);
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen bg-[#020617] text-gray-100 font-sans selection:bg-[#6366F1]/30 flex flex-col">

      {/* Floating Pill Navbar — exact clone of Landing Navbar */}
      <div className="fixed top-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
        <nav className="pointer-events-auto w-[92%] max-w-[1500px] h-[64px] rounded-full flex items-center px-6 relative transition-all"
             style={{
               background: 'rgba(255,255,255,0.03)',
               backdropFilter: 'blur(32px)',
               WebkitBackdropFilter: 'blur(32px)',
               border: '1px solid rgba(255,255,255,0.05)',
               boxShadow: '0 0 40px rgba(99,102,241,0.1), 0 10px 50px rgba(0,0,0,0.5)'
             }}>

          {/* Logo */}
          <div className="flex-1">
            <Link to="/recruiter" className="flex items-center gap-2 group w-max">
              <Brain className="w-5 h-5 text-white group-hover:text-[#8B5CF6] transition-colors" />
              <span className="font-bold tracking-tight text-white hidden sm:block">TalentForge AI</span>
            </Link>
          </div>

          {/* Centered Nav Links */}
          <div className="hidden lg:flex items-center gap-[32px] text-sm absolute left-1/2 -translate-x-1/2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path !== '/recruiter' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`relative px-5 py-2 rounded-full transition-all duration-300 font-bold text-[13px] tracking-wide flex items-center justify-center ${
                    isActive
                      ? 'text-white bg-white/[0.08] shadow-[0_0_20px_rgba(139,92,246,0.2)] border border-white/[0.1]'
                      : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Right: Smart Search + Logout */}
          <div className="flex-1 flex justify-end items-center gap-4">

            {/* Smart Search */}
            <div className="relative" ref={searchRef}>
              <div className="hidden lg:flex items-center bg-[#6366F1]/5 border border-white/10 rounded-full px-4 py-1.5 focus-within:border-[#6366F1]/50 focus-within:bg-[#6366F1]/10 transition-all w-52">
                <Search className="w-3.5 h-3.5 text-gray-500 mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Search candidates..."
                  className="bg-transparent border-none outline-none text-sm text-white placeholder-gray-500 w-full"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                />
              </div>

              {/* Dropdown Results */}
              {showDropdown && (
                <div className="absolute top-full right-0 mt-2 w-72 bg-[#0f172a]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.7)] overflow-hidden z-[100]">
                  <div className="px-4 py-2 border-b border-gray-800">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                      {searchResults.length} Result{searchResults.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  {searchResults.map((cand) => {
                    const isElite = cand.tier === 'Elite Match';
                    const initials = cand.id.substring(5, 7).toUpperCase();
                    return (
                      <button
                        key={cand.id}
                        onClick={() => handleResultClick(cand.id)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
                      >
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-[10px] shrink-0 ${isElite ? 'bg-gradient-to-br from-[#6366F1] to-[#8B5CF6]' : 'bg-gradient-to-br from-orange-500 to-red-500'}`}>
                          {initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-white">{cand.id}</div>
                          <div className="text-[10px] text-gray-500">{cand.tier} • {cand.confidenceScore}% confidence</div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-600 shrink-0" />
                      </button>
                    );
                  })}
                  {searchResults.length === 1 && (
                    <div className="px-4 py-2 border-t border-gray-800 bg-[#6366F1]/5">
                      <span className="text-[10px] text-[#8B5CF6] font-bold">Press Enter to open</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button onClick={logout} className="text-gray-400 hover:text-white transition-all duration-200 hover:drop-shadow-[0_0_8px_rgba(139,92,246,0.5)] flex items-center gap-1.5">
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium hidden sm:block">Sign Out</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content Area — offset for floating nav */}
      <main className="flex-1 overflow-y-auto bg-[#020617] pt-28 px-6 lg:px-10 pb-12 relative flex justify-center">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#6366F1]/5 to-transparent pointer-events-none -z-10" />
        <div className="w-full max-w-[1400px]">
          {children}
        </div>
      </main>
    </div>
  );
}
