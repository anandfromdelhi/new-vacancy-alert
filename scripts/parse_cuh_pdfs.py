import pypdf

pdf1 = r"C:\Users\Administrator\.gemini\antigravity\brain\775724cb-d95b-4b74-b6c1-1aaa78f22116\.user_uploaded\media_1785978865962.pdf"
pdf2 = r"C:\Users\Administrator\.gemini\antigravity\brain\775724cb-d95b-4b74-b6c1-1aaa78f22116\.user_uploaded\media_1785978865982.pdf"

r1 = pypdf.PdfReader(pdf1)
r2 = pypdf.PdfReader(pdf2)

print("--- PDF 1 (CUH/02/R/T/2026) ---")
print(r1.pages[0].extract_text())

print("\n--- PDF 2 (CUH/03/R/T/2026) ---")
print(r2.pages[0].extract_text())
