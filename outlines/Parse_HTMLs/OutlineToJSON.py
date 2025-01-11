# Want to give Gemini a structured output to form a JSON file, that can then be read and indexed by the supabase site
# Per course:


# sections: Sched, Instructors, Description, Outcomes, Course Sched (week by week), Materials, Student Assessment, Admin Policy
#types:
# Course info: take from schedules
# Personnel (class): Name, Contact, Role, Email, Office Hours 
# Description (string)
# Assessments: Type, Format, id (courseid_char+int)
# Course Schedules: Subject, texts to review
# Matrerials (strings):
# Grading Scheme: 

import requests
import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

# Configure the Gemini model
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
model = genai.GenerativeModel("gemini-1.5-flash")

def parse_course_outline_to_json(api_key, html_file_path):
    """
    Sends an HTML file to the Google Gemini API and instructs it to generate a JSON following a specific structure.

    Args:
        api_key (str): Your API key for Google Gemini.
        html_file_path (str): Path to the HTML file to process.

    Returns:
        str: The JSON output generated by the API.
    """
    # Ensure the file exists
    if not os.path.exists(html_file_path):
        raise FileNotFoundError(f"File not found: {html_file_path}")

    # Prepare the file content
    with open(html_file_path, 'r', encoding='utf-8') as file:
        html_content = file.read()

    # Input prompt with instructions for JSON generation
    input = f"""
        Parse the following course outline HTML and generate a JSON output following this structure with NO EXTRA:
        Some extra information: the json should contain multiple schemes if there is a condition such as if the final exa, grade is less than 50%, the midterm is weighted more. Fill out symbol with a char so that the assessment type may be referenced, 

        {{
          "courseID": "string",
          "gradingSchemes": [
            {{
              "schemeNumber": "integer",
              "condition": [
                {{
                  "assessment": "string",
                  "upperBound": "number",
                  "lowerBound": "number"
                }}
              ],
              "assessment": [
                {{
                  "type": "string",
                  "count": "integer",
                  "drop": "integer",
                  "symbol": "string",
                  "weight": "string"
                }}
              ]
            }}
          ]
        }}

        Here is the course outline HTML content:
        {html_content}
    """

    # Send the request to Gemini API
    response = model.generate_content(input)

    # Check if the response contains content and return it
    if response and hasattr(response, 'text'):
        return response.text
    else:
        raise Exception("API request failed or did not return expected content.")

if __name__ == "__main__":
    # Replace with your actual API key
    api_key = os.getenv('GEMINI_API_KEY')

    if not api_key:
        raise ValueError("API key not found. Make sure GEMINI_API_KEY is set in the .env file.")

    # Path to the HTML file you want to parse
    html_file_path = "outlines\\Parse_HTMLs\\MATH_page1_22.html"

    try:
        parsed_json = parse_course_outline_to_json(api_key, html_file_path)
        print("Parsed JSON from the course outline:")
        print(parsed_json)
    except Exception as e:
        print(f"An error occurred: {e}")