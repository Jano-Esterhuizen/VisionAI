import os
from dotenv import load_dotenv

# Load environment variables from the .env file
load_dotenv()

class Config:
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
    OUTPUT_FOLDER = os.path.join(BASE_DIR, 'static', 'images')  # Storing extracted images here
    REACT_BUILD_FOLDER = os.path.join(BASE_DIR, 'frontend', 'build')

    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

    @staticmethod
    def init_app(app):
        os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)
        os.makedirs(Config.OUTPUT_FOLDER, exist_ok=True)
        print(f"UPLOAD_FOLDER: {Config.UPLOAD_FOLDER}")
        print(f"OUTPUT_FOLDER: {Config.OUTPUT_FOLDER}")
