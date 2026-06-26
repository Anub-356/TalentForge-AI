import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Rocket } from 'lucide-react';
import { useState } from 'react';

const FadeUp = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.2, delay, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

export default function CreateJob() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handlePublish = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      navigate('/recruiter/jobs');
    }, 1000);
  };

  return (
    <div className="pb-12 max-w-3xl mx-auto">
      <FadeUp delay={0.0}>
        <div className="mb-8">
          <Link to="/recruiter/jobs" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium w-fit mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Jobs
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Create Job Posting</h1>
          <p className="text-gray-400 text-lg">Define the role and let the AI matchmaking engine do the rest.</p>
        </div>
      </FadeUp>

      <FadeUp delay={0.1}>
        <div className="bg-[#0f172a]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-lg">
          <form onSubmit={handlePublish} className="space-y-6">
            
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Job Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Senior Backend Engineer" 
                  className="w-full bg-black/40 border border-gray-800 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#6366F1]/50 focus:ring-1 focus:ring-[#6366F1]/50 transition-all placeholder:text-gray-600 text-sm font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Location</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Remote, San Francisco" 
                    className="w-full bg-black/40 border border-gray-800 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#6366F1]/50 focus:ring-1 focus:ring-[#6366F1]/50 transition-all placeholder:text-gray-600 text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Department</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Engineering" 
                    className="w-full bg-black/40 border border-gray-800 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#6366F1]/50 focus:ring-1 focus:ring-[#6366F1]/50 transition-all placeholder:text-gray-600 text-sm font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Required Skills (Comma separated)</label>
                <input 
                  type="text" 
                  placeholder="e.g. Python, FastAPI, Docker, PostgreSQL" 
                  className="w-full bg-black/40 border border-gray-800 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#6366F1]/50 focus:ring-1 focus:ring-[#6366F1]/50 transition-all placeholder:text-gray-600 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Job Description</label>
                <textarea 
                  required
                  rows="6"
                  placeholder="Describe the responsibilities, expectations, and culture..." 
                  className="w-full bg-black/40 border border-gray-800 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#6366F1]/50 focus:ring-1 focus:ring-[#6366F1]/50 transition-all placeholder:text-gray-600 text-sm font-medium resize-none"
                ></textarea>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-800 flex justify-end gap-3">
              <Link to="/recruiter/jobs" className="px-6 py-3 rounded-xl text-sm font-bold text-gray-400 hover:text-white transition-colors">
                Cancel
              </Link>
              <button 
                type="submit" 
                disabled={loading}
                className="bg-[#6366F1] hover:bg-[#8B5CF6] text-white px-8 py-3 rounded-xl text-sm font-bold transition-all shadow-[0_0_20px_rgba(99,102,241,0.2)] flex items-center gap-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Rocket className="w-4 h-4" /> Publish Job
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </FadeUp>
    </div>
  );
}
