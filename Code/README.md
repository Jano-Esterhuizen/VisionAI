# Visionary.AI

Visionary.AI is a web application that allows users to upload PowerPoint files, process images within them, and add AI-generated descriptions as alt text. It consists of a Flask backend for file processing and a React frontend for user interaction.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Project Structure](#project-structure)
3. [Backend Setup](#backend-setup)
4. [Frontend Setup](#frontend-setup)
5. [Running the Application](#running-the-application)
6. [Usage](#usage)
7. [Troubleshooting](#troubleshooting)
8. [Notes](#notes)

## Prerequisites

- Python 3.7+
- Node.js 14+
- npm 6+
- Git (optional, for version control)

## Project Structure

```
VisionAI/
├── app/
│   ├── __init__.py
│   ├── routes.py
│   ├── utils/
│   │   ├── file_handlers.py
│   │   ├── image_processing.py
│   │   └── openai_integration.py
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── ...
├── templates/
├── uploads/
├── output/
├── config.py
├── run.py
├── requirements.txt
└── README.md
```

## Backend Setup

1. Clone the repository (if using version control):
   ```
   git clone <repository-url>
   cd VisionAI
   ```

2. Create and activate a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
   ```

3. Install the required Python packages:
   ```
   pip install -r requirements.txt
   ```

4. Set up your OpenAI API key:
   - Create a `.env` file in the project root
   - Add your API key: `OPENAI_API_KEY=your-api-key-here`

5. Ensure the `uploads` and `output` directories exist in the project root.

## Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install the required npm packages:
   ```
   npm install
   ```

3. If you encounter any issues with Tailwind CSS, ensure it's properly configured:
   ```
   npx tailwindcss init -p
   ```

4. Update `src/index.css` to include Tailwind directives:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

## Running the Application

1. Start the Flask backend:
   - In the project root directory:
     ```
     python run.py
     ```
   - The backend should start running on `http://localhost:5000`

2. Start the React frontend:
   - In a new terminal, navigate to the `frontend` directory:
     ```
     cd frontend
     npm start
     ```
   - The frontend should start running on `http://localhost:3000`

3. Open your web browser and go to `http://localhost:3000` to use the application.

## Usage

1. Select the description type from the dropdown menu.
2. Click "Choose File" to select a PowerPoint file.
3. Click "Upload and Process" to send the file to the server.
4. Once processing is complete, you can edit the generated descriptions.
5. Click "Save Descriptions and Process" to finalize the changes.
6. Use the "Download Processed File" button to get the modified PowerPoint file.

## Troubleshooting

- If you encounter "Error: error:0308010C:digital envelope routines::unsupported":
  - Set Node.js to use the legacy OpenSSL provider:
    ```
    set NODE_OPTIONS=--openssl-legacy-provider  # On Windows
    export NODE_OPTIONS=--openssl-legacy-provider  # On Unix-like systems
    ```
  - Or update the "start" script in `frontend/package.json`:
    ```json
    "scripts": {
      "start": "react-scripts --openssl-legacy-provider start",
    }
    ```

- If npm can't find `package.json`, ensure you're in the correct directory (frontend).

- For any other issues, check the console logs in both the backend terminal and the browser developer tools.

## Notes

- The backend uses Flask and requires an OpenAI API key for image description generation.
- The frontend is built with React and uses Tailwind CSS for styling.
- Ensure all required ports (3000 for React, 5000 for Flask) are available and not blocked by firewalls.
- For production deployment, additional steps like setting up a production server (e.g., Gunicorn) and building the React app would be necessary.
- Regularly update dependencies to ensure security and compatibility.
- This application is for educational purposes and may require additional security measures for production use.
