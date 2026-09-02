import json
import sys
import os
import re
import datetime

MONTHS_MAP = {
    '01': 'January', '02': 'February', '03': 'March', '04': 'April',
    '05': 'May', '06': 'June', '07': 'July', '08': 'August',
    '09': 'September', '10': 'October', '11': 'November', '12': 'December',
    '1': 'January', '2': 'February', '3': 'March', '4': 'April',
    '5': 'May', '6': 'June', '7': 'July', '8': 'August',
    '9': 'September'
}

def format_date_str(s):
    if not isinstance(s, str):
        return s
    def repl(m):
        d, mon, y = m.group(1), m.group(2), m.group(3)
        mon_name = MONTHS_MAP.get(mon, mon)
        return f"{int(d):02d} {mon_name} {y}"
    # match DD.MM.YYYY or DD/MM/YYYY
    return re.sub(r'\b([0-3]?[0-9])[\./]([0-1]?[0-9])[\./](202[4-9])\b', repl, s)

def normalize_job_dates(job):
    if "importantDates" in job and isinstance(job["importantDates"], list):
        for item in job["importantDates"]:
            if "date" in item:
                item["date"] = format_date_str(item["date"])
    if "highlights" in job and isinstance(job["highlights"], list):
        for h in job["highlights"]:
            if "date" in h.get("label", "").lower() and "value" in h:
                h["value"] = format_date_str(h["value"])
    return job

def update_job_entry(json_filepath):
    if not os.path.exists(json_filepath):
        print(f"[ERROR] File not found: {json_filepath}")
        sys.exit(1)

    with open(json_filepath, 'r', encoding='utf-8') as f:
        job = json.load(f)

    job = normalize_job_dates(job)

    job_id = job.get("id")
    if not job_id:
        print("[ERROR] Job JSON must contain an 'id' field!")
        sys.exit(1)

    # 1. Update src/data/jobDetails.json
    details_file = "src/data/jobDetails.json"
    if os.path.exists(details_file):
        with open(details_file, 'r', encoding='utf-8') as f:
            details_data = json.load(f)
    else:
        details_data = {}

    details_data[job_id] = job

    with open(details_file, 'w', encoding='utf-8') as f:
        json.dump(details_data, f, indent=2, ensure_ascii=False)

    print(f"[SUCCESS] Updated '{job_id}' in jobDetails.json")

    # 2. Update src/data/jobsData.ts
    jobs_file = "src/data/jobsData.ts"
    with open(jobs_file, 'r', encoding='utf-8') as f:
        jobs_text = f.read()

    qual_val = "See eligibility"
    for h in job.get("highlights", []):
        if "qualification" in h.get("label", "").lower() or "education" in h.get("label", "").lower():
            qual_val = h.get("value", "")
            break

    if qual_val == "See eligibility" and "eligibility" in job:
        edu = job["eligibility"].get("education", [])
        if edu and isinstance(edu, list):
            qual_val = edu[0][:120]

    # Determine posting date (d) and actual application closing date (l)
    dates = job.get("importantDates", [])
    post_date = "Today"
    last_date = "See details"
    
    if dates:
        post_date = dates[0].get("date", "Today")
        closing_found = False
        for dt in dates:
            ev = dt.get("event", "").lower()
            if any(k in ev for k in ["start", "commence", "release", "opening", "begins"]):
                continue
            if any(k in ev for k in ["last date", "closing", "end date", "deadline", "walk-in", "receipt", "submission"]):
                last_date = dt.get("date", "")
                closing_found = True
                break
        if not closing_found and len(dates) > 1:
            last_date = dates[-1].get("date", "See details")

    desc_val = ""
    overview = job.get("overview", [])
    if isinstance(overview, list) and len(overview) > 0:
        desc_val = overview[0]
    elif isinstance(overview, str):
        desc_val = overview

    url_val = ""
    if job.get("urls"):
        url_val = job["urls"][0].get("url", "")

    summary_entry = {
        "id": job_id,
        "b": job.get("board", ""),
        "t": job.get("title", ""),
        "d": post_date,
        "l": last_date,
        "a": job.get("advtNo", ""),
        "q": qual_val,
        "desc": desc_val,
        "u": url_val
    }

    entry_str = json.dumps(summary_entry, indent=4, ensure_ascii=False)
    pattern = r'\{\s*\"id\":\s*\"' + re.escape(job_id) + r'\"[\s\S]*?\}(?:,\s*)?'

    if re.search(pattern, jobs_text):
        new_jobs_text = re.sub(pattern, entry_str + ',\n  ', jobs_text, count=1)
        with open(jobs_file, 'w', encoding='utf-8') as f:
            f.write(new_jobs_text)
        print(f"[SUCCESS] Replaced existing entry for '{job_id}' in jobsData.ts")
    else:
        marker = "export const JOBS_DATA: JobEntry[] = ["
        new_jobs_text = jobs_text.replace(marker, f"{marker}\n  {entry_str},")
        with open(jobs_file, 'w', encoding='utf-8') as f:
            f.write(new_jobs_text)
        print(f"[SUCCESS] Added new summary entry for '{job_id}' in jobsData.ts")

    # 3. Update src/data/jobUploadDates.json (ensure key exists)
    upload_dates_file = "src/data/jobUploadDates.json"
    if os.path.exists(upload_dates_file):
        try:
            with open(upload_dates_file, 'r', encoding='utf-8') as f:
                upload_dates = json.load(f)
        except Exception:
            upload_dates = {}
        if job_id not in upload_dates:
            upload_dates[job_id] = datetime.datetime.now().strftime("%Y-%m-%d")
            with open(upload_dates_file, 'w', encoding='utf-8') as f:
                json.dump(upload_dates, f, indent=2, ensure_ascii=False)

    print(f"\n[JOB UPDATED SUCCESSFULLY]")
    print(f"- Job ID: {job_id}")
    print(f"- Title: {job.get('title')}")
    print(f"- Last Date (l): {last_date}")
    print(f"- Vacancies: {job.get('vacancies')}")
    print(f"\nNext step: Run `npm run build` to pre-render updated pages.")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python scripts/update_job_entry.py <path_to_job_json>")
        sys.exit(1)
    update_job_entry(sys.argv[1])
