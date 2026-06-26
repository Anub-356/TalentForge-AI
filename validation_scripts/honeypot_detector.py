# validation_scripts/honeypot_detector.py

import json
from datetime import datetime

class HoneypotDetector:
    def __init__(self):
        # We define a few thresholds here
        self.expert_duration_min = 12  # An 'expert' should have > 12 months duration. 0 is a dead giveaway.
        self.tech_keywords = {"lora", "qlora", "tensorrt", "milvus", "rag", "fine-tuning llms", "pytorch", "tensorflow"}
        
    def check_candidate(self, cand, features=None):
        if features is None:
            features = {}
        results = []
        
        # Rule 1: Skill Inflation (Weight 0.05)
        r1 = self.rule_skill_inflation(cand)
        if r1["triggered"]: 
            r1["weight"] = 0.05
            results.append(r1)
            
        # Rule 2: Impossible Timeline (Weight 0.08)
        r2 = self.rule_impossible_timeline(cand)
        if r2["triggered"]: 
            r2["weight"] = 0.08
            results.append(r2)
            
        # Rule 3: Concurrent Employment (Timeline Overlap) (Weight 0.07)
        r3 = self.rule_concurrent_employment(cand)
        if r3["triggered"]: 
            r3["weight"] = 0.07
            results.append(r3)
            
        # Rule 4: Ghost Profile / Trust Inconsistency (Weight 0.05)
        r4 = self.rule_ghost_profile(cand)
        if r4["triggered"]: 
            r4["weight"] = 0.05
            results.append(r4)
            
        # Rule 5: Assessment Contradiction (Weight 0.08)
        r5 = self.rule_assessment_contradiction(cand)
        if r5["triggered"]: 
            r5["weight"] = 0.08
            results.append(r5)
            
        # Rule 6: Keyword Stuffing (Weight 0.05)
        r6 = self.rule_keyword_stuffing(cand, features)
        if r6["triggered"]: 
            r6["weight"] = 0.05
            results.append(r6)
            
        risk_score = sum(r.get("weight", 0.0) * r.get("confidence", 1.0) for r in results)
        
        return {
            "candidate_id": cand.get("candidate_id"),
            "is_honeypot": len(results) > 0,
            "risk_score": min(risk_score, 1.0),
            "triggered_rules": results
        }

    def rule_skill_inflation(self, cand):
        for skill in cand.get("skills", []):
            if skill.get("proficiency") == "expert" and skill.get("duration_months", 0) <= self.expert_duration_min:
                return {
                    "rule": "Skill Inflation",
                    "triggered": True,
                    "confidence": 1.0 if skill.get("duration_months", 0) == 0 else 0.5,
                    "reason": f"Expert proficiency in {skill.get('name')} but only {skill.get('duration_months', 0)} months duration."
                }
        return {"triggered": False}

    def rule_impossible_timeline(self, cand):
        # Simplified: If total duration of jobs > age of person, or YoE in profile > total possible years
        yoe = cand.get("profile", {}).get("years_of_experience", 0)
        history = cand.get("career_history", [])
        total_months_history = sum(h.get("duration_months", 0) for h in history if h.get("duration_months"))
        
        if total_months_history > 0 and (yoe * 12) > (total_months_history + 60): # 5 year buffer
            return {
                "rule": "Impossible Timeline",
                "triggered": True,
                "confidence": 0.8,
                "reason": f"Profile claims {yoe} YoE ({yoe*12} months) but history only has {total_months_history} months."
            }
        
        # Check negative durations
        for h in history:
            if h.get("duration_months", 0) < 0:
                return {
                    "rule": "Impossible Timeline",
                    "triggered": True,
                    "confidence": 1.0,
                    "reason": "Negative duration in career history."
                }
        
        return {"triggered": False}

    def rule_title_skill_mismatch(self, cand):
        title = cand.get("profile", {}).get("current_title", "").lower()
        non_tech = any(x in title for x in ["marketing", "hr", "accountant", "sales"])
        
        tech_expert_count = 0
        for skill in cand.get("skills", []):
            if skill.get("proficiency") in ["advanced", "expert"]:
                if skill.get("name", "").lower() in self.tech_keywords:
                    tech_expert_count += 1
                    
        if non_tech and tech_expert_count >= 2:
            return {
                "rule": "Title-Skill Mismatch",
                "triggered": True,
                "confidence": 0.9,
                "reason": f"Non-tech title '{title}' but has {tech_expert_count} advanced/expert hardcore ML skills."
            }
        return {"triggered": False}

    def rule_ghost_profile(self, cand):
        signals = cand.get("redrob_signals", {})
        no_verify = not signals.get("verified_email") and not signals.get("verified_phone")
        no_response = signals.get("recruiter_response_rate", 1.0) < 0.05
        
        if no_verify and no_response:
            return {
                "rule": "Ghost Profile",
                "triggered": True,
                "confidence": 0.7,
                "reason": "Unverified contact and <5% response rate."
            }
        return {"triggered": False}

    def rule_assessment_contradiction(self, cand):
        assessments = cand.get("redrob_signals", {}).get("skill_assessment_scores", {})
        for skill in cand.get("skills", []):
            name = skill.get("name")
            if skill.get("proficiency") == "expert" and name in assessments:
                score = assessments[name]
                if score < 30:
                    return {
                        "rule": "Assessment Contradiction",
                        "triggered": True,
                        "confidence": 1.0,
                        "reason": f"Expert in {name} but assessment score is {score}/100."
                    }
        return {"triggered": False}

    def rule_behavioral_anomaly(self, cand):
        signals = cand.get("redrob_signals", {})
        completeness = signals.get("profile_completeness_score", 0)
        response_rate = signals.get("recruiter_response_rate", 1.0)
        
        if completeness > 98 and response_rate < 0.05:
            return {
                "rule": "Behavioral Anomaly",
                "triggered": True,
                "confidence": 0.6,
                "reason": "Perfect profile completeness but near-zero response rate."
            }
        return {"triggered": False}

    def rule_concurrent_employment(self, cand):
        history = cand.get("career_history", [])
        if len(history) < 2:
            return {"triggered": False}
            
        # Parse dates and sort
        parsed_jobs = []
        for h in history:
            start_str = h.get("start_date")
            end_str = h.get("end_date")
            if not start_str: continue
            
            try:
                start_dt = datetime.strptime(start_str, "%Y-%m-%d")
                end_dt = datetime.strptime(end_str, "%Y-%m-%d") if end_str else datetime.now()
                parsed_jobs.append((start_dt, end_dt, h.get("company", "Unknown")))
            except Exception:
                continue
                
        parsed_jobs.sort(key=lambda x: x[0])
        
        # Check overlaps
        for i in range(len(parsed_jobs) - 1):
            curr_start, curr_end, curr_comp = parsed_jobs[i]
            next_start, next_end, next_comp = parsed_jobs[i+1]
            
            if next_start < curr_end:
                overlap_days = (min(curr_end, next_end) - next_start).days
                if overlap_days > 90:  # More than 3 months overlap
                    return {
                        "rule": "Timeline Overlap",
                        "triggered": True,
                        "confidence": 1.0,
                        "reason": f"Overlapping employment at {curr_comp} and {next_comp} (>3 months)."
                    }
        return {"triggered": False}

    def rule_keyword_stuffing(self, cand, features):
        career_relevance = features.get("career_relevance_score", 0.0)
        
        summary = cand.get("profile", {}).get("summary", "").lower()
        if not summary: return {"triggered": False}
        
        words = len(summary.split())
        if words < 20: return {"triggered": False}
        
        skill_count = len(cand.get("skills", []))
        
        if skill_count > 15 and career_relevance < 0.20:
            return {
                "rule": "Keyword Stuffing",
                "triggered": True,
                "confidence": 1.0,
                "reason": f"High skill count ({skill_count}) but low contextual career relevance."
            }
        return {"triggered": False}
