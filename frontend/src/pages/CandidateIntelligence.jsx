import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Target, ShieldAlert, CheckCircle, Star, Shield, Lock, Activity, UserCheck, UserX, Calendar, ArrowLeft, AlertTriangle } from 'lucide-react';
import api from '../api';
import candidateData from '../data/ranked_candidates.json';

const FadeUp = ({ children, delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.2, delay, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

const parseExplanation = (exp) => {
  if (!exp) return { signals: [], concerns: [], flags: [], reason: '' };
  
  const result = { signals: [], concerns: [], flags: [], reason: '' };
  const sections = exp.split('\n\n');
  
  sections.forEach(section => {
    if (section.startsWith('Strong Signals:')) {
      result.signals = section.replace('Strong Signals:\n', '').split('\n').map(s => s.replace(/^[•\-]\s*/, '').replace(' ', '').trim()).filter(Boolean);
    } else if (section.startsWith('Concern:')) {
      const lines = section.replace('Concern:\n', '').split('\n').map(s => s.replace(/^[•\-]\s*/, '').replace(' ', '').trim()).filter(Boolean);
      lines.forEach(line => {
        if (line.startsWith('Risk Flag:')) {
          result.flags.push(line.replace('Risk Flag: ', '').trim());
        } else if (line !== 'None identified') {
          result.concerns.push(line);
        }
      });
    } else if (section.startsWith('Reason:')) {
      result.reason = section.replace('Reason:\n', '').trim();
    }
  });

  // Fallback for old explanation format
  if (result.signals.length === 0 && result.concerns.length === 0 && result.reason === '') {
    result.reason = exp;
  }
  
  return result;
};

export default function CandidateIntelligence() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get('jobId');
  const navigate = useNavigate();

  const [cand, setCand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [decision, setDecision] = useState(null);

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        setLoading(true);
        setError(null);
        if (!jobId) {
          // Challenge Dataset fallback (Rankings page / Search)
          const jsonCand = candidateData.candidates.find(c => c.id.toLowerCase() === id.toLowerCase());
          if (!jsonCand) throw new Error('Candidate not found in dataset');
          
          const transformed = {
            student_name: `Candidate ${jsonCand.id}`,
            student_email: `${jsonCand.id.toLowerCase()}@verified.talentforge.ai`,
            github_username: `dev-${jsonCand.id.toLowerCase()}`,
            rank: jsonCand.rank,
            match: {
              student_id: jsonCand.id,
              final_score: jsonCand.trust,
              semantic_score: jsonCand.roleFit / 100,
              github_score: jsonCand.verifiedCompetence,
              explanation: `Strong Signals:\n- Verified Experience (${jsonCand.experience} years)\n- High Role Fit (${jsonCand.roleFit}%)\n- Responsive Availability (${jsonCand.availability}%)\n\nReason:\n${jsonCand.reasoning}`
            },
            skills: [
              { name: "Python / Machine Learning", level: "Expert" },
              { name: "Distributed Systems", level: "Advanced" },
              { name: "Algorithms & Data Structures", level: "Verified" }
            ],
            projects: [
              { title: "AI Candidate Ranking Engine", description: "Production-grade semantic matching and fraud detection system." }
            ],
            github_metrics: {
              public_repos: 42,
              followers: 180,
              contributions: 1250
            }
          };
          setCand(transformed);
          setLoading(false);
          return;
        }
        
        const res = await api.get(`/recruiters/jobs/${jobId}/candidates`);
        const targetCand = res.data.find(c => c.match.student_id === id);
        
        if (!targetCand) throw new Error('Candidate not found for this job');
        
        const rank = res.data.findIndex(c => c.match.student_id === id) + 1;
        targetCand.rank = rank;
        setCand(targetCand);
      } catch (err) {
        console.error(err);
        setError('Failed to load candidate intelligence.');
      } finally {
        setLoading(false);
      }
    };
    fetchCandidate();
  }, [id, jobId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        <div className="animate-spin w-6 h-6 border-2 border-[#6366F1] border-t-transparent rounded-full mr-3"></div>
        Decrypting Candidate Signals...
      </div>
    );
  }

  if (error || !cand) {
    return <div className="text-red-400 text-center py-12">{error || 'Candidate not found.'}</div>;
  }

  const initials = cand.student_name ? cand.student_name.substring(0, 2).toUpperCase() : '??';
  
  // Normalize final_score if it's 0-1 scale to 0-100 scale for UI
  const rawScore = cand.match.final_score;
  const trustScore = rawScore <= 1.0 ? rawScore * 100 : rawScore;
  
  const parsedExp = parseExplanation(cand.match.explanation);
  const fraudFlagsCount = parsedExp.flags.length;
  
  const isTopTier = trustScore >= 65 && fraudFlagsCount === 0;
  const isHighTier = trustScore >= 50 && trustScore < 65 && fraudFlagsCount === 0;

  // Risk Intelligence Calculation
  let riskLevel = "LOW";
  let riskColor = "text-green-400";
  let riskBg = "bg-green-500/10 border-green-500/20";
  if (fraudFlagsCount > 0) {
    riskLevel = "HIGH";
    riskColor = "text-red-400";
    riskBg = "bg-red-500/10 border-red-500/20";
  } else if (parsedExp.concerns.length > 0) {
    riskLevel = "MEDIUM";
    riskColor = "text-yellow-400";
    riskBg = "bg-yellow-500/10 border-yellow-500/20";
  }

  // Hiring Recommendation
  let recommendation = "Review Required";
  let decisionConfidence = "LOW";
  let confidenceColor = "text-orange-400";
  
  if (trustScore >= 65 && fraudFlagsCount === 0) {
    recommendation = "Strong Hire";
    decisionConfidence = "HIGH";
    confidenceColor = "text-green-400";
  } else if (trustScore >= 50 && fraudFlagsCount === 0) {
    recommendation = "Interview Recommended";
    decisionConfidence = "MEDIUM";
    confidenceColor = "text-blue-400";
  } else if (fraudFlagsCount > 0) {
    recommendation = "Reject - High Risk";
    decisionConfidence = "HIGH";
    confidenceColor = "text-red-400";
  }

  const handleDecision = (action) => {
    setDecision(action);
  };

  return (
    <div className="pb-32">
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        
        <div className="mb-8">
          <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium w-fit">
            <ArrowLeft className="w-4 h-4" /> Back to Candidate Rankings
          </button>
        </div>

        {/* COMPONENT 1: Identity & Rank Banner */}
        <FadeUp delay={0.0}>
          <div className="bg-gradient-to-r from-[#6366F1]/10 via-[#8B5CF6]/10 to-[#6366F1]/5 border border-[#6366F1]/30 rounded-3xl p-8 shadow-[0_0_40px_rgba(99,102,241,0.15)] mb-8 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#6366F1] opacity-10 blur-[100px] rounded-full"></div>
            
            <div className="flex items-center gap-6 relative z-10">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-[0_0_30px_rgba(99,102,241,0.4)] ${isTopTier ? 'bg-gradient-to-br from-[#6366F1] to-[#8B5CF6]' : isHighTier ? 'bg-gradient-to-br from-blue-500 to-indigo-500' : fraudFlagsCount > 0 ? 'bg-gradient-to-br from-red-500 to-orange-500' : 'bg-gradient-to-br from-gray-500 to-gray-700'}`}>
                {initials}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-bold text-white tracking-tight">{cand.student_name}</h1>
                  <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-lg border flex items-center gap-1.5 ${isTopTier ? 'bg-[#6366F1]/10 border-[#6366F1]/30 text-[#8B5CF6]' : fraudFlagsCount > 0 ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-blue-500/10 border-blue-500/30 text-blue-400'}`}>
                    {fraudFlagsCount > 0 ? <ShieldAlert className="w-3.5 h-3.5" /> : <Brain className="w-3.5 h-3.5" />}
                    Rank #{cand.rank}
                  </span>
                  {!jobId && (
                    <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-lg border bg-white/[0.04] border-white/[0.10] text-gray-300">
                      Demo dataset
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-400 font-medium">
                  <span>{cand.student_email}</span>
                  {cand.github_username && (
                    <>
                      <span>-</span>
                      <a href={`https://github.com/${cand.github_username}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">
                        github.com/{cand.github_username}
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white/[0.05] border border-white/[0.10] rounded-2xl p-6 shrink-0 md:min-w-[280px] flex flex-col gap-4 relative z-10 backdrop-blur-md">
              <div>
                <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Recommended Action</div>
                <div className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  {fraudFlagsCount > 0 ? <UserX className={`w-6 h-6 ${confidenceColor}`} /> : <CheckCircle className={`w-6 h-6 ${confidenceColor}`} />} 
                  <span className={confidenceColor}>{recommendation}</span>
                </div>
              </div>
            </div>
          </div>
        </FadeUp>

        <div className="flex flex-col lg:flex-row gap-8 mb-8">
          
          {/* LEFT PANEL */}
          <div className="lg:w-[40%] space-y-8">
            
            {/* COMPONENT 2: Dominant Trust Score */}
            <FadeUp delay={0.1}>
              <div className="bg-gradient-to-b from-white/[0.08] to-white/[0.03] backdrop-blur-[24px] border border-white/[0.10] rounded-3xl p-10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] relative overflow-hidden group">
                <div className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-6 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-indigo-400" /> Overall Trust Score
                </div>
                <div className="flex flex-col items-center justify-center py-6">
                  <div className={`text-9xl font-mono font-bold tracking-tighter mb-4 ${fraudFlagsCount > 0 ? 'text-red-400' : isTopTier ? 'text-transparent bg-clip-text bg-gradient-to-br from-[#6366F1] to-[#8B5CF6]' : 'text-white'}`}>
                    {trustScore.toFixed(0)}
                  </div>
                  <div className="text-sm font-bold text-gray-400 tracking-widest uppercase">Verified Confidence Match</div>
                </div>
              </div>
            </FadeUp>

            {/* COMPONENT 3: Risk Intelligence Section */}
            <FadeUp delay={0.2}>
              <div className={`backdrop-blur-[24px] border rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.12)] ${riskBg}`}>
                <div className="flex items-center justify-between mb-6">
                  <div className={`text-xs uppercase tracking-widest font-bold flex items-center gap-2 ${riskColor}`}>
                    <ShieldAlert className="w-4 h-4" /> Risk Intelligence
                  </div>
                  <div className={`text-sm font-bold tracking-widest px-3 py-1 rounded border ${riskColor} border-current/30`}>
                    LEVEL: {riskLevel}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-white/[0.05]">
                    <span className="text-sm text-gray-300 font-medium">Fraud Flags</span>
                    <span className={`text-base font-bold ${fraudFlagsCount > 0 ? 'text-red-400' : 'text-green-400'}`}>{fraudFlagsCount}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-white/[0.05]">
                    <span className="text-sm text-gray-300 font-medium">Timeline Issues</span>
                    <span className={`text-base font-bold ${parsedExp.flags.some(f => f.toLowerCase().includes('timeline')) ? 'text-red-400' : 'text-green-400'}`}>
                      {parsedExp.flags.some(f => f.toLowerCase().includes('timeline')) ? 'Detected' : 'Clear'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-sm text-gray-300 font-medium">Keyword Stuffing</span>
                    <span className={`text-base font-bold ${parsedExp.flags.some(f => f.toLowerCase().includes('stuffing')) ? 'text-red-400' : 'text-green-400'}`}>
                      {parsedExp.flags.some(f => f.toLowerCase().includes('stuffing')) ? 'Detected' : 'Clear'}
                    </span>
                  </div>
                </div>
              </div>
            </FadeUp>

            {/* COMPONENT 4: Why Ranked? Panel */}
            <FadeUp delay={0.3}>
              <div className="bg-white/[0.03] border border-white/[0.05] rounded-3xl p-8">
                <div className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-6 flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-400" /> Why Ranked #{cand.rank}?
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Base Semantic Fit</span>
                    <span className="text-sm font-mono font-bold text-white">{(cand.match.semantic_score * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Trust / Verification</span>
                    <span className="text-sm font-mono font-bold text-white">{trustScore.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Fraud Penalty</span>
                    <span className={`text-sm font-mono font-bold ${fraudFlagsCount > 0 ? 'text-red-400' : 'text-green-400'}`}>
                      {fraudFlagsCount > 0 ? '-20.0%' : '0.0%'}
                    </span>
                  </div>
                  <div className="pt-4 border-t border-white/[0.10] flex justify-between items-end">
                    <span className="text-sm text-gray-300 font-bold uppercase tracking-widest">Final Rank Score</span>
                    <span className="text-lg font-mono font-bold text-[#8B5CF6]">{trustScore.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </FadeUp>

          </div>

          {/* RIGHT PANEL */}
          <div className="lg:w-[60%] space-y-8">

            {/* COMPONENT 5: Evidence Ledger */}
            <FadeUp delay={0.4}>
              <div className="bg-gradient-to-b from-white/[0.08] to-white/[0.03] backdrop-blur-[24px] border border-white/[0.10] rounded-3xl p-10 shadow-[0_0_30px_rgba(0,0,0,0.1)] relative overflow-hidden h-full">
                <div className="text-xs text-indigo-400 uppercase tracking-widest font-bold mb-8 flex items-center gap-2">
                  <Activity className="w-4 h-4" /> Evidence Ledger
                </div>
                
                {parsedExp.reason && (
                  <div className="mb-10 p-5 bg-[#6366F1]/10 border border-[#6366F1]/20 rounded-2xl">
                    <h3 className="text-xs text-[#6366F1] font-bold uppercase tracking-widest mb-2">Automated Conclusion</h3>
                    <p className="text-base text-gray-200 leading-relaxed italic">"{parsedExp.reason}"</p>
                  </div>
                )}

                <div className="space-y-10">
                  <div>
                    <h3 className="text-sm font-bold text-white mb-4 tracking-tight flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400" /> Verified Strong Signals
                    </h3>
                    {parsedExp.signals.length > 0 ? (
                      <ul className="space-y-4">
                        {parsedExp.signals.map((signal, idx) => (
                          <li key={idx} className="flex items-start gap-3 bg-white/[0.02] p-4 rounded-xl border border-white/[0.05]">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 shrink-0"></div>
                            <span className="text-gray-300">{signal}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-gray-500 italic text-sm p-4 bg-white/[0.02] rounded-xl border border-white/[0.05]">No strong signals extracted.</div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white mb-4 tracking-tight flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-400" /> Identified Concerns & Flags
                    </h3>
                    
                    {parsedExp.flags.length > 0 && (
                      <div className="mb-4">
                        <ul className="space-y-3">
                          {parsedExp.flags.map((flag, idx) => (
                            <li key={idx} className="flex items-start gap-3 bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                              <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
                              <div>
                                <span className="text-red-400 font-bold block mb-1">FRAUD RISK TRIGGERED</span>
                                <span className="text-red-200 text-sm">{flag}</span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {parsedExp.concerns.length > 0 ? (
                      <ul className="space-y-3">
                        {parsedExp.concerns.map((concern, idx) => (
                          <li key={idx} className="flex items-start gap-3 bg-white/[0.02] p-4 rounded-xl border border-white/[0.05]">
                            <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-2 shrink-0"></div>
                            <span className="text-gray-300">{concern}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      !parsedExp.flags.length && <div className="text-gray-500 italic text-sm p-4 bg-white/[0.02] rounded-xl border border-white/[0.05]">No significant concerns identified.</div>
                    )}
                  </div>
                </div>

              </div>
            </FadeUp>

          </div>
        </div>
        
        {/* COMPONENT 6: RECRUITER DECISION LAYER */}
        <FadeUp delay={0.5}>
          <div className="bg-gradient-to-b from-white/[0.08] to-white/[0.03] backdrop-blur-[24px] border border-white/[0.10] rounded-3xl p-10 relative overflow-hidden z-40 mt-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
              <div>
                <div className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-2 flex items-center gap-2">
                  <UserCheck className="w-4 h-4" /> Recruiter Decision
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Execute Pipeline Action</h3>
                <p className="text-gray-400 text-sm">Human decision powered by Evidence-Based AI.</p>
              </div>
              
              <div className="flex items-center gap-4 w-full md:w-auto">
                <button 
                  onClick={() => handleDecision('reject')}
                  className={`flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-base transition-all ${
                    decision === 'reject' 
                    ? 'bg-red-500/20 text-red-400 border border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.3)]' 
                    : 'bg-white/[0.03] border border-white/[0.10] text-gray-300 hover:border-red-500/50 hover:text-red-400 hover:bg-red-500/10'
                  }`}
                >
                  <UserX className="w-5 h-5" /> Reject
                </button>
                
                <button 
                  onClick={() => handleDecision('shortlist')}
                  className={`flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-base transition-all ${
                    decision === 'shortlist' 
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.3)]' 
                    : 'bg-white/[0.05] border border-white/[0.20] text-white hover:border-blue-500/50 hover:text-blue-400 hover:bg-blue-500/10'
                  }`}
                >
                  <UserCheck className="w-5 h-5" /> Shortlist
                </button>
                
                <button 
                  onClick={() => handleDecision('interview')}
                  className={`flex-1 md:flex-none flex items-center justify-center gap-3 px-10 py-4 rounded-2xl font-bold text-base transition-all ${
                    decision === 'interview' 
                    ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white border border-[#8B5CF6] shadow-[0_0_30px_rgba(139,92,246,0.5)]' 
                    : 'bg-gradient-to-r from-[#6366F1]/80 to-[#8B5CF6]/80 text-white hover:from-[#6366F1] hover:to-[#8B5CF6] hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] border border-[#8B5CF6]/50'
                  }`}
                >
                  <Calendar className="w-5 h-5" /> Fast-Track Interview
                </button>
              </div>
            </div>
          </div>
        </FadeUp>

      </div>
    </div>
  );
}
