for lib in ['pypdf', 'PyPDF2', 'fitz', 'pdfplumber', 'pypdfium2', 'pdfminer']:
    try:
        __import__(lib)
        print(f"[OK] {lib} is installed")
    except ImportError:
        print(f"[NO] {lib} is NOT installed")
