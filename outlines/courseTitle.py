from bs4 import BeautifulSoup
import os
import csv
import pandas as pd

def extract_course_name(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        soup = BeautifulSoup(file, 'html.parser')
        
        # Check <title> tag for course name
        title_tag = soup.find('title')
        if title_tag and "Course Outline -" in title_tag.text:
            course_name = title_tag.text.replace("Course Outline -", "").strip()
            return course_name
        
        # Fallback to <h1> tag with the course name
        h1_tag = soup.find('h1')
        if h1_tag:
            return h1_tag.text.strip()
        
        return "Course name not found"

main_folder_path = "outlines\\SimplifiedHTMLFiles"

names = []

for folder in os.listdir(main_folder_path):
    folder_path = os.path.join(main_folder_path, folder)
    for file in os.listdir(folder_path):
        file_path = os.path.join(folder_path, file)
        course_name = extract_course_name(file_path)
        names.append(course_name)

output_csv = "outlines\\master_outline.csv"
input_csv = "outlines\\combined_output.csv"
df = pd.read_csv(input_csv)
csv_data = df.values.tolist()

with open(output_csv, "w", newline="") as outfile:
    writer = csv.writer(outfile)
    writer.writerow(["Code", "Personnel", "Schemes", "Course Title"])
    for i in range(len(names)):
        writer.writerow([csv_data[i][0], csv_data[i][1], csv_data[i][2], names[i]])