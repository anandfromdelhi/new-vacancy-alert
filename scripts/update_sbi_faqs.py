import json

faqs_top_20 = [
  {
    "question": "Why are there 0 vacancies in Bihar, Jharkhand, Delhi, Haryana, Punjab, Uttarakhand, etc. in SBI Clerk 2026?",
    "answer": "Because the 1,538 vacancies in this particular notification are backlog vacancies, not the new regular vacancies for the 2026–27 recruitment cycle. A backlog vacancy generally represents a reserved-category vacancy from an earlier recruitment that remained unfilled. Therefore, the distribution is completely different from what you would expect from a normal SBI Clerk notification. Zero in Delhi/Bihar/Haryana etc. does NOT mean SBI will have zero regular Clerk vacancies there this year."
  },
  {
    "question": "Will SBI Clerk 2026 vacancies be updated or increased later?",
    "answer": "Possibly, but don't assume they will be. The current notification is specifically for the backlog drive. The much more important development for most aspirants will be the separate regular SBI Clerk notification, which should contain fresh state-wise vacancies for the new recruitment cycle. If your state has zero seats in the present notification, wait for the regular notification rather than concluding that SBI Clerk has no vacancy in your state."
  },
  {
    "question": "Why is there no vacancy in Delhi, Haryana, and NCR for SBI Clerk 2026?",
    "answer": "This is a consequence of the backlog-vacancy nature of the current recruitment. It does not mean SBI has stopped recruiting Junior Associates in Delhi/NCR or Haryana. Also remember that SBI recruitment is organized according to State/UT/circle-wise vacancies, rather than simply according to where candidates live."
  },
  {
    "question": "What should candidates from zero-vacancy states do for SBI Clerk 2026?",
    "answer": "Wait for the regular notification. If you're from Delhi, Haryana, Bihar, Jharkhand, Punjab, Uttarakhand, etc., choosing another state merely because it has backlog vacancies is not recommended unless you genuinely satisfy that state's local-language requirement and are eligible for the applicable reserved category. The regular notification is likely to be far more relevant."
  },
  {
    "question": "Can I apply for SBI Clerk 2026 from another state?",
    "answer": "Yes, subject to the notification's conditions — but the important issue is the local language. SBI's Junior Associate recruitment is state/UT based. Candidates apply for vacancies of one State/UT only and must qualify the specified local-language test (LPT) where applicable. For example, living in Delhi does not prevent you from applying for Maharashtra, but if you select Maharashtra, you must be prepared for Marathi language requirements."
  },
  {
    "question": "How strict is the Language Proficiency Test (LPT) in SBI Clerk recruitment?",
    "answer": "It is a mandatory qualifying requirement. The LPT checks whether you know the specified local language of the selected state (e.g., Marathi for Maharashtra, Gujarati for Gujarat, Tamil for Tamil Nadu, Odia for Odisha, Kannada for Karnataka, Malayalam for Kerala, Punjabi for Punjab, Bengali for West Bengal, Hindi/Urdu for UP). Candidates who cannot produce acceptable proof of having studied the specified local language in 10th or 12th standard must qualify the LPT. Failing the required LPT will result in disqualification."
  },
  {
    "question": "Will applying outside your home state automatically cause LPT problems?",
    "answer": "No. Your home state is not the deciding factor. The important question is whether you can prove/meet the language requirement of the state applied for. A candidate from Delhi could apply for Maharashtra, but if they cannot establish Marathi proficiency through standard qualification routes, they may have to take the LPT. Do not choose a state simply because it has a lower cutoff."
  },
  {
    "question": "If I apply for SBI Clerk from another state, where will my exam centre be?",
    "answer": "You can generally appear for the Preliminary and Mains examination at a notified examination centre of your choice/availability, subject to SBI's arrangements. However, your recruitment is against the state applied for. SBI's rules state that the local-language test (LPT) is conducted at a centre decided by SBI in the state applied for, at the candidate's own expense. (Exam centre ≠ state of recruitment)."
  },
  {
    "question": "How should candidates choose a state when applying for SBI Clerk?",
    "answer": "Choose the state where you genuinely satisfy the local-language requirement first; then compare vacancies and expected competition. The recommended sequence is: Language eligibility → vacancy → expected competition → posting preference. Remember that candidates are considered against the State/UT applied for and are posted in that state if selected."
  },
  {
    "question": "What is the difference between Regular and Backlog vacancies in SBI recruitment?",
    "answer": "A Regular vacancy is a newly identified vacancy for the current recruitment cycle. A Backlog vacancy is a reserved vacancy from an earlier recruitment that remained unfilled and is carried forward to be filled through a special drive. The current 1,538-post notification is specifically a backlog recruitment, which explains the unusual state-wise vacancy distribution."
  },
  {
    "question": "Can eligible candidates apply for both Regular and Backlog SBI Clerk recruitments?",
    "answer": "Yes, if you are eligible for both and SBI permits applications for both drives. They are separate recruitment drives. For example, an eligible SC/ST/OBC candidate could potentially participate in both the backlog recruitment and the upcoming regular recruitment, provided they satisfy the eligibility conditions of both."
  },
  {
    "question": "Will the exams for SBI Clerk Regular and Backlog recruitments be separate?",
    "answer": "Do not assume they will be combined. The current notification is a separate Special Recruitment Drive, so candidates should treat it as a separate recruitment unless SBI subsequently announces otherwise. Expect separate application and exam processes."
  },
  {
    "question": "Can General (Unreserved) candidates apply for these SBI Clerk backlog vacancies?",
    "answer": "No. The 1,538 backlog vacancies are reserved exclusively for SC, ST, and OBC candidates carried forward from previous recruitment drives. Unreserved / General category candidates cannot claim an SC/ST/OBC backlog seat."
  },
  {
    "question": "What is the age limit and cutoff date for SBI Clerk Special Drive 2026?",
    "answer": "For the backlog notification, the basic age requirement is 20 to 28 years as of the cut-off date specified in the official notification, plus applicable relaxations for reserved categories (5 years for SC/ST, 3 years for OBC, up to 10–15 years for PwBD). Ensure you check your exact Date of Birth against the specific cut-off date stated in the notification."
  },
  {
    "question": "Why are some states showing SC/ST vacancies but zero OBC vacancies?",
    "answer": "Because backlog vacancies are category-specific. If SBI had an SC/ST backlog in a particular state but no OBC backlog, it cannot convert or reassign those seats. A table showing SC: 0 | ST: 12 | OBC: 0 simply reflects historical unfilled reserved positions for that state, not a policy of ignoring OBC candidates."
  },
  {
    "question": "Is the SBI Clerk 2026 question paper available in English?",
    "answer": "Yes. The examination paper is provided in English along with Hindi and the relevant regional language(s) depending on the state (e.g., English/Hindi/Marathi in Maharashtra, English/Hindi/Gujarati in Gujarat, English/Hindi/Odia in Odisha, English/Hindi/Bengali in WB, English/Hindi/Urdu in UP/Bihar). The question paper medium is separate from the LPT requirement."
  },
  {
    "question": "Did SBI Apprentice recruitment reduce regular Clerk vacancies?",
    "answer": "No. There is no basis in the official notification to conclude that Apprentice recruitment reduced Clerk vacancies. SBI Apprentice and SBI Junior Associate are different recruitment streams. The 1,538-post announcement is a backlog drive, and the upcoming regular Junior Associate recruitment will provide the actual fresh vacancy numbers."
  },
  {
    "question": "Why are videos claiming 9,000 to 11,000+ vacancies when this notification says 1,538?",
    "answer": "Because numbers like 9,000 or 11,000+ circulating online represent projected estimates for the upcoming Regular recruitment cycle, whereas 1,538 is the officially notified count for the Special Backlog Drive. Do not add backlog figures to unofficial YouTube estimates; wait for SBI's official regular notification."
  },
  {
    "question": "Where can candidates download the official SBI Clerk notification PDF?",
    "answer": "The official notification should always be downloaded directly from SBI's official careers portal at sbi.bank.in/web/careers or bank.sbi/careers. Always verify the advertisement on SBI's official site rather than relying on unverified Telegram or social media files."
  },
  {
    "question": "Should students run a Twitter/X campaign regarding uneven SBI Clerk vacancies?",
    "answer": "Campaigns will not force SBI to convert reserved backlog seats into UR seats, as backlog vacancies are legally reserved carried-forward positions. If raising concerns, the appropriate request to SBI would be to clarify state-wise vacancy requirements and release the regular SBI Clerk notification with fresh vacancies at the earliest."
  }
]

def update_sbi_faqs():
    file_path = "src/data/jobDetails.json"
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    target_keys = [
        "sbi-junior-associate-clerk-recruitment-2026",
        "sbi-junior-associate-special-recruitment-drive-2026"
    ]

    updated_keys = []
    for key in target_keys:
        if key in data:
            data[key]["faqs"] = faqs_top_20
            updated_keys.append(key)

    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"[SUCCESS] Updated top 20 FAQs for keys: {updated_keys}")

if __name__ == "__main__":
    update_sbi_faqs()
