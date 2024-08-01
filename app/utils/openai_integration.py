from openai import OpenAI
from config import Config

def get_openai_client():
    return OpenAI(api_key=Config.OPENAI_API_KEY)