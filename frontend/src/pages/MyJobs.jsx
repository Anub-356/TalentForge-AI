import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Briefcase, ChevronRight, Plus, Search } from 'lucide-react';

const FadeUp = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.2, delay, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

export default function MyJobs() {
  return (
    <div className="pb-12">
      <FadeUp delay={0.0}>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b border-gray-800 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">My Jobs</h1>
            <p className="text-gray-400 text-lg">Manage all active and past hiring pipelines.</p>
          </div>
          <Link to="/recruiter/jobs/create" className="bg-[#6366F1] hover:bg-[#8B5CF6] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(99,102,241,0.2)] flex items-center gap-2 w-fit">
            <Plus className="w-5 h-5" /> Create Job
          </Link>
        </div>
      </FadeUp>

      <FadeUp delay={0.1}>
        <div className="relative mb-8">
          <Search className="w-5 h-5 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search by job title or status..." 
            className="w-full bg-[#0f172a]/60 border border-white/10 text-white pl-12 pr-4 py-3.5 rounded-xl focus:outline-none focus:border-[#6366F1]/50 focus:ring-1 focus:ring-[#6366F1]/50 transition-all placeholder:text-gray-600 font-medium"
          />
        </div>
      </FadeUp>

      <div className="space-y-4">
        <FadeUp delay={0.15}>
          <div className="bg-[#0f172a]/60 backdrop-blur-xl border border-[#6366F1]/30 rounded-2xl p-6 shadow-lg hover:border-[#6366F1]/60 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#6366F1]"></div>
            <div>
              <h3 className="font-bold text-xl text-white mb-1">Sr. Backend Engineer</h3>
              <p className="text-sm text-gray-400 font-medium">Acme Corp • San Francisco, CA • Created 2 days ago</p>
              <div className="flex gap-2 mt-3">
                <span className="text-[10px] text-green-400 font-bold uppercase tracking-widest bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded">Active</span>
              </div>
            </div>
            
            <div className="flex items-center gap-8">
              <div className="text-right hidden sm:block">
                <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Applications</div>
                <div className="text-2xl font-mono font-bold text-white">124</div>
              </div>
              <Link to="/recruiter/jobs/1/applications" className="bg-white text-[#030712] hover:bg-gray-200 px-5 py-2.5 rounded-lg font-bold transition-all text-sm flex items-center gap-2">
                View Applicants <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </FadeUp>

        <FadeUp delay={0.2}>
          <div className="bg-[#0f172a]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg hover:border-gray-600 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h3 className="font-bold text-xl text-white mb-1">Full Stack Developer</h3>
              <p className="text-sm text-gray-400 font-medium">Acme Corp • Remote • Created 1 week ago</p>
              <div className="flex gap-2 mt-3">
                <span className="text-[10px] text-green-400 font-bold uppercase tracking-widest bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded">Active</span>
              </div>
            </div>
            
            <div className="flex items-center gap-8">
              <div className="text-right hidden sm:block">
                <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Applications</div>
                <div className="text-2xl font-mono font-bold text-white">86</div>
              </div>
              <Link to="/recruiter/jobs/2/applications" className="bg-transparent border border-gray-600 hover:border-white text-white px-5 py-2.5 rounded-lg font-bold transition-all text-sm flex items-center gap-2">
                View Applicants <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </FadeUp>

        <FadeUp delay={0.25}>
          <div className="bg-[#0f172a]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg hover:border-gray-600 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 opacity-60 grayscale hover:grayscale-0 hover:opacity-100">
            <div>
              <h3 className="font-bold text-xl text-white mb-1">Frontend Intern</h3>
              <p className="text-sm text-gray-400 font-medium">Acme Corp • Remote • Created 1 month ago</p>
              <div className="flex gap-2 mt-3">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest bg-gray-800 border border-gray-700 px-2.5 py-1 rounded">Closed</span>
              </div>
            </div>
            
            <div className="flex items-center gap-8">
              <div className="text-right hidden sm:block">
                <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Applications</div>
                <div className="text-2xl font-mono font-bold text-white">31</div>
              </div>
              <Link to="/recruiter/jobs/3/applications" className="bg-transparent border border-gray-600 hover:border-white text-white px-5 py-2.5 rounded-lg font-bold transition-all text-sm flex items-center gap-2">
                View Applicants <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </FadeUp>
      </div>

    </div>
  );
}
