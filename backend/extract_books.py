import fitz
import json
import os
import re

PDF_5 = r"C:\Users\Avaz\Desktop\biology\5-sinf Tabiiy fanlar yangi darslik kitob (1-chorak) 2024 (1).pdf"
PDF_6 = r"C:\Users\Avaz\Desktop\biology\689-4feb9.pdf"

OUTPUT_JSON = "books_data.json"
UPLOAD_DIR = os.path.join("uploads", "images")

if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

def extract_topics_from_pdf(pdf_path, grade):
    doc = fitz.open(pdf_path)
    topics = []
    current_topic = None
    
    img_counter = 0

    for page_num in range(doc.page_count): # Process all pages
        page = doc[page_num]
        
        # Simple extraction
        blocks = page.get_text("dict")["blocks"]
        
        for block in blocks:
            if "lines" in block:
                for line in block["lines"]:
                    for span in line["spans"]:
                        text = span["text"].strip()
                        size = span["size"]
                        flags = span["flags"]
                        
                        # Heuristics for Topic Titles
                        is_title = False
                        text_lower = text.lower()
                        if "mavzu" in text_lower and len(text) < 100:
                            is_title = True
                        elif size > 14 and len(text) > 4 and not text.isdigit():
                            is_title = True
                        elif "1-" in text or "2-" in text or "3-" in text or "4-" in text or "5-" in text:
                            is_title = True
                        
                        if is_title:
                            if current_topic:
                                topics.append(current_topic)
                            current_topic = {
                                "title": text,
                                "gradeLevel": grade,
                                "contentMd": "",
                                "images": []
                            }
                        elif current_topic and text:
                            # Append to content
                            if size > 13:
                                current_topic["contentMd"] += f"\n### {text}\n"
                            else:
                                current_topic["contentMd"] += f"{text} "

        # Extract images
        for img_index, img in enumerate(page.get_images(full=True)):
            xref = img[0]
            base_image = doc.extract_image(xref)
            image_bytes = base_image["image"]
            image_ext = base_image["ext"]
            img_filename = f"grade{grade}_p{page_num}_{img_index}.{image_ext}"
            img_path = os.path.join(UPLOAD_DIR, img_filename)
            
            with open(img_path, "wb") as f:
                f.write(image_bytes)
            
            if current_topic:
                current_topic["images"].append(f"/uploads/images/{img_filename}")
                current_topic["contentMd"] += f"\n\n![Image](http://localhost:5000/uploads/images/{img_filename})\n\n"
                
    if current_topic:
        topics.append(current_topic)
        
    # Clean up topics
    valid_topics = []
    for t in topics:
        if len(t["contentMd"]) > 50:
            valid_topics.append(t)
            
    return valid_topics

print("Parsing 5th grade book...")
try:
    topics_5 = extract_topics_from_pdf(PDF_5, 5)
except Exception as e:
    print("Error parsing 5th grade:", e)
    topics_5 = []

print("Parsing 6th grade book...")
try:
    topics_6 = extract_topics_from_pdf(PDF_6, 6)
except Exception as e:
    print("Error parsing 6th grade:", e)
    topics_6 = []

all_topics = topics_5 + topics_6

with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
    json.dump(all_topics, f, ensure_ascii=False, indent=2)

print(f"Extracted {len(topics_5)} topics for 5th grade and {len(topics_6)} topics for 6th grade.")
