import os
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables from the .env file
load_dotenv()

def get_openai_client():
    # Retrieve the API key from environment variables
    api_key = os.getenv('OPENAI_API_KEY')
    return OpenAI(api_key=api_key)
