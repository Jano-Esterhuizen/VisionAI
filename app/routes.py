import os
from flask import render_template, request, send_file, jsonify, current_app
from werkzeug.utils import secure_filename
from app import app
from app.utils.file_handlers import extract_images_from_pptx, insert_alt_text
from app.utils.image_processing import describe_image

@app.route('/')
def index():
    return render_template('upload.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    filename = secure_filename(file.filename)
    filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)
    
    images = extract_images_from_pptx(filepath, current_app.config['OUTPUT_FOLDER'])
    
    descriptions = []
    for slide_number, shape_number, image_path in images:
        description = describe_image(image_path)
        descriptions.append((slide_number, shape_number, description))

    modified_filepath = insert_alt_text(filepath, descriptions)
    modified_filename = os.path.basename(modified_filepath)
    return jsonify({"filename": modified_filename})

@app.route('/download/<filename>')
def download_file(filename):
    file_path = os.path.join(current_app.config['OUTPUT_FOLDER'], filename)
    print(f"Attempting to download file: {file_path}")
    if not os.path.exists(file_path):
        return jsonify({"error": f"File not found: {filename}"}), 404
    return send_file(file_path, as_attachment=True)