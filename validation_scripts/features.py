# validation_scripts/features.py

import math
from datetime import datetime

def parse_date(d_str):
    if not d_str:
        return None
    try:
        return datetime.strptime(d_str, "%Y-%m-%d")
    except ValueError:
        return None

def normalize(val, min_val, max_val):
    if val is None:
        return 0.0
    val = float(val)
    if val < min_val: return 0.0
    if val > max_val: return 1.0
    if max_val == min_val: return 0.0
    return (val - min_val) / (max_val - min_val)

class FeatureExtractor:
    def __init__(self, target_job_description=None):
        self.target_jd = target_job_description or {}
        self.target_keywords = {"ai", "ml", "python", "rag", "llm", "vector", "pinecone", "embeddings", "ranking", "retrieval", "search", "recommendation"}
        self.jd_core_skills = {
            "retrieval", "ranking", "search", "relevance", "recommendation",
            "vector", "embedding", "rag", "information retrieval", 
            "learning to rank", "bm25", "pinecone", "weaviate", "faiss", 
            "ann", "semantic search", "evaluation", "python"
        }

    # -------------------------------------------------------------------------
    # Semantic Features
    # -------------------------------------------------------------------------
    def skill_match_score(self, cand):
        """
        Formula: (Count of overlapping core skills) / (Expected core skills). Maxed at 1.0.
        """
        cand_skills = {s.get("name", "").lower() for s in cand.get("skills", [])}
        overlap = self.target_keywords.intersection(cand_skills)
        # Assuming 5 matches is a perfect 1.0
        return min(len(overlap) / 5.0, 1.0)

    def keyword_overlap_score(self, cand):
        """
        Formula: Count of target keywords found in headline, summary, and career history / 10
        """
        text = ""
        prof = cand.get("profile", {})
        text += prof.get("headline", "") + " " + prof.get("summary", "")
        for exp in cand.get("career_history", []):
            text += " " + exp.get("title", "") + " " + exp.get("description", "")
        
        text = text.lower()
        found = sum(1 for k in self.target_keywords if k in text)
        return min(found / 8.0, 1.0)

    def title_alignment_score(self, cand):
        """
        Formula: 1.0 if 'AI Engineer' or 'Machine Learning', 0.8 for 'Backend', 0.5 for 'Data', etc.
        """
        title = cand.get("profile", {}).get("current_title", "").lower()
        if "ai" in title or "machine learning" in title or "ml " in title or "ml" == title:
            return 1.0
        elif "backend" in title or "software" in title:
            return 0.8
        elif "data" in title:
            return 0.7
        elif "marketing" in title or "hr" in title or "sales" in title or "accountant" in title:
            return 0.1
        return 0.3

    # -------------------------------------------------------------------------
    # Career Features
    # -------------------------------------------------------------------------
    def years_of_experience_score(self, cand):
        """
        Formula: Normalize YoE where 5 is 0.5, 9 is 1.0 (Target is 5-9 years)
        But cap at 1.0. If > 15, we might plateau at 1.0. 
        """
        yoe = cand.get("profile", {}).get("years_of_experience", 0)
        # Using 0-10 years as the [0,1] normalization scale.
        return normalize(yoe, 0, 10)

    def career_progression_score(self, cand):
        """
        Formula: Based on duration and promotions (simplified: if they have multiple roles, give slight bump, but avoid job-hoppers).
        Average duration per job. Maxed at 48 months (4 years) = 1.0.
        """
        history = cand.get("career_history", [])
        if not history: return 0.0
        durations = [h.get("duration_months", 0) for h in history if h.get("duration_months") is not None]
        avg_dur = sum(durations) / len(durations) if durations else 0
        return normalize(avg_dur, 12, 48)

    def leadership_score(self, cand):
        """
        Formula: Presence of 'lead', 'manager', 'senior', 'head' in title.
        """
        score = 0.0
        for h in cand.get("career_history", []):
            t = h.get("title", "").lower()
            if "head" in t or "director" in t or "vp" in t:
                score = max(score, 1.0)
            elif "lead" in t or "manager" in t or "staff" in t or "principal" in t:
                score = max(score, 0.8)
            elif "senior" in t or "sr." in t or "sr" in t:
                score = max(score, 0.5)
        return score

    def company_quality_score(self, cand):
        """
        Formula: Normalizing company size to a 0-1 scale. Larger isn't always better for Redrob, but size indicates scale.
        """
        size_map = {"1-10": 0.2, "11-50": 0.4, "51-200": 0.6, "201-500": 0.8, "501-1000": 1.0, "1001-5000": 1.0, "5001-10000": 0.9, "10001+": 0.8}
        size = cand.get("profile", {}).get("current_company_size", "")
        return size_map.get(size, 0.5)

    def is_jd_relevant_skill(self, skill_name):
        return skill_name.lower() in self.jd_core_skills

    def career_relevance_score(self, cand):
        """
        Formula: matched keywords / expected core skills (e.g. 6.0) normalized to 1.0
        """
        history = cand.get("career_history", [])
        if not history: return 0.0
        text = " ".join([h.get("title", "") + " " + h.get("description", "") for h in history]).lower()
        matched = sum(1 for kw in self.jd_core_skills if kw in text)
        return min(matched / 6.0, 1.0)

    # -------------------------------------------------------------------------
    # Skill Features
    # -------------------------------------------------------------------------
    def verified_skill_score(self, cand):
        """
        Formula: Average of Redrob skill assessments (for JD-relevant skills only), divided by 100.
        """
        assessments = cand.get("redrob_signals", {}).get("skill_assessment_scores", {})
        if not assessments: return 0.0
        relevant_scores = [score for skill, score in assessments.items() if self.is_jd_relevant_skill(skill)]
        if not relevant_scores: return 0.0
        avg = sum(relevant_scores) / len(relevant_scores)
        return normalize(avg, 0, 100)

    def skill_duration_score(self, cand):
        """
        Formula: Average duration_months of skills normalized to 60 months (5 years) = 1.0.
        """
        skills = cand.get("skills", [])
        if not skills: return 0.0
        durs = [s.get("duration_months", 0) for s in skills]
        avg = sum(durs) / len(durs)
        return normalize(avg, 0, 60)

    def endorsement_score(self, cand):
        """
        Formula: Total endorsements across all skills normalized (e.g., 100 endorsements = 1.0)
        """
        skills = cand.get("skills", [])
        total = sum(s.get("endorsements", 0) for s in skills)
        return normalize(total, 0, 100)

    # -------------------------------------------------------------------------
    # Behavioral Features
    # -------------------------------------------------------------------------
    def recruiter_response_score(self, cand):
        """
        Formula: recruiter_response_rate directly (already 0-1).
        """
        return cand.get("redrob_signals", {}).get("recruiter_response_rate", 0.0)

    def activity_score(self, cand):
        """
        Formula: Combinations of github_activity_score and recent logins.
        """
        github = cand.get("redrob_signals", {}).get("github_activity_score", -1)
        github_n = normalize(github, 0, 100) if github > 0 else 0.0
        return github_n

    def interview_completion_score(self, cand):
        """
        Formula: interview_completion_rate directly (already 0-1).
        """
        return cand.get("redrob_signals", {}).get("interview_completion_rate", 0.0)

    def profile_trust_score(self, cand):
        # 1. Verification Signals (Max 0.25)
        sig_score = 0.0
        if cand.get("redrob_signals", {}).get("verified_email"): sig_score += 0.10
        if cand.get("redrob_signals", {}).get("verified_phone"): sig_score += 0.05
        if cand.get("redrob_signals", {}).get("linkedin_connected"): sig_score += 0.10

        # 2. Assessment Consistency (Max 0.35)
        assess_score = 0.35 if self.verified_skill_score(cand) > 0.0 else 0.0

        # 3. Career Consistency (Max 0.25)
        career_score = 0.25
        yoe = cand.get("profile", {}).get("years_of_experience", 0)
        history_months = sum(h.get("duration_months", 0) for h in cand.get("career_history", []))
        if (yoe * 12) > (history_months + 60): 
            career_score = 0.0

        # 4. Behavioral Consistency (Max 0.15)
        completeness = cand.get("redrob_signals", {}).get("profile_completeness_score", 0)
        response_rate = cand.get("redrob_signals", {}).get("recruiter_response_rate", 1.0)
        beh_score = 0.15
        if completeness > 90 and response_rate < 0.10:
            beh_score = 0.0

        return min(sig_score + assess_score + career_score + beh_score, 1.0)

    def open_to_work_score(self, cand):
        return 1.0 if cand.get("redrob_signals", {}).get("open_to_work", False) else 0.0

    def notice_period_score(self, cand):
        notice = cand.get("redrob_signals", {}).get("notice_period_days", 30)
        return max(1.0 - (notice / 60.0), 0.0)

    def relocation_score(self, cand):
        return 1.0 if cand.get("redrob_signals", {}).get("willing_to_relocate", False) else 0.0

    def response_time_score(self, cand):
        hours = cand.get("redrob_signals", {}).get("response_time_hours", 24)
        return max(1.0 - (hours / 48.0), 0.0)

    def last_active_score(self, cand):
        days = cand.get("redrob_signals", {}).get("days_since_last_active", 0)
        return math.exp(-days / 90.0)

    def availability_score(self, cand):
        otw = self.open_to_work_score(cand)
        notice = self.notice_period_score(cand)
        reloc = self.relocation_score(cand)
        resp_time = self.response_time_score(cand)
        resp_rate = self.recruiter_response_score(cand)
        active = self.last_active_score(cand)
        
        return (otw * 0.2 + notice * 0.15 + reloc * 0.1 + resp_time * 0.15 + resp_rate * 0.2 + active * 0.2)

    # -------------------------------------------------------------------------
    # Education Features
    # -------------------------------------------------------------------------
    def education_tier_score(self, cand):
        """
        Formula: tier_1 = 1.0, tier_2 = 0.75, tier_3 = 0.5, tier_4 = 0.25, unknown = 0.0
        """
        tier_map = {"tier_1": 1.0, "tier_2": 0.75, "tier_3": 0.5, "tier_4": 0.25, "unknown": 0.1}
        ed = cand.get("education", [])
        if not ed: return 0.1
        best_tier = max([tier_map.get(e.get("tier", "unknown"), 0.1) for e in ed])
        return best_tier

    def certification_score(self, cand):
        """
        Formula: Count of certifications. >=2 is 1.0.
        """
        certs = cand.get("certifications", [])
        return normalize(len(certs), 0, 2)

    def extract_all(self, cand):
        return {
            "skill_match_score": self.skill_match_score(cand),
            "keyword_overlap_score": self.keyword_overlap_score(cand),
            "title_alignment_score": self.title_alignment_score(cand),
            "years_of_experience": self.years_of_experience_score(cand),
            "career_progression_score": self.career_progression_score(cand),
            "leadership_score": self.leadership_score(cand),
            "company_quality_score": self.company_quality_score(cand),
            "career_relevance_score": self.career_relevance_score(cand),
            "verified_skill_score": self.verified_skill_score(cand),
            "skill_duration_score": self.skill_duration_score(cand),
            "endorsement_score": self.endorsement_score(cand),
            "recruiter_response_score": self.recruiter_response_score(cand),
            "activity_score": self.activity_score(cand),
            "interview_completion_score": self.interview_completion_score(cand),
            "profile_trust_score": self.profile_trust_score(cand),
            "education_tier_score": self.education_tier_score(cand),
            "certification_score": self.certification_score(cand),
            "availability_score": self.availability_score(cand)
        }
