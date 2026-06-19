import sys

path = r'c:\Users\user\Documents\AI HR 2026\js\app.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# I only want to replace instances that I leaked inside PreAssessment().
# To be safe, I'll only replace within PreAssessment body.

start_idx = content.find('function PreAssessment()')
if start_idx != -1:
    pre_content = content[:start_idx]
    post_content = content[start_idx:]
    
    post_content = post_content.replace(r'\`', '`').replace(r'\${', '${')
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(pre_content + post_content)
    print("Fixed!")
else:
    print("PreAssessment not found!")
