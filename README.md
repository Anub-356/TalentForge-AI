# TalentForge AI

TalentForge AI is a Redrob India Runs Data & AI Challenge submission that produces a deterministic top-100 candidate ranking from the released `candidates.jsonl` file and exposes a separate demo web app for recruiter and candidate views.

## Repository Layout

- `rank.py` - official submission entrypoint
- `validation_scripts/` - local ranking helpers used by `rank.py`
- `samples/` - sample candidate input and sample submission artifacts
- `dataset/inner_dataset/[PUB] India_runs_data_and_ai_challenge/India_runs_data_and_ai_challenge/` - official challenge bundle
- `backend/` and `frontend/` - demo application
- `submission_metadata.yaml` - submission metadata in the official template format

## Canonical Submission Command

From a fresh clone, generate the submission CSV with:

```powershell
python rank.py --candidates "./dataset/inner_dataset/[PUB] India_runs_data_and_ai_challenge/India_runs_data_and_ai_challenge/candidates.jsonl" --out ./submission.csv
```

This command is the canonical reproduction path for the hackathon submission.

## Validate Locally

Run the official validator against the generated CSV:

```powershell
python ".\dataset\inner_dataset\[PUB] India_runs_data_and_ai_challenge\India_runs_data_and_ai_challenge\validate_submission.py" .\submission.csv
```

## Sample Run

For a small local smoke test:

```powershell
python rank.py --candidates ./samples/sample_candidates.jsonl --out ./sample_submission.csv
```

## Demo App

The web app is separate from the ranking submission.

Backend:

```powershell
python -m pip install -r backend/requirements.txt
python -m uvicorn backend.main:app --port 8000
```

Frontend:

```powershell
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:3000`.

## Environment

Copy `.env.example` to `.env` for local development. Do not commit secrets to the repository.

## Notes

- The official dataset path is the nested `dataset/inner_dataset/.../candidates.jsonl` file included in the challenge bundle.
- `samples/sample_candidates.jsonl` is the checked-in sample input for quick verification.
- Demo metrics in the web UI are illustrative and are not part of the ranking submission.
