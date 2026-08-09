import os

src_dir = 'src'
scripts_dir = 'scripts'

for directory in [src_dir, scripts_dir]:
    for root, dirs, files in os.walk(directory):
        for file in files:
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            if 'CommentsSection' in content or 'AdminPage' in content or 'CommentItem' in content:
                print(f"Match in {filepath}")
