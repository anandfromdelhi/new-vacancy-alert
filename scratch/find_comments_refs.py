import os, re

src_dir = 'src'
results = []

for root, dirs, files in os.walk(src_dir):
    for file in files:
        if file.endswith(('.ts', '.tsx', '.js', '.jsx', '.css')):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            if 'CommentsSection' in content or 'comment' in content.lower():
                # find lines
                lines = content.split('\n')
                for i, line in enumerate(lines):
                    if 'commentssection' in line.lower() or 'supabase' in line.lower() and 'comment' in line.lower() or 'admin' in line.lower() and 'comment' in line.lower():
                        results.append(f"{filepath}:{i+1}: {line.strip()}")

print(f"Total matching lines found: {len(results)}")
for r in results[:30]:
    print(r)
