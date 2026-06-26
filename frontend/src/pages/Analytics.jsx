import React from 'react';
import { motion } from 'framer-motion';
import { BarChart2, PieChart, TrendingUp, ShieldAlert, CheckCircle, Users } from 'lucide-react';
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

export default function Analytics() {
  const totalCandidates = candidateData.candidates.length;
  
  const avgRoleFit = Math.round(candidateData.candidates.reduce((acc, c) => acc + c.roleFit, 0) / totalCandidates);
  const avgVerification = Math.round(candidateData.candidates.reduce((acc, c) => acc + c.verifiedCompetence, 0) / totalCandidates);
  const avgAvailability = Math.round(candidateData.candidates.reduce((acc, c) => acc + c.availability, 0) / totalCandidates);
  const avgConfidence = Math.round(candidateData.candidates.reduce((acc, c) => acc + c.confidenceScore, 0) / totalCandidates);
  
  const eliteMatches = candidateData.candidates.filter(c => c.tier === 'Elite Match').length;
  const highConfidence = candidateData.candidates.filter(c => c.tier === 'High Confidence').length;
  const strongMatches = candidateData.candidates.filter(c => c.tier === 'Strong').length;

  const trustHigh = candidateData.candidates.filter(c => c.trust >= 95).length;
  const trustMed = candidateData.candidates.filter(c => c.trust >= 85 && c.trust < 95).length;
  const trustLow = candidateData.candidates.filter(c => c.trust < 85).length;
  
  return (
    <div className="pb-12">
      {/* Header */}
      <FadeUp delay={0.0}>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-[#6366F1]/10 rounded-xl flex items-center justify-center border border-[#6366F1]/20">
                <BarChart2 className="w-5 h-5 text-[#8B5CF6]" />
              </div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Intelligence Analytics</h1>
            </div>
            <p className="text-gray-400 text-lg">
              Macro-level view of your top {totalCandidates} ranked candidates based on the actual dataset.
            </p>
          </div>
        </div>
      </FadeUp>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <FadeUp delay={0.1}>
          <div className="bg-[#0f172a]/60 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-5 h-5 text-blue-400" />
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Ranked</h3>
            </div>
            <div className="text-4xl font-mono font-bold text-white">{totalCandidates}</div>
          </div>
        </FadeUp>
        
        <FadeUp delay={0.15}>
          <div className="bg-[#0f172a]/60 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-5 h-5 text-[#8B5CF6]" />
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Avg Confidence</h3>
            </div>
            <div className="text-4xl font-mono font-bold text-[#8B5CF6]">{avgConfidence}%</div>
          </div>
        </FadeUp>

        <FadeUp delay={0.2}>
          <div className="bg-[#0f172a]/60 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-5 h-5 text-indigo-400" />
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Avg Role Fit</h3>
            </div>
            <div className="text-4xl font-mono font-bold text-indigo-400">{avgRoleFit}%</div>
          </div>
        </FadeUp>

        <FadeUp delay={0.25}>
          <div className="bg-[#0f172a]/60 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Elite Matches</h3>
            </div>
            <div className="text-4xl font-mono font-bold text-green-400">{eliteMatches}</div>
          </div>
        </FadeUp>
      </div>

      {/* Main Charts Area */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Verification Pass Rates */}
        <FadeUp delay={0.3}>
          <div className="bg-[#0f172a]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg h-full">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-[#8B5CF6]" /> Top 100 Average Metrics
            </h3>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-bold text-gray-300">Average Role Fit</span>
                  <span className="text-sm font-mono text-blue-400">{avgRoleFit}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${avgRoleFit}%` }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-bold text-gray-300">Average Competence Verification</span>
                  <span className="text-sm font-mono text-indigo-400">{avgVerification}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${avgVerification}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-bold text-gray-300">Average Availability Score</span>
                  <span className="text-sm font-mono text-purple-400">{avgAvailability}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${avgAvailability}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </FadeUp>

        {/* Tier & Trust Distribution */}
        <FadeUp delay={0.35}>
          <div className="bg-[#0f172a]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg h-full">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-green-400" /> Tier & Trust Distribution
            </h3>
            
            <div className="space-y-4">
              <div className="bg-[#030712]/50 border border-gray-800 rounded-xl p-4 flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-bold text-white">Elite Matches</h4>
                  <p className="text-xs text-gray-500 mt-1">Tier distribution</p>
                </div>
                <div className="text-xl font-mono text-[#8B5CF6] font-bold">{eliteMatches}</div>
              </div>

              <div className="bg-[#030712]/50 border border-gray-800 rounded-xl p-4 flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-bold text-white">High Confidence</h4>
                  <p className="text-xs text-gray-500 mt-1">Tier distribution</p>
                </div>
                <div className="text-xl font-mono text-orange-400 font-bold">{highConfidence}</div>
              </div>

              <div className="bg-[#030712]/50 border border-gray-800 rounded-xl p-4 flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-bold text-white">Flawless Trust (95%+)</h4>
                  <p className="text-xs text-gray-500 mt-1">Trust distribution</p>
                </div>
                <div className="text-xl font-mono text-green-400 font-bold">{trustHigh}</div>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>

    </div>
  );
}
