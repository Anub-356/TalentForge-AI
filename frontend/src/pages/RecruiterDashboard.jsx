import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Database, Shield, Sparkles, TrendingUp, Plus, ChevronRight, CheckCircle, Briefcase, Activity } from 'lucide-react';
import { useAuth } from '../AuthContext';
import candidateData from '../data/ranked_candidates.json';
import api from '../api';

const FadeUp = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.2, delay, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

export default function RecruiterDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get('/recruiters/jobs');
        setJobs(res.data);
      } catch (err) {
        console.error("Failed to fetch jobs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);
  
  const rankedTotal = candidateData.candidates.length;
  const eliteMatches = candidateData.candidates.filter(c => c.tier === 'Elite Match').length;

  // Sample pre-seeded demo requisition when database is fresh
  const sampleDemoJob = {
    id: "DEMO_REQ_AI_01",
    title: "Staff Machine Learning Engineer (Search & RAG)",
    company: "TalentForge Core AI",
    required_skills: ["Retrieval", "Ranking", "Pinecone", "Python", "System Design"],
    isDemo: true
  };

  const displayJobs = jobs.length > 0 ? jobs : [sampleDemoJob];

  return (
    <div className="pb-12">
      {/* Top Header Section */}
      <FadeUp delay={0.0}>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6366F1]/10 border border-[#6366F1]/20 text-[#8B5CF6] text-[10px] font-bold mb-3 tracking-wider uppercase">
              <Activity className="w-3 h-3 animate-pulse" /> EVIDENCE-BASED HIRING INTELLIGENCE - PRODUCTION v3.2
            </div>
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Talent Verification Command Center</h1>
            <p className="text-gray-400 text-lg">Autonomous claim verification, fraud detection, and trust aggregation for engineering requisitions.</p>
          </div>
          <Link to="/recruiter/jobs/create" className="bg-gradient-to-b from-[#6366F1] to-[#4F46E5] hover:from-[#8B5CF6] hover:to-[#6366F1] text-white px-8 py-3.5 rounded-2xl font-bold transition-all shadow-[0_0_30px_rgba(99,102,241,0.3)] flex items-center gap-2 w-fit border border-[#8B5CF6]/50">
            <Plus className="w-5 h-5" /> Open Requisition
          </Link>
        </div>
      </FadeUp>

      {/* KPI Row (Enterprise Glass) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        <FadeUp delay={0.1}>
          <div className="bg-gradient-to-b from-white/[0.08] to-white/[0.03] backdrop-blur-[24px] border border-white/[0.10] rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:border-blue-500/30 transition-all group relative overflow-hidden">
            <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span> Demo Network Talent Pool
              </h3>
              <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Database className="w-5 h-5" />
              </div>
            </div>
            <div className="text-6xl font-mono font-bold text-white mb-2">100K</div>
            <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">Illustrative engineering profiles</div>
          </div>
        </FadeUp>
        <FadeUp delay={0.15}>
          <div className="bg-gradient-to-b from-white/[0.08] to-white/[0.03] backdrop-blur-[24px] border border-white/[0.10] rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:border-[#6366F1]/30 transition-all group relative overflow-hidden">
            <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span> Demo Verified Shortlist
              </h3>
              <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="text-6xl font-mono font-bold text-white mb-2">{rankedTotal}</div>
            <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">Demo shortlist</div>
          </div>
        </FadeUp>
        <FadeUp delay={0.2}>
          <div className="bg-gradient-to-b from-white/[0.08] to-white/[0.03] backdrop-blur-[24px] border border-white/[0.10] rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:border-[#8B5CF6]/30 transition-all group relative overflow-hidden">
            <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></span> Demo High-Trust Matches
              </h3>
              <div className="w-10 h-10 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
            <div className="text-6xl font-mono font-bold text-[#8B5CF6] mb-2">{eliteMatches}</div>
            <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">&gt;85% Trust - Zero Fraud Flags</div>
          </div>
        </FadeUp>
        <FadeUp delay={0.25}>
          <div className="bg-gradient-to-b from-white/[0.08] to-white/[0.03] backdrop-blur-[24px] border border-white/[0.10] rounded-3xl p-8 shadow-[0_0_30px_rgba(34,197,94,0.1)] hover:border-green-500/40 transition-all group relative overflow-hidden">
            <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-bold text-green-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span> Demo Fraud Risks Intercepted
              </h3>
              <div className="w-10 h-10 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
                <Shield className="w-5 h-5" />
              </div>
            </div>
            <div className="text-6xl font-mono font-bold text-green-400 mb-2">6,073</div>
            <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">Illustrative resume inflation and stuffing blocked</div>
          </div>
        </FadeUp>
      </div>

      {/* Autonomous Verification Funnel */}
      <FadeUp delay={0.28}>
        <div className="bg-gradient-to-b from-white/[0.08] to-white/[0.03] backdrop-blur-[24px] border border-white/[0.10] rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.12)] mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white tracking-tight">Autonomous Verification Funnel</h2>
            <div className="bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5" /> Real-Time Engine Throughput
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-2 items-center justify-between overflow-x-auto pb-4">
            <div className="flex flex-col items-center flex-1 min-w-[100px]">
              <div className="text-center p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] w-full">
                <div className="text-2xl font-mono font-bold text-white">100,000</div>
                <div className="text-[10px] font-bold text-gray-400 uppercase mt-2 tracking-widest">Profiles Screened</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-600 hidden md:block shrink-0" />
            <div className="flex flex-col items-center flex-1 min-w-[100px]">
              <div className="text-center p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] w-full">
                <div className="text-2xl font-mono font-bold text-blue-400">18,400</div>
                <div className="text-[10px] font-bold text-gray-400 uppercase mt-2 tracking-widest">Semantic Fit (&gt;65%)</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-600 hidden md:block shrink-0" />
            <div className="flex flex-col items-center flex-1 min-w-[100px]">
              <div className="text-center p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] w-full">
                <div className="text-2xl font-mono font-bold text-indigo-400">7,200</div>
                <div className="text-[10px] font-bold text-gray-400 uppercase mt-2 tracking-widest">Code Verified</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-600 hidden md:block shrink-0" />
            <div className="flex flex-col items-center flex-1 min-w-[100px]">
              <div className="text-center p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] w-full">
                <div className="text-2xl font-mono font-bold text-purple-400">4,300</div>
                <div className="text-[10px] font-bold text-gray-400 uppercase mt-2 tracking-widest">Timeline Audited</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-600 hidden md:block shrink-0" />
            <div className="flex flex-col items-center flex-1 min-w-[100px]">
              <div className="text-center p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] w-full">
                <div className="text-2xl font-mono font-bold text-pink-400">2,100</div>
                <div className="text-[10px] font-bold text-gray-400 uppercase mt-2 tracking-widest">GitHub Deep-Checked</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-600 hidden md:block shrink-0" />
            <div className="flex flex-col items-center flex-1 min-w-[100px]">
              <div className="text-center p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] w-full">
                <div className="text-2xl font-mono font-bold text-green-400">1,850</div>
                <div className="text-[10px] font-bold text-gray-400 uppercase mt-2 tracking-widest">Honeypot &amp; Fraud Clear</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-600 hidden md:block shrink-0" />
            <div className="flex flex-col items-center flex-1 min-w-[100px]">
              <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] shadow-[0_0_20px_rgba(99,102,241,0.4)] w-full">
                <div className="text-2xl font-mono font-bold text-white">100</div>
                <div className="text-[10px] font-bold text-white uppercase mt-2 tracking-widest">Final Trust Ledger</div>
              </div>
            </div>
          </div>
        </div>
      </FadeUp>

      {/* Active Requisitions Section */}
      <FadeUp delay={0.3}>
        <div className="mb-6 flex justify-between items-end border-b border-white/[0.10] pb-4">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Active Requisitions &amp; Intelligence Ledgers</h2>
            <p className="text-sm text-gray-400 mt-1">Select an active engineering role to inspect verified candidate evidence ledgers.</p>
          </div>
          <Link to="/recruiter/jobs" className="text-sm font-bold text-[#6366F1] hover:text-[#8B5CF6] transition-colors flex items-center gap-1">
            View All Requisitions <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </FadeUp>

      <div className="space-y-5">
        {loading ? (
          <div className="text-gray-400 text-center py-12">Synchronizing with intelligence network...</div>
        ) : (
          displayJobs.map((job, index) => (
            <FadeUp delay={0.35 + (index * 0.05)} key={job.id}>
              <div className="bg-gradient-to-b from-white/[0.08] to-white/[0.03] backdrop-blur-[24px] border border-white/[0.10] rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:border-[#6366F1]/50 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer" onClick={() => window.location.href = job.isDemo ? '/recruiter/rankings' : `/recruiter/jobs/${job.id}/applications`}>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-2xl text-white">{job.title}</h3>
                    {job.isDemo && (
                      <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">Benchmark Req</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 font-medium">{job.company || "Enterprise"} • Active Talent Pool</p>
                  <div className="flex gap-2 mt-4">
                    <span className="text-[10px] text-green-400 font-bold uppercase tracking-widest bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-lg flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span> Continuous Audit Active</span>
                    {job.required_skills && job.required_skills.slice(0,4).map(skill => (
                      <span key={skill} className="text-[10px] text-gray-300 font-bold uppercase tracking-widest bg-white/[0.05] border border-white/[0.10] px-3 py-1.5 rounded-lg">{skill}</span>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center gap-8">
                  <div className="text-right hidden sm:block">
                    <div className="text-[10px] text-[#6366F1] uppercase tracking-widest font-bold mb-1">Audit Queue</div>
                    <div className="text-sm font-medium text-gray-300">100-item demo shortlist</div>
                  </div>
                  <Link to={job.isDemo ? '/recruiter/rankings' : `/recruiter/jobs/${job.id}/applications`} className="bg-white/[0.05] border border-white/[0.10] hover:bg-[#6366F1] hover:border-[#6366F1] text-white px-6 py-3 rounded-xl font-bold transition-all text-sm flex items-center gap-2">
                    Inspect Ledger <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </FadeUp>
          ))
        )}
      </div>
    </div>
  );
}
