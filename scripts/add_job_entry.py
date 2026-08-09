import sys
import os
import json
import re

def add_job_entry(json_file_path):
    if not os.path.exists(json_file_path):
        print(f"Error: File {json_file_path} not found.")
        sys.exit(1)

    with open(json_file_path, 'r', encoding='utf-8') as f:
        job = json.load(f)

    job_id = job.get("id")
    if not job_id:
        print("Error: 'id' is required in job JSON.")
        sys.exit(1)

    # 1. Check duplicate in jobDetails.json
    details_file = "src/data/jobDetails.json"
    with open(details_file, 'r', encoding='utf-8') as f:
        job_details = json.load(f)

    if job_id in job_details:
        print(f"[INFO] Job ID '{job_id}' is already present in jobDetails.json. Updating entry.")
    
    job_details[job_id] = job
    with open(details_file, 'w', encoding='utf-8') as f:
        json.dump(job_details, f, indent=2, ensure_ascii=False)
    print(f"[SUCCESS] Saved '{job_id}' to jobDetails.json")

    # 2. Check duplicate in jobsData.ts
    jobs_file = "src/data/jobsData.ts"
    with open(jobs_file, 'r', encoding='utf-8') as f:
        jobs_text = f.read()

        qual_val = "See eligibility"
        for h in job.get("highlights", []):
            if "qualification" in h.get("label", "").lower():
                qual_val = h.get("value", "")
                break

        summary_entry = {
            "id": job_id,
            "b": job.get("board", ""),
            "t": job.get("title", ""),
            "d": job.get("importantDates", [{}])[0].get("date", "Today"),
            "l": job.get("importantDates", [{}, {}])[1].get("date", "See details"),
            "a": job.get("advtNo", ""),
            "q": qual_val,
            "desc": job.get("overview", [""])[0],
            "u": job.get("urls", [{}])[0].get("url", "") if job.get("urls") else "https://www.konkanrailway.com"
        }
        marker = "export const JOBS_DATA: JobEntry[] = ["
        entry_json = json.dumps(summary_entry, indent=4, ensure_ascii=False)
        new_content = jobs_text.replace(marker, f"{marker}\n  {entry_json},")
        with open(jobs_file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"[SUCCESS] Added '{job_id}' to jobsData.ts")
    else:
        print(f"[INFO] '{job_id}' already present in jobsData.ts")

    print("\nJob successfully added! Run `npx tsx scripts/post-build.ts` to pre-render site pages.")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python scripts/add_job_entry.py <path_to_job_json>")
        sys.exit(1)
    add_job_entry(sys.argv[1])
