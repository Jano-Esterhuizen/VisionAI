import os
import logging
from flask import Blueprint, send_file, jsonify, current_app, request
from werkzeug.utils import secure_filename
from app.utils.file_handlers import extract_images_from_pptx, insert_alt_text
from app.utils.image_processing import describe_image

bp = Blueprint('main', __name__)

@bp.route('/')
def index():
    return "Hello, World!"  # Or render your template here

@bp.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    filename = secure_filename(file.filename)
    filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)
    
    try:
        images = extract_images_from_pptx(filepath, current_app.config['OUTPUT_FOLDER'])
        
        descriptions = []
        for slide_number, shape_number, image_path in images:
            description = describe_image(image_path)
            descriptions.append((slide_number, shape_number, description))

        modified_filepath = insert_alt_text(filepath, descriptions)
        modified_filename = os.path.basename(modified_filepath)
        return jsonify({"filename": modified_filename})
    except Exception as e:
        logging.error(f"Error processing file: {str(e)}")
        return jsonify({"error": "Error processing file"}), 500

@bp.route('/download/<filename>')
def download_file(filename):
    file_path = os.path.join(current_app.config['OUTPUT_FOLDER'], filename)
    logging.info(f"Attempting to download file: {file_path}")
    
    if not os.path.exists(file_path):
        logging.error(f"File not found: {file_path}")
        return jsonify({"error": f"File not found: {filename}"}), 404
    
    try:
        logging.info(f"Sending file: {file_path}")
        return send_file(file_path, as_attachment=True)
    except Exception as e:
        logging.exception(f"Error sending file: {str(e)}")
        return jsonify({"error": "Error sending file"}), 500