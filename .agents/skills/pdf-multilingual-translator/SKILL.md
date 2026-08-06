---
name: pdf-multilingual-translator
description: Capability to read, process, OCR-render, and translate government vacancy notifications and official PDFs written in Indian regional languages (Hindi, Kannada, Marathi) into English.
---

# Multilingual PDF Reading & Translation Skill (Hindi, Kannada, Marathi)

Use this skill whenever a PDF notice or document is provided in Hindi (हिन्दी), Kannada (ಕನ್ನಡ), or Marathi (मराठी) to accurately read the contents, translate regional technical terms into English, and produce standardized recruitment metadata.

## Supported Languages
- **Hindi (हिन्दी)**: Devanagari script (e.g. भर्ती, पद, पात्रता, आयु सीमा, आवेदन शुल्क, अंतिम तिथि)
- **Kannada (ಕನ್ನಡ)**: Kannada script (e.g. ನೇಮಕಾತಿ, ಹುದ್ದೆಗಳು, ಅರ್ಹತೆ, ವಯೋಮಿತಿ, ಅರ್ಜಿ ಶುಲ್ಕ, ಕೊನೆಯ ದಿನಾಂಕ)
- **Marathi (मराठी)**: Devanagari script (e.g. भरती, पदे, पात्रता, वयोमर्यादा, अर्ज शुल्क, अंतिम दिनांक)

## Capabilities & Steps

### Step 1: Text & Image Extraction
1. **Digital PDFs with Text Layer**: Extract native UTF-8 Unicode text without stripping non-ASCII characters.
2. **Scanned / Image PDFs**: Use PyMuPDF `fitz` to render pages to high-resolution PNG images (`page.get_pixmap(dpi=150)`), then view via multimodal inspection.

### Step 2: Key Domain Term Translation Glossary
- **Hindi / Marathi**:
  - भर्ती / भरती → Recruitment / Vacancy Notice
  - पद / पदे → Post(s) / Designation
  - कुल पद → Total Posts
  - शैक्षिक योग्यता / शैक्षणिक पात्रता → Educational Qualification
  - आयु सीमा / वयोमर्यादा → Age Limit
  - आवेदन शुल्क / अर्ज शुल्क → Application Fee
  - अंतिम तिथि / अंतिम दिनांक → Last Date to Apply
  - वेतनमान / वेतन श्रेणी → Pay Scale / Salary
- **Kannada**:
  - ನೇಮಕಾತಿ ಸೂಚನೆ → Recruitment Notification
  - ಹುದ್ದೆಗಳ ಹೆಸರು / ಶೀರ್ಷಿಕೆ → Post Title / Designation
  - ಒಟ್ಟು ಹುದ್ದೆಗಳು → Total Vacancies
  - ಶೈಕ್ಷಣಿಕ ಅರ್ಹತೆ → Educational Qualification
  - ವಯೋಮಿತಿ → Age Limit
  - ಅರ್ಜಿ ಶುಲ್ಕ → Application Fee
  - ಅರ್ಜಿ ಸಲ್ಲಿಸಲು ಕೊನೆಯ ದಿನಾಂಕ → Last Date to Apply
  - ವೇತನ ಶ್ರೇಣಿ → Pay Scale / Salary

### Step 3: English Normalization
1. Translate all job titles, board/department names, and qualification requirements into clear, standard English (e.g. "सहायक प्राध्यापक" → "Assistant Professor", "कनिष्ठ अभियंता" → "Junior Engineer", "ಸಹಾಯಕ ಇಂಜಿನಿಯರ್" → "Assistant Engineer").
2. Format dates into standard DD-MM-YYYY / YYYY-MM-DD.
3. Map qualifications to standard site qualification categories (`10th Pass`, `12th Pass`, `Diploma`, `BE/B.Tech`, `MBBS/Doctor`, `Nursing/GNM/ANM`, `Pharmacist/B.Pharm`, `Post Graduate`, `PhD`).
