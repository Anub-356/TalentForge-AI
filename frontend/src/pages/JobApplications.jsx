import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle, ShieldAlert, Brain, Search, Users, Trophy } from 'lucide-react';
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

export default function JobApplications() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobAndCandidates = async () => {
      try {
        setLoading(true);
        const jobRes = await api.get(`/recruiters/jobs/${id}`);
        setJob(jobRes.data);
        const candRes = await api.get(`/recruiters/jobs/${id}/candidates`);
        setCandidates(candRes.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load candidate rankings.');
      } finally {
        setLoading(false);
      }
    };
    fetchJobAndCandidates();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        <div className="animate-spin w-6 h-6 border-2 border-[#6366F1] border-t-transparent rounded-full mr-3"></div>
        Processing Intelligence Pipeline...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-400 text-center py-12">{error}</div>;
  }

  if (!job) return null;

  return (
    <div className="pb-12">
      <FadeUp delay={0.0}>
        <div className="mb-8">
          <Link to="/recruiter" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium w-fit mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Command Center
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/[0.10] pb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">{job.title}</h1>
              <div className="flex items-center gap-4 text-gray-400 font-medium">
                <span className="flex items-center gap-2"><Users className="w-4 h-4 text-[#6366F1]" /> {candidates.length} Verified Applicants</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-lg flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span> Active Pipeline</span>
                {job.company && <span className="text-gray-500">{job.company}</span>}
              </div>
            </div>
          </div>
        </div>
      </FadeUp>

      {/* Filters Row */}
      <FadeUp delay={0.1}>
        <div className="flex flex-wrap items-center gap-4 mb-10">
          <div className="relative flex-1 min-w-[250px] max-w-sm mr-4">
            <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Filter by skill, name, or evidence..." 
              className="w-full bg-white/[0.03] border border-white/[0.10] text-white pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:border-[#6366F1]/50 focus:ring-1 focus:ring-[#6366F1]/50 transition-all placeholder:text-gray-600 text-sm font-medium"
            />
          </div>

          <button className="bg-[#6366F1]/10 text-[#6366F1] border border-[#6366F1]/20 px-5 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all hover:bg-[#6366F1]/20">
            <CheckCircle className="w-4 h-4" /> Verified Evidence
          </button>
          <button className="bg-white/[0.03] text-gray-400 border border-white/[0.10] hover:border-gray-500 hover:text-white px-5 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all">
            <ShieldAlert className="w-4 h-4 text-orange-400" /> Needs Review
          </button>
          <button className="bg-white/[0.03] text-gray-400 border border-white/[0.10] hover:border-gray-500 hover:text-white px-5 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all">
            <Brain className="w-4 h-4 text-[#8B5CF6]" /> High Match
          </button>
        </div>
      </FadeUp>

      {/* Applicant Cards */}
      <div className="space-y-6">
        {candidates.map((cand, index) => {
          const trustScore = cand.match.final_score;
          const isRank1 = index === 0;
          const isTopTier = trustScore >= 85;
          const isHighTier = trustScore >= 60 && trustScore < 85;
          const initials = cand.student_name ? cand.student_name.substring(0, 2).toUpperCase() : '??';

          const verifiedSkills = cand.skills.filter(s => s.level !== 'Self-Reported');
          const hasVerified = verifiedSkills.length > 0;

          return (
            <FadeUp delay={0.15 + (index * 0.05)} key={cand.match.student_id}>
              <div className={`bg-gradient-to-b from-white/[0.08] to-white/[0.03] backdrop-blur-[24px] border rounded-3xl relative overflow-hidden transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] hover:border-[#6366F1]/40 ${isRank1 ? 'p-8 border-[#6366F1]/30 shadow-[0_8px_30px_rgba(99,102,241,0.1)]' : 'p-6 border-white/[0.10] shadow-[0_8px_30px_rgb(0,0,0,0.12)] opacity-90'}`} onClick={() => window.location.href = `/recruiter/candidates/${cand.match.student_id}?jobId=${id}`}>
                <div className={`absolute top-0 left-0 w-1.5 h-full ${isRank1 ? 'bg-[#6366F1] shadow-[0_0_20px_#6366F1]' : isTopTier ? 'bg-indigo-400' : isHighTier ? 'bg-orange-500' : 'bg-gray-500'}`}></div>
                
                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-center justify-center w-12 shrink-0">
                    {isRank1 ? (
                      <div className="text-yellow-400 mb-1 animate-pulse">
                        <Trophy className="w-6 h-6" />
                      </div>
                    ) : (
                      <div className="text-gray-500 font-mono font-bold text-lg mb-1">#{index + 1}</div>
                    )}
                  </div>

                  <div className={`rounded-full flex items-center justify-center text-white font-bold shadow-lg shrink-0 ${isRank1 ? 'w-16 h-16 text-2xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] shadow-[0_0_20px_rgba(99,102,241,0.3)]' : 'w-12 h-12 text-lg bg-gradient-to-br from-gray-700 to-gray-800'}`}>
                    {initials}
                  </div>
                  <div>
                    <h3 className={`font-bold text-white mb-1 tracking-tight ${isRank1 ? 'text-3xl' : 'text-xl'}`}>{cand.student_name}</h3>
                    <div className="flex items-center gap-3 mt-2">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${hasVerified ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-orange-500/10 border border-orange-500/20 text-orange-400'}`}>
                        {hasVerified ? <CheckCircle className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />} 
                        {hasVerified ? 'Verified Evidence' : 'Needs Review'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12 pl-18 md:pl-0">
                  <div className="text-right flex flex-col items-start md:items-end gap-1">
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Trust Score</div>
                    <div className={`font-mono font-bold ${isRank1 ? 'text-4xl text-white' : 'text-2xl text-gray-300'}`}>
                      {trustScore.toFixed(0)}<span className="text-gray-500 text-lg">/100</span>
                    </div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                      Semantic: {(cand.match.semantic_score * 100).toFixed(0)}% <span className="mx-1.5 text-gray-700">|</span> Github: {cand.match.github_score.toFixed(0)}%
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Link to={`/recruiter/candidates/${cand.match.student_id}?jobId=${id}`} className={`${isRank1 ? 'bg-gradient-to-b from-[#6366F1] to-[#4F46E5] hover:from-[#8B5CF6] hover:to-[#6366F1] shadow-[0_0_20px_rgba(99,102,241,0.3)] border border-[#8B5CF6]/50 px-8 py-4' : 'bg-white/[0.05] border border-white/[0.10] hover:bg-white/[0.1] px-6 py-3'} text-white rounded-xl font-bold transition-all text-sm flex items-center gap-2 whitespace-nowrap`}>
                      <Brain className="w-4 h-4" /> Intelligence Report
                    </Link>
                  </div>
                </div>
              </div>
            </FadeUp>
          );
        })}

        {candidates.length === 0 && (
          <div className="text-center py-16 bg-gradient-to-b from-white/[0.05] to-transparent rounded-3xl border border-white/[0.10]">
            <Search className="w-10 h-10 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white">No candidates ranked yet</h3>
            <p className="text-gray-400 text-sm mt-2">Candidates who apply to this job will appear here automatically.</p>
          </div>
        )}
      </div>
    </div>
  );
}
