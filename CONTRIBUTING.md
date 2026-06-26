# 🤝 Contributing to TalentForge AI

Thank you for your interest in contributing to **TalentForge AI**, the evidence-based hiring intelligence platform built for the Redrob India Runs Data & AI Challenge.

---

## 🛠️ Repository & Development Setup

> [!IMPORTANT]
> Per team workspace standards on Windows, always utilize `py` instead of `python`.

### Prerequisites
* **Python:** v3.10 or higher
* **Node.js:** v18 or higher
* **PostgreSQL:** v15+ (with `pgvector` extension enabled)

### Unified Dependency Installation
```powershell
# Install root orchestration & backend dependencies
pip install -r requirements.txt

# Install frontend UI dependencies
cd frontend
npm install
```

---

## 🚀 Running Local Subsystems

### 1. Enterprise Backend REST API
```powershell
cd backend
py main.py
```

### 2. Recruiter Command Center (Web UI)
```powershell
cd frontend
npm run dev
```

### 3. Standalone Challenge Ranking CLI (`rank.py`)
To evaluate candidate datasets offline without starting database servers:
```powershell
py rank.py --candidates ./samples/sample_candidates.jsonl --out ./submission.csv
```

---

## 📐 Coding Standards & Verification
* **Python:** Adhere to PEP 8 formatting. Ensure streaming memory limits ($<512\text{ MB}$) are maintained for all data processing routines.
* **Tie-Breaking:** Any modification to scoring logic must preserve strict deterministic tie-breaking (`-score`, `candidate_id` ascending).
* **Validation:** Before submitting a pull request, verify your output CSV against official judging validators:
  ```powershell
  py validation_scripts/validate_submission.py submission.csv
  ```
