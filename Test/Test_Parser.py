import sys
import os
import glob

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from Backend.parser import parse_document

# automatically finds any pdf in ResumeIQ folder
pdf_files = glob.glob(r"E:\ResumeIQ\*.pdf")

if not pdf_files:
    print("❌ No PDF found in E:\\ResumeIQ")
    sys.exit()

pdf_path = pdf_files[0]
filename = os.path.basename(pdf_path)

print(f"Testing with: {filename}")

with open(pdf_path, "rb") as f:
    file_bytes = f.read()

result = parse_document(file_bytes, filename)

if result["success"]:
    print("✅ Extraction successful")
    print(f"File type: {result['file_type']}")
    print(f"Word count: {result['word_count']}")
    print(f"First 300 chars:\n{result['clean_text'][:300]}")
else:
    print(f"❌ Failed: {result['error']}")