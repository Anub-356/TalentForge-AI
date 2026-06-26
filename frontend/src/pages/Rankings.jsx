import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Trophy, ChevronRight, Shield, Award, Activity, Search } from 'lucide-react';
import candidateData from '../data/ranked_candidates.json';

const FadeUp = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

export default function Rankings() {
  const [activeTab, setActiveTab] = useState(100); // 10, 25, 100

  const displayedCandidates = candidateData.candidates.slice(0, activeTab);

  return (
    <div className="pb-12">
      {/* Header Section */}
      <FadeUp delay={0.0}>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-[#6366F1]/10 rounded-xl flex items-center justify-center border border-[#6366F1]/20">
                <Trophy className="w-5 h-5 text-[#8B5CF6]" />
              </div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Intelligence Board</h1>
            </div>
            <p className="text-gray-400 text-lg">
              The immutable ranking of the top candidates verified by our engine.
            </p>
          </div>
          
          {/* Tabs */}
          <div className="bg-[#1e293b]/60 backdrop-blur-md p-1.5 rounded-xl flex items-center border border-gray-800 w-fit">
            {[10, 25, 100].map(num => (
              <button
                key={num}
                onClick={() => setActiveTab(num)}
                className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
                  activeTab === num 
                    ? 'bg-[#6366F1] text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Top {num}
              </button>
            ))}
          </div>
        </div>
      </FadeUp>

      {/* Rankings Table */}
      <FadeUp delay={0.1}>
        <div className="bg-[#0f172a]/60 backdrop-blur-xl border border-gray-800 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#030712]/50 border-b border-gray-800">
                  <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Rank</th>
                  <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Candidate</th>
                  <th className="py-4 px-6 text-[10px] font-bold text-[#8B5CF6] uppercase tracking-widest whitespace-nowrap">Confidence</th>
                  <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Role Fit</th>
                  <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Verified</th>
                  <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Trust</th>
                  <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Risk</th>
                  <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Avail Window</th>
                  <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Why</th>
                  <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Tier</th>
                  <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {displayedCandidates.map((cand, idx) => {
                    const isTopTier = cand.tier === 'Elite Match';
                    const isHighTier = cand.tier === 'High Confidence';
                    const initials = cand.id.substring(5, 7).toUpperCase();

                    return (
                      <motion.tr 
                        key={cand.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2, delay: idx * 0.02 }}
                        className="border-b border-gray-800/50 hover:bg-white/5 transition-colors group cursor-pointer"
                      >
                        <td className="py-4 px-6">
                          <div className="flex flex-col items-start gap-1">
                            <div className={`text-lg font-mono font-bold ${idx === 0 ? 'text-yellow-400' : idx === 1 ? 'text-gray-300' : idx === 2 ? 'text-orange-400' : 'text-gray-500'}`}>
                              #{idx + 1}
                            </div>
                            {idx === 0 && <span className="text-[10px] font-bold bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 px-1.5 py-0.5 rounded flex items-center gap-1 uppercase tracking-widest whitespace-nowrap">🥇 Rank 1</span>}
                            {idx === 1 && <span className="text-[10px] font-bold bg-gray-400/10 text-gray-300 border border-gray-400/20 px-1.5 py-0.5 rounded flex items-center gap-1 uppercase tracking-widest whitespace-nowrap">🥈 Rank 2</span>}
                            {idx === 2 && <span className="text-[10px] font-bold bg-orange-400/10 text-orange-400 border border-orange-400/20 px-1.5 py-0.5 rounded flex items-center gap-1 uppercase tracking-widest whitespace-nowrap">🥉 Rank 3</span>}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 ${isTopTier ? 'bg-gradient-to-br from-[#6366F1] to-[#8B5CF6]' : isHighTier ? 'bg-gradient-to-br from-orange-500 to-red-500' : 'bg-gradient-to-br from-green-500 to-emerald-500'}`}>
                              {initials}
                            </div>
                            <span className="text-sm font-bold text-gray-200">{cand.id}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-mono font-bold ${isTopTier ? 'text-[#8B5CF6]' : isHighTier ? 'text-orange-400' : 'text-green-400'}`}>
                              {cand.confidenceScore}%
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm font-mono text-gray-300">{cand.roleFit}%</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm font-mono text-gray-300">{cand.verifiedCompetence}%</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm font-mono text-gray-300">{cand.trust}%</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`text-sm font-mono font-bold ${cand.honeypotRisk === 0 ? 'text-green-400' : 'text-orange-400'}`}>
                            {cand.honeypotRisk}%
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-[11px] font-medium text-gray-300 bg-white/5 px-2 py-1 rounded whitespace-nowrap border border-gray-800">
                            {cand.availability >= 80 ? 'Immediate' : '15-30 Days'}
                          </span>
                        </td>
                        <td className="py-4 px-6 max-w-[200px] truncate">
                          <span className="text-[11px] text-gray-400 leading-tight" title={cand.reasoning}>
                            {cand.reasoning}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`text-xs font-bold px-2 py-1 rounded-md border ${
                            isTopTier ? 'bg-[#8B5CF6]/10 border-[#8B5CF6]/30 text-[#8B5CF6]' : 
                            isHighTier ? 'bg-orange-500/10 border-orange-500/30 text-orange-400' : 
                            'bg-green-500/10 border-green-500/30 text-green-400'
                          }`}>
                            {cand.tier}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <Link 
                            to={`/candidate/${cand.id}`}
                            className="inline-flex items-center justify-center p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-gray-700 hover:border-gray-500 transition-colors text-gray-400 hover:text-white"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Link>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </FadeUp>
    </div>
  );
}
