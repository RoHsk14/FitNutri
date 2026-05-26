import re

with open('supabase/migrations/00010_ms_exercises_complete.sql', 'r') as f:
    sql = f.read()

old_insert = "insert into fit_exercises (name, primary_muscle, synergist_muscles, mechanics, equipment, ms_video_url)"
new_insert = "insert into fit_exercises (name, muscle_group, description, video_url, primary_muscle, synergist_muscles, mechanics, equipment, ms_video_url)"
sql = sql.replace(old_insert, new_insert)

# Fix each data row: add muscle_group (copy of primary_muscle), description (empty), video_url (copy of ms_video_url)
# Old: ('Name', 'Muscle', '{}', 'MECH', 'EQ', 'url')
# New: ('Name', 'Muscle', '', 'url', 'Muscle', '{}', 'MECH', 'EQ', 'url')

count = 0
def fix_row(line):
    global count
    # Match: ('val1', 'val2', 'val3', 'val4', 'val5', 'val6'),
    m = re.match(r"\s*\('([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)'\)[,;]", line)
    if not m:
        return line
    name, muscle, syn, mech, equip, url = m.groups()
    count += 1
    indent = line[:len(line) - len(line.lstrip())]
    return f"{indent}('{name}', '{muscle}', '', '{url}', '{muscle}', '{syn}', '{mech}', '{equip}', '{url}'),"

lines = sql.split('\n')
fixed = []
for line in lines:
    fixed.append(fix_row(line.rstrip()))

print(f"Fixed {count} rows")

with open('supabase/migrations/00010_ms_exercises_complete.sql', 'w') as f:
    f.write('\n'.join(fixed))

print("Fixed!")
