import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { LogIn, Eye, EyeOff, BrainCircuit, ShieldCheck, TriangleAlert, Trophy, Github, Globe, Code } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Mock successful login for hackathon demo (Bypass API)
      setTimeout(() => {
        login(
          { id: 1, name: 'HR Manager', role: 'recruiter' },
          'mock_access_token'
        );
        navigate('/recruiter');
        setLoading(false);
      }, 600);
    } catch (err) {
      setError(err.message || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-gray-100 font-sans flex relative overflow-hidden">
      
      {/* LEFT SIDE: Branding & Product Narrative */}
      <div className="hidden lg:flex w-1/2 relative border-r border-gray-800 flex-col justify-between p-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#020617] to-[#020617]"></div>
        </div>
        
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3 mb-16 hover:opacity-80 transition-opacity w-fit">
            <BrainCircuit className="w-8 h-8 text-indigo-400" />
            <span className="text-xl font-bold text-white tracking-tight">TalentForge AI</span>
          </Link>
          
          <h2 className="text-4xl font-bold text-white mb-8 leading-tight tracking-tight">Evidence-Based<br/>Hiring Intelligence</h2>
          
          <ul className="space-y-6 text-gray-300 text-lg mb-16">
            <li className="flex items-center gap-4"><ShieldCheck className="w-6 h-6 text-emerald-400"/> Verify technical claims.</li>
            <li className="flex items-center gap-4"><TriangleAlert className="w-6 h-6 text-amber-400"/> Detect hiring fraud.</li>
            <li className="flex items-center gap-4"><Trophy className="w-6 h-6 text-indigo-400"/> Hire with confidence.</li>
          </ul>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-8 pt-12 border-t border-gray-800/50">
          <div>
            <div className="text-4xl font-black text-white mb-2 tracking-tight">94%</div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest leading-relaxed">Average Trust<br/>Confidence</div>
          </div>
          <div>
            <div className="text-4xl font-black text-white mb-2 tracking-tight">50+</div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest leading-relaxed">Talent<br/>Sources</div>
          </div>
          <div className="col-span-2">
            <div className="text-4xl font-black text-white mb-2 tracking-tight">5</div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest leading-relaxed">Verification Engines</div>
          </div>
        </div>

        {/* Abstract Neural Net Background */}
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] opacity-30 pointer-events-none">
          <svg viewBox="0 0 200 200" className="w-full h-full animate-[spin_60s_linear_infinite]">
            <circle cx="100" cy="100" r="40" fill="none" stroke="#818cf8" strokeWidth="0.5"/>
            <circle cx="100" cy="100" r="80" fill="none" stroke="#6366f1" strokeWidth="0.5" strokeDasharray="4 4"/>
            <path d="M100,60 L140,20 M100,140 L160,180 M60,100 L20,60 M140,100 L180,60 M60,140 L20,180" stroke="#a855f7" strokeWidth="0.5"/>
            <circle cx="100" cy="100" r="6" fill="#818cf8"/>
            <circle cx="140" cy="20" r="3" fill="#a855f7"/>
            <circle cx="160" cy="180" r="3" fill="#6366f1"/>
            <circle cx="20" cy="60" r="3" fill="#34d399"/>
            <circle cx="180" cy="60" r="3" fill="#fbbf24"/>
            <circle cx="20" cy="180" r="3" fill="#60a5fa"/>
            <circle cx="100" cy="60" r="2" fill="#fff"/>
            <circle cx="100" cy="140" r="2" fill="#fff"/>
            <circle cx="60" cy="100" r="2" fill="#fff"/>
            <circle cx="140" cy="100" r="2" fill="#fff"/>
          </svg>
        </div>
      </div>

      {/* RIGHT SIDE: Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#020617] relative z-10">
        <div className="w-full max-w-[400px]">
          
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Welcome Back</h2>
            <p className="text-gray-400 text-sm">Sign in to your recruiter workspace</p>
          </div>

          {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg px-4 py-3 text-[13px] mb-6 text-center font-medium">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
                <input 
                  id="login-email" 
                  type="email" 
                  className="w-full bg-black/40 border border-gray-800 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#6366F1]/50 focus:ring-1 focus:ring-[#6366F1]/50 transition-all placeholder:text-gray-600 text-sm" 
                  placeholder="you@enterprise.com" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  required 
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest">Password</label>
                  <a href="#" className="text-[11px] font-bold text-[#8B5CF6] hover:text-[#A78BFA] transition-colors uppercase tracking-widest">Forgot?</a>
                </div>
                <div className="relative">
                  <input 
                    id="login-password" 
                    type={showPw ? 'text' : 'password'} 
                    className="w-full bg-black/40 border border-gray-800 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#6366F1]/50 focus:ring-1 focus:ring-[#6366F1]/50 transition-all placeholder:text-gray-600 text-sm pr-10" 
                    placeholder="••••••••" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    required 
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <input type="checkbox" id="remember" className="w-4 h-4 rounded bg-black/40 border-gray-800 text-[#6366F1] focus:ring-[#6366F1]/50 focus:ring-offset-0" />
              <label htmlFor="remember" className="text-sm text-gray-400">Remember me for 30 days</label>
            </div>
            
            <button id="login-submit" type="submit" disabled={loading} className="w-full bg-[#6366F1] hover:bg-[#8B5CF6] text-white py-3.5 rounded-xl text-sm font-bold transition-all shadow-[0_0_20px_rgba(99,102,241,0.2)] flex items-center justify-center gap-2 mt-6">
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Sign In'}
            </button>
          </form>

          <div className="flex items-center my-8">
            <div className="flex-1 border-t border-gray-800"></div>
            <span className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Or continue with</span>
            <div className="flex-1 border-t border-gray-800"></div>
          </div>

          <div className="space-y-3">
            <button className="w-full flex items-center justify-center gap-3 bg-transparent border border-gray-800 hover:bg-white/5 text-white py-3 rounded-xl transition-colors text-sm font-medium">
              <Github className="w-4 h-4" /> Continue with GitHub
            </button>
            <button className="w-full flex items-center justify-center gap-3 bg-transparent border border-gray-800 hover:bg-white/5 text-white py-3 rounded-xl transition-colors text-sm font-medium">
              <Globe className="w-4 h-4" /> Continue with Google
            </button>
            <button className="w-full flex items-center justify-center gap-3 bg-transparent border border-gray-800 hover:bg-white/5 text-white py-3 rounded-xl transition-colors text-sm font-medium">
              <Code className="w-4 h-4" /> Continue with Microsoft
            </button>
          </div>

          <p className="text-center text-gray-500 text-sm mt-10">
            Need an enterprise account? <Link to="/register" className="text-[#8B5CF6] hover:text-[#A78BFA] font-medium transition-colors">Contact Sales</Link>
          </p>

        </div>
      </div>
    </div>
  );
}
