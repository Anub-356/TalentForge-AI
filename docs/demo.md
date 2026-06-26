# TalentForge AI Demo Notes

The sandbox notebook in `sandbox_demo.ipynb` is the release demo artifact referenced in `submission_metadata.yaml`.

Sample run:

```powershell
python rank.py --candidates ./samples/sample_candidates.jsonl --out ./sample_submission.csv
```

Local app:

```powershell
python -m pip install -r backend/requirements.txt
python -m uvicorn backend.main:app --port 8000
```

```powershell
cd frontend
npm run dev
```
