import os
from dotenv import load_dotenv

# Load environment variables from the .env file
load_dotenv()

class Config:
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
    OUTPUT_FOLDER = os.path.join(BASE_DIR, 'output')
    REACT_BUILD_FOLDER = os.path.join(BASE_DIR, 'frontend', 'build')
    
    # Access the OpenAI API key from environment variables
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

    @staticmethod
    def init_app(app):
        os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)
        os.makedirs(Config.OUTPUT_FOLDER, exist_ok=True)
        print(f"UPLOAD_FOLDER: {Config.UPLOAD_FOLDER}")
        print(f"OUTPUT_FOLDER: {Config.OUTPUT_FOLDER}")
        if not os.access(Config.OUTPUT_FOLDER, os.R_OK):
            print(f"WARNING: Output folder is not readable: {Config.OUTPUT_FOLDER}")
