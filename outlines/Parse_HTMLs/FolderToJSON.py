import requests
import os
from dotenv import load_dotenv
import google.generativeai as genai
import typing_extensions as typing
import enum
import csv
import json

load_dotenv()

# Configure the Gemini model
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
model = genai.GenerativeModel("gemini-1.5-flash")

class AssessmentType(enum.Enum):
    QUIZ = "quiz"
    LAB = "lab"
    TUTORIAL = "tutorial"
    WORKSHOP = "workshop"
    MIDTERM = "midterm"
    FINAL = "final"
    PROJECT = "project"
    ESSAY = "essay"
    PARTICIPATION = "participation"
    ATTENDANCE = "attendance"
    OTHER = "other"

class schemeCondition(typing.TypedDict, total=False):  # Optional fields
    symbol: str
    upperBound: float  # Simplify into a single tuple
    lowerBound: float

class Assessment(typing.TypedDict):
    name: str
    assessmentType: str
    count: int
    drop: int
    symbol: str # one letter please
    weight: str

class Scheme(typing.TypedDict):
    schemeNum: int
    condition: schemeCondition
    assessments: list[Assessment] # only fill needed number of assessments, else put null

class Course(typing.TypedDict):
    code: str
    schemes: list[Scheme]


def parse_course_outline_to_json(api_key, html_file_path):

    # Ensure the file exists
    if not os.path.exists(html_file_path):
        raise FileNotFoundError(f"File not found: {html_file_path}")

    # Prepare the file content
    with open(html_file_path, 'r', encoding='utf-8') as file:
        html_content = file.read()

    input = f"""Parse the HTML course outline into JSON with the following rules:
    1. Use a single grading scheme if there are no conditional rules.
    2. Symbols should be single characters, unique for each assessment type.
    3. Assessment weight is a float (0.3 for 30%), unless it is a function, which should then be expressed as an equation with the one letter symbols representing the marks in other assessments
    The html is attached: \n
    {html_content}
    """
    # Send the request to Gemini API
    response = model.generate_content(input, generation_config=genai.GenerationConfig(
        response_mime_type="application/json", response_schema=Course),)

    # Check if the response contains content and return it
    if response and hasattr(response, 'text'):
        return response.text
    else:
        raise Exception("API request failed or did not return expected content.")


def generate_csv_all(input_folder, output_csv, api_key):
    rows = []
    for folder_name in os.listdir(input_folder):
        folder_path = os.path.join(input_folder, folder_name)
        print(folder_path)
        for file_name in os.listdir(folder_path):
            if file_name.endswith('.html'):
                file_path = os.path.join(folder_path, file_name)
                course_json = parse_course_outline_to_json(api_key, file_path)
                rows.append([json.dumps(course_json)])  # Dump the dictionary as a JSON string for the CSV
    # Write to CSV
    with open(output_csv, 'w', newline='', encoding='utf-8') as csvfile:
        csvwriter = csv.writer(csvfile)
        csvwriter.writerow([
            "JSON"
        ])
        csvwriter.writerows(rows)

def generate_csv_subject(input_folder, output_csv, api_key):
    with open(output_csv, 'w', newline='', encoding='utf-8') as csvfile:
        csvwriter = csv.writer(csvfile)
        csvwriter.writerow(["JSON"])
        for file_name in os.listdir(input_folder):
            if file_name.endswith('.html'):
                file_path = os.path.join(input_folder, file_name)
                print("Processing: " + file_path)
                course_json = parse_course_outline_to_json(api_key, file_path)
                csvwriter.writerow([json.dumps(course_json)])  # Write each parsed JSON to the CSV



if __name__ == "__main__":
    # Replace with your actual API key
    api_key = os.getenv('GEMINI_API_KEY')

    if not api_key:
        raise ValueError("API key not found. Make sure GEMINI_API_KEY is set in the .env file.")

    # Path to the HTML file you want to parse
    html_folder_path = "outlines\\HTML_Files\\ECE"
    output_csv_path = "outlines\\ECE_JSON2.csv"  # Replace with your desired output file name

    try:
        generate_csv_subject(html_folder_path, output_csv_path, api_key)
        # print("Parsed JSON from the course outline:")
    except Exception as e:
        print(f"An error occurred: {e}")
