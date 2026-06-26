# Official Redrob Challenge Dataset Notes

The released challenge bundle includes the official candidate dataset at:

```text
dataset/inner_dataset/[PUB] India_runs_data_and_ai_challenge/India_runs_data_and_ai_challenge/candidates.jsonl
```

The checked-in sample input is:

```text
samples/sample_candidates.jsonl
```

Canonical submission command:

```powershell
python rank.py --candidates "./dataset/inner_dataset/[PUB] India_runs_data_and_ai_challenge/India_runs_data_and_ai_challenge/candidates.jsonl" --out ./submission.csv
```

Sample smoke test:

```powershell
python rank.py --candidates ./samples/sample_candidates.jsonl --out ./sample_submission.csv
```
