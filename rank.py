import argparse
import json
import csv
import heapq
import sys
import os

# Ensure the validation_scripts directory is in the path for portable imports
current_dir = os.path.dirname(os.path.abspath(__file__))
scripts_dir = os.path.join(current_dir, "validation_scripts")
if scripts_dir not in sys.path:
    sys.path.append(scripts_dir)

from ranking_engine import RankingEngine

def main():
    parser = argparse.ArgumentParser(description="TalentForge AI - Challenge Submission Pipeline")
    parser.add_argument("--candidates", required=True, help="Path to input jsonl file containing candidates")
    parser.add_argument("--out", required=True, help="Path to output csv file")
    args = parser.parse_args()

    # Initialize the ranking engine with the new Phase 1 weightings
    engine = RankingEngine()
    
    # We will use a min-heap to keep the top 100 candidates.
    # Python's heapq is a min-heap, so we push (score, cand_id, reasoning).
    # This means the smallest element is at index 0.
    top_100_heap = []

    print(f"Loading candidates from {args.candidates}...")
    
    if not os.path.exists(args.candidates):
        print(f"Error: Could not find {args.candidates}")
        sys.exit(1)

    try:
        count = 0
        with open(args.candidates, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                
                cand = json.loads(line)
                cand_id = cand.get("candidate_id", "unknown")
                
                res = engine.score_candidate(cand)
                score = res["final_score"]
                reasoning = res["reasoning"]
                
                if len(top_100_heap) < 100:
                    heapq.heappush(top_100_heap, (score, cand_id, reasoning))
                else:
                    if score > top_100_heap[0][0]:
                        heapq.heapreplace(top_100_heap, (score, cand_id, reasoning))
                
                count += 1
                if count % 1000 == 0:
                    print(f"Processed {count} candidates...")
                    
    except Exception as e:
        print(f"Error processing candidates: {e}")
        sys.exit(1)

    print(f"Ranking complete. Evaluated {count} candidates.")
    print(f"Writing top {len(top_100_heap)} candidates to {args.out}...")
    
    # Sort top candidates: primary score descending (-x[0]), secondary candidate_id ascending (x[1])
    top_candidates = sorted(top_100_heap, key=lambda x: (-x[0], x[1]))
    
    try:
        with open(args.out, "w", encoding="utf-8", newline="") as out_f:
            writer = csv.writer(out_f)
            # Challenge specification strictly requires: candidate_id, rank, score, reasoning
            writer.writerow(["candidate_id", "rank", "score", "reasoning"])
            for idx, (score, cand_id, reasoning) in enumerate(top_candidates):
                rank = idx + 1
                writer.writerow([cand_id, rank, f"{score:.6f}", reasoning])
    except Exception as e:
        print(f"Error writing to output file: {e}")
        sys.exit(1)
        
    print(f"Submission successfully generated at {args.out}")

if __name__ == "__main__":
    main()
