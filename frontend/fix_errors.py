import os
import re

FRONTEND_DIR = r"c:\Users\Avaz\Desktop\biology\frontend\src"

def patch_file(filepath, replacements):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content
    for old, new in replacements:
        new_content = new_content.replace(old, new)
        
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Patched {filepath}")

# 1. Fix Sidebar.tsx - Settings and Admin should only be visible to SUPER_ADMIN
sidebar_path = os.path.join(FRONTEND_DIR, "components", "Sidebar.tsx")
patch_file(sidebar_path, [
    (
        'if ((item.name === "Sozlamalar" || item.name === "Profilim") && !isAuthenticated) return null;',
        'if ((item.name === "Sozlamalar" || item.name === "Admin") && userRole !== "SUPER_ADMIN") return null;\n          if (item.name === "Profilim" && !isAuthenticated) return null;'
    )
])

# 2. Fix achievements page
achievements_path = os.path.join(FRONTEND_DIR, "app", "(dashboard)", "achievements", "page.tsx")
patch_file(achievements_path, [
    ('if (res.ok) setAchievements(data);', 'if (res.ok) setAchievements(Array.isArray(data) ? data : data?.achievements || []);')
])

# 3. Fix books page
books_path = os.path.join(FRONTEND_DIR, "app", "(dashboard)", "books", "page.tsx")
patch_file(books_path, [
    ('{books.map((book) => (', '{(Array.isArray(books) ? books : []).map((book) => (')
])

# 4. Fix glossary page
glossary_path = os.path.join(FRONTEND_DIR, "app", "(dashboard)", "glossary", "page.tsx")
patch_file(glossary_path, [
    ('const filteredTerms = terms.filter', 'const filteredTerms = (Array.isArray(terms) ? terms : []).filter')
])

# 5. Fix goals page
goals_path = os.path.join(FRONTEND_DIR, "app", "(dashboard)", "goals", "page.tsx")
patch_file(goals_path, [
    ('{goals.map((goal, idx) => (', '{(Array.isArray(goals) ? goals : []).map((goal, idx) => (')
])

# 6. Fix models page
models_path = os.path.join(FRONTEND_DIR, "app", "(dashboard)", "models", "page.tsx")
patch_file(models_path, [
    ('{models.map((model, idx) => (', '{(Array.isArray(models) ? models : []).map((model, idx) => (')
])

print("All safety patches applied!")
