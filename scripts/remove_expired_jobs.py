import json
import os
import re
import sys
import argparse
from datetime import datetime

MONTHS = {
    'jan': 1, 'january': 1,
    'feb': 2, 'february': 2,
    'mar': 3, 'march': 3,
    'apr': 4, 'april': 4,
    'may': 5,
    'jun': 6, 'june': 6,
    'jul': 7, 'july': 7,
    'aug': 8, 'august': 8,
    'sep': 9, 'september': 9, 'sept': 9,
    'oct': 10, 'october': 10,
    'nov': 11, 'november': 11,
    'dec': 12, 'december': 12
}

def parse_date(date_str):
    if not date_str or not isinstance(date_str, str):
        return None
    s = date_str.strip().lower()
    
    # Ignore non-specific or flexible dates (do NOT accidentally expire these)
    if any(kw in s for kw in [
        'see details', 'see eligibility', 'walk-in', 'ongoing', 'various',
        'interview', 'tba', 'notify soon', 'announcement', 'refer official',
        'refer notification', 'publication'
    ]):
        return None

    # 1. DD Month YYYY (e.g. 28 September 2026, 05-Aug-2026, 1st July 2026)
    m = re.search(r'(\d{1,2})(?:st|nd|rd|th)?[\s\-\/]+([a-z]+)[\s\-\/]+(\d{4})', s)
    if m:
        day = int(m.group(1))
        mon_str = m.group(2)[:3]
        year = int(m.group(3))
        if mon_str in MONTHS and 1 <= day <= 31:
            try:
                return datetime(year, MONTHS[mon_str], day)
            except ValueError:
                pass

    # 2. Month DD, YYYY (e.g. September 28, 2026)
    m = re.search(r'([a-z]+)[\s\-\/]+(\d{1,2})(?:st|nd|rd|th)?[\s\-\/,]+(\d{4})', s)
    if m:
        mon_str = m.group(1)[:3]
        day = int(m.group(2))
        year = int(m.group(3))
        if mon_str in MONTHS and 1 <= day <= 31:
            try:
                return datetime(year, MONTHS[mon_str], day)
            except ValueError:
                pass

    # 3. Numeric DD/MM/YYYY or DD-MM-YYYY
    m = re.search(r'(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})', s)
    if m:
        day = int(m.group(1))
        mon = int(m.group(2))
        year = int(m.group(3))
        if 1 <= mon <= 12 and 1 <= day <= 31:
            try:
                return datetime(year, mon, day)
            except ValueError:
                pass

    # 4. Numeric YYYY-MM-DD
    m = re.search(r'(\d{4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})', s)
    if m:
        year = int(m.group(1))
        mon = int(m.group(2))
        day = int(m.group(3))
        if 1 <= mon <= 12 and 1 <= day <= 31:
            try:
                return datetime(year, mon, day)
            except ValueError:
                pass

    return None

def get_job_last_date(job_summary, job_detail):
    # First check 'l' in job_summary
    l_str = job_summary.get('l', '')
    dt = parse_date(l_str)
    if dt:
        return dt, l_str

    # If not parseable from summary 'l', check importantDates in job_detail
    if job_detail and 'importantDates' in job_detail:
        dates = job_detail.get('importantDates', [])
        for item in dates:
            ev = item.get('event', '').lower()
            if any(k in ev for k in ['last date', 'closing', 'end date', 'submission', 'deadline', 'receipt']):
                dt = parse_date(item.get('date', ''))
                if dt:
                    return dt, item.get('date', '')
        # Fallback to last date entry
        if dates and len(dates) > 1:
            dt = parse_date(dates[-1].get('date', ''))
            if dt:
                return dt, dates[-1].get('date', '')

    return None, l_str

def parse_jobs_data_ts(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract all JSON-like objects in the JOBS_DATA array
    # Look for { "id": "...", ... }
    job_blocks = []
    pattern = re.compile(r'(\{\s*\"id\":\s*\"([^\"]+)\"[\s\S]*?\})(?:,\s*|\s*\];)', re.MULTILINE)
    
    for match in pattern.finditer(content):
        block_text = match.group(1)
        job_id = match.group(2)
        try:
            job_obj = json.loads(block_text)
            job_blocks.append((job_id, job_obj, block_text))
        except Exception:
            # Fallback regex extraction if strict JSON parse fails
            l_match = re.search(r'\"l\":\s*\"([^\"]*)\"', block_text)
            t_match = re.search(r'\"t\":\s*\"([^\"]*)\"', block_text)
            b_match = re.search(r'\"b\":\s*\"([^\"]*)\"', block_text)
            job_obj = {
                'id': job_id,
                'l': l_match.group(1) if l_match else '',
                't': t_match.group(1) if t_match else '',
                'b': b_match.group(1) if b_match else ''
            }
            job_blocks.append((job_id, job_obj, block_text))

    return job_blocks, content

def remove_expired_jobs(apply_changes=False, grace_days=0):
    root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    jobs_data_file = os.path.join(root_dir, 'src', 'data', 'jobsData.ts')
    details_file = os.path.join(root_dir, 'src', 'data', 'jobDetails.json')
    upload_dates_file = os.path.join(root_dir, 'src', 'data', 'jobUploadDates.json')
    jobs_gen_dir = os.path.join(root_dir, 'src', 'data', 'jobs-generated')
    public_jobs_gen_dir = os.path.join(root_dir, 'public', 'data', 'jobs-generated')

    if not os.path.exists(jobs_data_file):
        print(f"[ERROR] Cannot find {jobs_data_file}")
        sys.exit(1)

    details_data = {}
    if os.path.exists(details_file):
        with open(details_file, 'r', encoding='utf-8') as f:
            try:
                details_data = json.load(f)
            except Exception as e:
                print(f"[WARN] Error reading jobDetails.json: {e}")

    job_blocks, ts_content = parse_jobs_data_ts(jobs_data_file)
    
    today = datetime.now()
    today_date_only = datetime(today.year, today.month, today.day)

    expired_jobs = []
    active_jobs = []

    for job_id, job_summary, block_raw in job_blocks:
        job_detail = details_data.get(job_id)
        last_dt, last_str = get_job_last_date(job_summary, job_detail)

        if last_dt:
            # Calculate difference in days
            delta = (today_date_only - last_dt).days
            if delta > grace_days: # Expired before today (or past grace days)
                expired_jobs.append({
                    'id': job_id,
                    'title': job_summary.get('t', ''),
                    'board': job_summary.get('b', ''),
                    'lastDate': last_str,
                    'parsedDate': last_dt.strftime('%Y-%m-%d'),
                    'daysExpired': delta,
                    'block_raw': block_raw
                })
                continue

        active_jobs.append((job_id, job_summary, block_raw))

    print(f"\n=======================================================")
    print(f"       EXPIRED JOBS SCANNER REPORT (Fast & Safe)")
    print(f"=======================================================")
    print(f"Scan Date: {today.strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Total Jobs in jobsData.ts : {len(job_blocks)}")
    print(f"Active Jobs Remaining    : {len(active_jobs)}")
    print(f"Expired Jobs Identified  : {len(expired_jobs)}")
    print(f"=======================================================\n")

    if not expired_jobs:
        print("[INFO] No expired jobs found! All site listings are active and up to date.")
        return

    print("Sample Expired Jobs:")
    print("-" * 85)
    print(f"{'No.':<4} {'Job ID':<40} {'Last Date':<18} {'Expired (Days)':<15}")
    print("-" * 85)
    for idx, ej in enumerate(expired_jobs[:20], 1):
        jid_disp = ej['id'][:38] + '..' if len(ej['id']) > 38 else ej['id']
        print(f"{idx:<4} {jid_disp:<40} {ej['lastDate']:<18} {ej['daysExpired']:<15}")

    if len(expired_jobs) > 20:
        print(f"... and {len(expired_jobs) - 20} more expired jobs.")
    print("-" * 85)

    if not apply_changes:
        print("\n[DRY RUN COMPLETE] No files were modified.")
        print("To remove these expired jobs from the site, run:")
        print("   python scripts/remove_expired_jobs.py --apply\n")
        return

    # APPLY CHANGES
    print("\n[APPLYING REMOVALS]")
    expired_ids = {ej['id'] for ej in expired_jobs}

    # 1. Update jobsData.ts
    # Construct clean new JOBS_DATA array
    active_entries = []
    for jid, summary_obj, _ in active_jobs:
        active_entries.append(json.dumps(summary_obj, indent=4, ensure_ascii=False))

    new_ts_content = "export interface JobEntry {\n"
    new_ts_content += "  id?: string;\n"
    new_ts_content += "  d: string; // post date\n"
    new_ts_content += "  b: string; // board\n"
    new_ts_content += "  t: string; // title / posts\n"
    new_ts_content += "  q: string; // qualification\n"
    new_ts_content += "  a: string; // advt no\n"
    new_ts_content += "  l: string; // last date\n"
    new_ts_content += "  u: string; // source link\n"
    new_ts_content += "  desc?: string; // simple english description\n"
    new_ts_content += "}\n\n"
    new_ts_content += "export const JOBS_DATA: JobEntry[] = [\n  "
    new_ts_content += ",\n  ".join(active_entries)
    new_ts_content += "\n];\n"

    with open(jobs_data_file, 'w', encoding='utf-8') as f:
        f.write(new_ts_content)
    print(f" [SUCCESS] Cleaned jobsData.ts -> {len(active_jobs)} active jobs saved.")

    # 2. Update jobDetails.json
    if os.path.exists(details_file):
        for jid in expired_ids:
            if jid in details_data:
                del details_data[jid]
        with open(details_file, 'w', encoding='utf-8') as f:
            json.dump(details_data, f, indent=2, ensure_ascii=False)
        print(f" [SUCCESS] Cleaned jobDetails.json -> {len(details_data)} details remaining.")

    # 3. Update jobUploadDates.json
    if os.path.exists(upload_dates_file):
        try:
            with open(upload_dates_file, 'r', encoding='utf-8') as f:
                upload_dates = json.load(f)
            for jid in expired_ids:
                if jid in upload_dates:
                    del upload_dates[jid]
            with open(upload_dates_file, 'w', encoding='utf-8') as f:
                json.dump(upload_dates, f, indent=2, ensure_ascii=False)
            print(f" [SUCCESS] Cleaned jobUploadDates.json.")
        except Exception as e:
            print(f"[WARN] Error updating jobUploadDates.json: {e}")

    # 4. Clean generated JSON files in src/data/jobs-generated
    cleaned_gen = 0
    if os.path.exists(jobs_gen_dir):
        for jid in expired_ids:
            p = os.path.join(jobs_gen_dir, f"{jid}.json")
            if os.path.exists(p):
                try:
                    os.remove(p)
                    cleaned_gen += 1
                except Exception:
                    pass
    if os.path.exists(public_jobs_gen_dir):
        for jid in expired_ids:
            p = os.path.join(public_jobs_gen_dir, f"{jid}.json")
            if os.path.exists(p):
                try:
                    os.remove(p)
                except Exception:
                    pass
    if cleaned_gen > 0:
        print(f" [SUCCESS] Removed {cleaned_gen} generated per-job JSON files.")

    print(f"\n[SUMMARY] Successfully removed {len(expired_jobs)} expired jobs from database in milliseconds!")
    print("Next step: Run `npm run build` to update sitemap, split details, and pre-render site pages.")

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Lightning-Fast Expired Jobs Cleaner")
    parser.add_argument('--apply', action='store_true', help="Apply changes and remove expired jobs from database files")
    parser.add_argument('--grace-days', type=int, default=0, help="Grace days past last date before marking expired (default: 0)")
    args = parser.parse_args()

    remove_expired_jobs(apply_changes=args.apply, grace_days=args.grace_days)
