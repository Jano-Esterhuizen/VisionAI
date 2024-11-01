import os
from openai import OpenAI

# def get_openai_client():
#     return OpenAI(api_key=os.OPENAI_API_KEY)

def get_openai_client():
    api_key = os.getenv("OPENAI_API_KEY")  # This will pull from .env if set correctly
    if not api_key:
        raise ValueError("OPENAI_API_KEY environment variable is not set.")
    return OpenAI(api_key=api_key)