import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { BrainCircuit, ShieldCheck, TriangleAlert, Trophy, ArrowRight, CheckCircle2, ChevronLeft, Loader2 } from 'lucide-react';

export default function Register() {
  const [step, setStep] = useState(1);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Form State
  const [form, setForm] = useState({
    companyName: '',
    companySize: '1-50',
    industry: 'Technology',
    hiringVolume: '1-10',
    name: '',
    email: '',
    role: 'Technical Recruiter',
    goals: {
      'Software Engineers': true,
      'Data Scientists': false,
      'AI Engineers': false,
      'DevOps Engineers': false,
      'Product Engineers': false,
    }
  });

  const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }));
  const toggleGoal = (goal) => {
    setForm(prev => ({
      ...prev,
      goals: { ...prev.goals, [goal]: !prev.goals[goal] }
    }));
  };

  // Step 4 Animation State
  const [loadingStep, setLoadingStep] = useState(0);

  useEffect(() => {
    if (step === 4) {
      const timers = [
        setTimeout(() => setLoadingStep(1), 800),
        setTimeout(() => setLoadingStep(2), 1600),
        setTimeout(() => setLoadingStep(3), 2400),
        setTimeout(() => setLoadingStep(4), 3200),
      ];
      return () => timers.forEach(clearTimeout);
    }
  }, [step]);

  const handleLaunch = () => {
    // Mock login and redirect to recruiter dashboard
    login({ id: 2, name: form.name, role: 'recruiter', company: form.companyName }, 'mock_access_token');
    navigate('/recruiter');
  };

  return (
    <div className="min-h-screen bg-[#020617] text-gray-100 font-sans flex relative overflow-hidden">
      
      {/* LEFT SIDE: Branding */}
      <div className="hidden lg:flex w-1/3 xl:w-[40%] relative border-r border-gray-800 flex-col justify-between p-12 overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#020617] to-black"></div>
        </div>
        
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3 mb-16 hover:opacity-80 transition-opacity w-fit">
            <BrainCircuit className="w-8 h-8 text-indigo-400" />
            <span className="text-xl font-bold text-white tracking-tight">TalentForge AI</span>
          </Link>
          
          <h2 className="text-3xl font-bold text-white mb-6 leading-tight tracking-tight">Evidence-Based<br/>Hiring Intelligence</h2>
          <p className="text-gray-400 text-sm leading-relaxed max-w-sm mb-12">
            Setup your enterprise workspace. Connect talent sources, activate trust engines, and start verifying engineering claims automatically.
          </p>

          <div className="space-y-6">
            <div className={`flex items-center gap-4 transition-all duration-500 ${step >= 1 ? 'opacity-100' : 'opacity-40'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border ${step >= 1 ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400' : 'border-gray-800 text-gray-600'}`}>1</div>
              <span className={`font-medium ${step >= 1 ? 'text-white' : 'text-gray-600'}`}>Organization</span>
            </div>
            <div className={`flex items-center gap-4 transition-all duration-500 ${step >= 2 ? 'opacity-100' : 'opacity-40'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border ${step >= 2 ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400' : 'border-gray-800 text-gray-600'}`}>2</div>
              <span className={`font-medium ${step >= 2 ? 'text-white' : 'text-gray-600'}`}>Recruiting Team</span>
            </div>
            <div className={`flex items-center gap-4 transition-all duration-500 ${step >= 3 ? 'opacity-100' : 'opacity-40'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border ${step >= 3 ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400' : 'border-gray-800 text-gray-600'}`}>3</div>
              <span className={`font-medium ${step >= 3 ? 'text-white' : 'text-gray-600'}`}>Hiring Goals</span>
            </div>
            <div className={`flex items-center gap-4 transition-all duration-500 ${step >= 4 ? 'opacity-100' : 'opacity-40'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border ${step >= 4 ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400' : 'border-gray-800 text-gray-600'}`}>4</div>
              <span className={`font-medium ${step >= 4 ? 'text-white' : 'text-gray-600'}`}>Launch Workspace</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Multi-step Form */}
      <div className="w-full lg:w-2/3 xl:w-[60%] flex flex-col pt-12 pb-12 px-8 lg:px-24 bg-[#020617] relative z-10 overflow-y-auto">
        
        {step < 4 && (
          <div className="flex justify-between items-center mb-16 max-w-xl w-full">
            <button 
              onClick={() => step > 1 ? setStep(step - 1) : navigate('/login')} 
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300 transition-colors font-medium"
            >
              <ChevronLeft className="w-4 h-4" /> {step > 1 ? 'Back' : 'Back to Login'}
            </button>
            <div className="text-xs font-bold text-gray-600 uppercase tracking-widest">Step {step} of 3</div>
          </div>
        )}

        <div className="w-full max-w-xl">
          
          {/* STEP 1: ORGANIZATION INFO */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Organization Information</h2>
              <p className="text-gray-400 text-sm mb-10">Tell us about your company to customize the trust engine.</p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Company Name</label>
                  <input 
                    type="text" 
                    className="w-full bg-black/40 border border-gray-800 text-white px-4 py-3.5 rounded-xl focus:outline-none focus:border-[#6366F1]/50 focus:ring-1 focus:ring-[#6366F1]/50 transition-all placeholder:text-gray-600 text-sm" 
                    placeholder="Acme Corp" 
                    value={form.companyName} 
                    onChange={e => update('companyName', e.target.value)} 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Company Size</label>
                    <select 
                      className="w-full bg-black/40 border border-gray-800 text-white px-4 py-3.5 rounded-xl focus:outline-none focus:border-[#6366F1]/50 focus:ring-1 focus:ring-[#6366F1]/50 transition-all text-sm appearance-none"
                      value={form.companySize}
                      onChange={e => update('companySize', e.target.value)}
                    >
                      <option value="1-50">1-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201-1000">201-1000 employees</option>
                      <option value="1000+">1000+ employees</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Hiring Volume (Yearly)</label>
                    <select 
                      className="w-full bg-black/40 border border-gray-800 text-white px-4 py-3.5 rounded-xl focus:outline-none focus:border-[#6366F1]/50 focus:ring-1 focus:ring-[#6366F1]/50 transition-all text-sm appearance-none"
                      value={form.hiringVolume}
                      onChange={e => update('hiringVolume', e.target.value)}
                    >
                      <option value="1-10">1-10 hires</option>
                      <option value="11-50">11-50 hires</option>
                      <option value="51-200">51-200 hires</option>
                      <option value="200+">200+ hires</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Industry</label>
                  <input 
                    type="text" 
                    className="w-full bg-black/40 border border-gray-800 text-white px-4 py-3.5 rounded-xl focus:outline-none focus:border-[#6366F1]/50 focus:ring-1 focus:ring-[#6366F1]/50 transition-all placeholder:text-gray-600 text-sm" 
                    placeholder="e.g. Technology, Finance, Healthcare" 
                    value={form.industry} 
                    onChange={e => update('industry', e.target.value)} 
                  />
                </div>

                <button 
                  onClick={() => setStep(2)}
                  disabled={!form.companyName}
                  className="w-full bg-[#6366F1] hover:bg-[#8B5CF6] disabled:bg-gray-800 disabled:text-gray-500 text-white py-4 rounded-xl text-sm font-bold transition-all shadow-[0_0_20px_rgba(99,102,241,0.2)] disabled:shadow-none flex items-center justify-center gap-2 mt-8"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: RECRUITING TEAM */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
              <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Recruiting Team</h2>
              <p className="text-gray-400 text-sm mb-10">Set up your admin profile for the workspace.</p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Your Name</label>
                  <input 
                    type="text" 
                    className="w-full bg-black/40 border border-gray-800 text-white px-4 py-3.5 rounded-xl focus:outline-none focus:border-[#6366F1]/50 focus:ring-1 focus:ring-[#6366F1]/50 transition-all placeholder:text-gray-600 text-sm" 
                    placeholder="Jane Doe" 
                    value={form.name} 
                    onChange={e => update('name', e.target.value)} 
                  />
                </div>
                
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Work Email</label>
                  <input 
                    type="email" 
                    className="w-full bg-black/40 border border-gray-800 text-white px-4 py-3.5 rounded-xl focus:outline-none focus:border-[#6366F1]/50 focus:ring-1 focus:ring-[#6366F1]/50 transition-all placeholder:text-gray-600 text-sm" 
                    placeholder="jane@acmecorp.com" 
                    value={form.email} 
                    onChange={e => update('email', e.target.value)} 
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Role</label>
                  <input 
                    type="text" 
                    className="w-full bg-black/40 border border-gray-800 text-white px-4 py-3.5 rounded-xl focus:outline-none focus:border-[#6366F1]/50 focus:ring-1 focus:ring-[#6366F1]/50 transition-all placeholder:text-gray-600 text-sm" 
                    placeholder="e.g. Technical Recruiter, VP of Engineering" 
                    value={form.role} 
                    onChange={e => update('role', e.target.value)} 
                  />
                </div>

                <button 
                  onClick={() => setStep(3)}
                  disabled={!form.name || !form.email}
                  className="w-full bg-[#6366F1] hover:bg-[#8B5CF6] disabled:bg-gray-800 disabled:text-gray-500 text-white py-4 rounded-xl text-sm font-bold transition-all shadow-[0_0_20px_rgba(99,102,241,0.2)] disabled:shadow-none flex items-center justify-center gap-2 mt-8"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: HIRING GOALS */}
          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
              <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Hiring Goals</h2>
              <p className="text-gray-400 text-sm mb-10">Select the types of engineering roles you actively hire for.</p>
              
              <div className="space-y-3">
                {Object.keys(form.goals).map(goal => (
                  <label 
                    key={goal} 
                    className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${form.goals[goal] ? 'bg-indigo-500/10 border-indigo-500/50' : 'bg-black/40 border-gray-800 hover:border-gray-700'}`}
                  >
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${form.goals[goal] ? 'bg-indigo-500 border-indigo-500' : 'border-gray-600'}`}>
                      {form.goals[goal] && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <span className={`text-sm font-medium ${form.goals[goal] ? 'text-white' : 'text-gray-300'}`}>{goal}</span>
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={form.goals[goal]} 
                      onChange={() => toggleGoal(goal)} 
                    />
                  </label>
                ))}

                <button 
                  onClick={() => setStep(4)}
                  className="w-full bg-[#6366F1] hover:bg-[#8B5CF6] text-white py-4 rounded-xl text-sm font-bold transition-all shadow-[0_0_20px_rgba(99,102,241,0.2)] flex items-center justify-center gap-2 mt-8"
                >
                  Create Workspace <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: LAUNCH WORKSPACE (ANIMATED) */}
          {step === 4 && (
            <div className="animate-in fade-in zoom-in-95 duration-700 flex flex-col items-center justify-center text-center mt-20">
              
              <div className="relative w-24 h-24 mb-10 flex items-center justify-center">
                <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
                {loadingStep < 4 ? (
                  <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <div className="absolute inset-0 bg-indigo-500 rounded-full flex items-center justify-center animate-in zoom-in">
                    <CheckCircle2 className="w-10 h-10 text-white" />
                  </div>
                )}
                <BrainCircuit className={`w-8 h-8 text-indigo-400 ${loadingStep < 4 ? 'animate-pulse' : 'text-white'}`} />
              </div>

              <h2 className="text-3xl font-bold text-white tracking-tight mb-8">
                {loadingStep < 4 ? 'Initializing Trust Engine...' : 'Workspace Ready'}
              </h2>

              <div className="w-full max-w-sm space-y-4 text-left mx-auto mb-12">
                <div className={`flex items-center gap-4 transition-all duration-500 ${loadingStep >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  {loadingStep >= 1 ? <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> : <Loader2 className="w-5 h-5 text-gray-500 shrink-0 animate-spin" />}
                  <span className="text-sm font-medium text-gray-300">Talent Sources Connected</span>
                </div>
                <div className={`flex items-center gap-4 transition-all duration-500 ${loadingStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  {loadingStep >= 2 ? <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> : <Loader2 className="w-5 h-5 text-gray-500 shrink-0 animate-spin" />}
                  <span className="text-sm font-medium text-gray-300">Trust Engine Ready</span>
                </div>
                <div className={`flex items-center gap-4 transition-all duration-500 ${loadingStep >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  {loadingStep >= 3 ? <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> : <Loader2 className="w-5 h-5 text-gray-500 shrink-0 animate-spin" />}
                  <span className="text-sm font-medium text-gray-300">Verification Pipeline Active</span>
                </div>
                <div className={`flex items-center gap-4 transition-all duration-500 ${loadingStep >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  {loadingStep >= 4 ? <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> : <div className="w-5 h-5" />}
                  <span className="text-sm font-medium text-gray-300">Recruiter Workspace Generated</span>
                </div>
              </div>

              {loadingStep >= 4 && (
                <button 
                  onClick={handleLaunch}
                  className="bg-white hover:bg-gray-100 text-[#020617] py-4 px-8 rounded-xl text-sm font-bold transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] animate-in slide-in-from-bottom-4 flex items-center justify-center gap-2"
                >
                  Launch TalentForge <ArrowRight className="w-4 h-4" />
                </button>
              )}

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
