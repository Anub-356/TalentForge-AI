# validation_scripts/ranking_engine.py

import json
import time
from features import FeatureExtractor
from honeypot_detector import HoneypotDetector

class RankingEngine:
    def __init__(self, target_keywords=None, weights=None, penalty_strategy="moderate"):
        self.extractor = FeatureExtractor()
        if target_keywords:
            self.extractor.target_keywords = target_keywords
            
        self.detector = HoneypotDetector()
        
        # Phase 1 Target Weights
        self.weights = weights or {
            "career_relevance_score": 0.20,
            "skill_match_score": 0.15,
            "years_of_experience": 0.15,
            "verified_competence_score": 0.15,
            "title_alignment_score": 0.10,
            "career_progression_score": 0.10,
            "leadership_score": 0.10,
            "profile_trust_score": 0.05
        }
        
        self.penalty_strategy = penalty_strategy
        
    def calculate_base_score(self, features):
        score = 0.0
        for k, w in self.weights.items():
            score += features.get(k, 0.0) * w
        return score
        
    def apply_fraud_penalty(self, base_score, risk_score):
        # Bound the maximum penalty to 20%
        penalty = min(risk_score, 0.20)
        return base_score * (1.0 - penalty)

    def generate_reasoning(self, cand, features, fraud_res, final_score):
        history = cand.get("career_history", [])
        top_title = history[0].get("title", "No Title") if history else "No Title"
        company = history[0].get("company", "Unknown Company") if history else "Unknown Company"
        
        verified_avg = features.get("verified_skill_score", 0.0) * 100
        avail = features.get("availability_score", 0.0) * 100
        notice = cand.get("redrob_signals", {}).get("notice_period_days", 0)
        resp = cand.get("redrob_signals", {}).get("recruiter_response_rate", 0.0) * 100
        
        reason = f"Strong Signals:\n"
        reason += f"• Production {top_title} experience at {company}\n"
        
        if verified_avg > 0:
            reason += f"• JD-aligned assessment score: {verified_avg:.0f}\n"
        if resp > 0:
            reason += f"• Recruiter responsiveness: {resp:.0f}%\n"
            
        reason += "\nConcern:\n"
        has_concern = False
        if notice > 30:
            reason += f"• Notice period: {notice} days\n"
            has_concern = True
        if resp < 30:
            reason += f"• Poor responsiveness history\n"
            has_concern = True
            
        if fraud_res["is_honeypot"]:
            for r in fraud_res["triggered_rules"]:
                reason += f"• Risk Flag: {r['rule']} - {r['reason']}\n"
            has_concern = True
            
        if not has_concern:
            reason += "• None identified\n"
            
        reason += "\nReason:\nRanked highly due to verified retrieval and search-system experience directly aligned with the target role."
        return reason

    def score_candidate(self, cand):
        # ---------------------------------------------------------------------
        # O(N) Processing Core (No LLM calls, streaming safe)
        # ---------------------------------------------------------------------
        features = self.extractor.extract_all(cand)
        fraud_res = self.detector.check_candidate(cand, features)
        
        # Phase 7.2: Verified Competence Scoring
        verified = features.get("verified_skill_score", 0.0)
        skill_dur = features.get("skill_duration_score", 0.0)
        endorse = features.get("endorsement_score", 0.0)
        depth = features.get("assessment_depth_score", 0.0)
        verified_competence_score = 0.60 * verified + 0.20 * skill_dur + 0.10 * endorse + 0.10 * depth
        
        features["verified_competence_score"] = verified_competence_score
        
        base_score = self.calculate_base_score(features)
        
        # Availability Intelligence (Phase 1)
        avail_score = features.get("availability_score", 0.0)
        availability_multiplier = 0.70 + 0.30 * avail_score
        
        # Guardrail: Availability should not rescue low-relevance candidates
        if features.get("career_relevance_score", 0.0) < 0.20:
            availability_multiplier = min(availability_multiplier, 1.05)
            
        score_with_avail = base_score * availability_multiplier
        final_score = self.apply_fraud_penalty(score_with_avail, fraud_res["risk_score"])
        
        # Safeguards (Phase 7.1)
        resp_rate = features.get("recruiter_response_score", 0.0)
        if resp_rate < 0.10:
            final_score = min(final_score, 0.55)
        elif resp_rate < 0.20 and avail_score < 0.50:
            final_score = min(final_score, 0.70)
            
        # Phase 7.2: Remove zero-verified candidates
        if verified_competence_score == 0.0 or verified == 0.0:
            final_score = 0.0
            
        reasoning = self.generate_reasoning(cand, features, fraud_res, final_score)
        
        return {
            "candidate_id": cand.get("candidate_id"),
            "base_score": base_score,
            "availability_score": avail_score,
            "fraud_risk": fraud_res["risk_score"],
            "final_score": final_score,
            "reasoning": reasoning,
            "features": features
        }
