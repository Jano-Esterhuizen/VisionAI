import os
import logging
from flask import Blueprint, send_file, jsonify, current_app, request
from werkzeug.utils import secure_filename
from app.utils.file_handlers import extract_images_from_pptx, insert_alt_text
from app.utils.image_processing import describe_image
from flask import send_from_directory

bp = Blueprint('main', __name__)

@bp.route('/upload', methods=['POST'])
def upload_file():
    logging.info("Upload route called")
    if 'file' not in request.files:
        logging.error("No file part in the request")
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        logging.error("No selected file")
        return jsonify({"error": "No selected file"}), 400
    
    filename = secure_filename(file.filename)
    filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)
    
    prompt_type = request.form.get('promptType', 'general')
    logging.info(f"Received prompt type: {prompt_type}")
    
    try:
        images = extract_images_from_pptx(filepath, current_app.config['OUTPUT_FOLDER'])
        logging.info(f"Extracted {len(images)} images")
        
        image_descriptions = []
        for slide_number, shape_number, image_path in images:
            logging.info(f"Processing image: slide {slide_number}, shape {shape_number}")
            description = describe_image(image_path, prompt_type)
            relative_path = os.path.relpath(image_path, current_app.config['OUTPUT_FOLDER'])
            image_descriptions.append({
                "slide_number": slide_number,
                "shape_number": shape_number,
                "image_path": relative_path,
                "description": description
            })

        logging.info(f"Processed {len(image_descriptions)} images")
        return jsonify({
            "filename": filename,
            "images": image_descriptions
        })
    except Exception as e:
        logging.error(f"Error processing file: {str(e)}", exc_info=True)
        return jsonify({"error": "Error processing file"}), 500

@bp.route('/process', methods=['POST'])
def process_descriptions():
    data = request.json
    logging.debug(f"Received data: {data}")
    
    filename = data['filename']
    descriptions = data['descriptions']
    
    filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
    logging.debug(f"Original file path: {filepath}")
    
    try:
        logging.debug("Formatting descriptions")
        formatted_descriptions = []
        for desc in descriptions:
            logging.debug(f"Processing description: {desc}")
            slide_number = int(desc['slide_number'])
            shape_number = int(desc['shape_number'])
            description = desc['description']
            formatted_descriptions.append((slide_number, shape_number, description))
        
        logging.debug(f"Formatted descriptions: {formatted_descriptions}")
        
        modified_filepath = insert_alt_text(filepath, formatted_descriptions)
        logging.debug(f"Modified file path: {modified_filepath}")
        
        modified_filename = os.path.basename(modified_filepath)
        logging.debug(f"Modified filename: {modified_filename}")
        
        if os.path.exists(modified_filepath):
            logging.debug(f"File exists at: {modified_filepath}")
        else:
            logging.error(f"File does not exist at: {modified_filepath}")
        
        return jsonify({"filename": modified_filename})
    except Exception as e:
        logging.error(f"Error inserting alt text: {str(e)}", exc_info=True)
        return jsonify({"error": f"Error processing descriptions: {str(e)}"}), 500

@bp.route('/download/<filename>')
def download_file(filename):
    file_path = os.path.join(current_app.config['OUTPUT_FOLDER'], filename)
    logging.info(f"Attempting to download file: {file_path}")
    
    if os.path.exists(file_path):
        logging.info(f"File found: {file_path}")
        try:
            return send_file(file_path, as_attachment=True)
        except Exception as e:
            logging.error(f"Error sending file: {str(e)}", exc_info=True)
            return jsonify({"error": "Error sending file"}), 500
    else:
        logging.error(f"File not found: {file_path}")
        return jsonify({"error": f"File not found: {filename}"}), 404

@bp.route('/api/images/<path:filename>')
def serve_image(filename):
    return send_from_directory(current_app.config['OUTPUT_FOLDER'], filename)

# Keep the existing download_file route