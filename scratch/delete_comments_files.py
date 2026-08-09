import os

files = [
    'src/components/CommentsSection.tsx',
    'src/pages/AdminPage.tsx'
]

for f in files:
    if os.path.exists(f):
        os.remove(f)
        print('Deleted:', f)
    else:
        print('Not found:', f)
