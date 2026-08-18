import json
import sys
import os

def add_job_entry(json_filepath):
    if not os.path.exists(json_filepath):
        print(f"[ERROR] File not found: {json_filepath}")
        sys.exit(1)

    with open(json_filepath, 'r', encoding='utf-8') as f:
        job = json.load(f)

    job_id = job.get("id")
    if not job_id:
        print("[ERROR] Job JSON must contain an 'id' field!")
        sys.exit(1)

    # 1. Update jobDetails.json
    details_file = "src/data/jobDetails.json"
    if os.path.exists(details_file):
        with open(details_file, 'r', encoding='utf-8') as f:
            details_data = json.load(f)
    else:
        details_data = {}

    details_data[job_id] = job

    with open(details_file, 'w', encoding='utf-8') as f:
        json.dump(details_data, f, indent=2, ensure_ascii=False)

    print(f"[SUCCESS] Saved '{job_id}' to jobDetails.json")

    # 2. Check duplicate in jobsData.ts
    jobs_file = "src/data/jobsData.ts"
    with open(jobs_file, 'r', encoding='utf-8') as f:
        jobs_text = f.read()

    if f'"id": "{job_id}"' not in jobs_text:
        qual_val = "See eligibility"
        for h in job.get("highlights", []):
            if "qualification" in h.get("label", "").lower():
                qual_val = h.get("value", "")
                break

        # Determine posting date (d) and actual closing date (l)
        dates = job.get("importantDates", [])
        post_date = "Today"
        last_date = "See details"
        
        if dates:
            post_date = dates[0].get("date", "Today")
            closing_found = False
            for dt in dates:
                ev = dt.get("event", "").lower()
                if any(k in ev for k in ["last date", "closing", "end date", "submission", "deadline", "walk-in"]):
                    last_date = dt.get("date", "")
                    closing_found = True
                    break
            if not closing_found and len(dates) > 1:
                last_date = dates[-1].get("date", "See details")

        summary_entry = {
            "id": job_id,
            "b": job.get("board", ""),
            "t": job.get("title", ""),
            "d": post_date,
            "l": last_date,
            "a": job.get("advtNo", ""),
            "q": qual_val,
            "desc": job.get("overview", [""])[0],
            "u": job.get("urls", [{}])[0].get("url", "") if job.get("urls") else "https://cetonline.karnataka.gov.in/kea/"
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
