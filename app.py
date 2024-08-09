import firebase_admin
from firebase_admin import credentials, auth, firestore
from flask import Flask, request, jsonify
from flask_cors import CORS

# Initialize Firebase Admin SDK
cred = credentials.Certificate("C:/Users/JanoEsterhuyse/Desktop/App/VisionAI/visionaryai-e691e-firebase-adminsdk-i5k1b-4160ed6f35.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/verify_token', methods=['POST'])
def verify_token():
    id_token = request.json['idToken']
    try:
        decoded_token = auth.verify_id_token(id_token)
        uid = decoded_token['uid']
        # Check if user is in allowed users list
        user_ref = db.collection('users').document(uid)
        user = user_ref.get()
        if user.exists and user.to_dict().get('allowed', False):
            return jsonify({"status": "success", "uid": uid}), 200
        else:
            return jsonify({"status": "error", "message": "User not allowed"}), 403
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 401

@app.route('/add_allowed_user', methods=['POST'])
def add_allowed_user():
    email = request.json['email']
    try:
        user = auth.get_user_by_email(email)
        db.collection('users').document(user.uid).set({
            'email': email,
            'allowed': True
        })
        return jsonify({"status": "success", "message": "User added to allowed list"}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 400

@app.route('/remove_allowed_user', methods=['POST'])
def remove_allowed_user():
    email = request.json['email']
    try:
        user = auth.get_user_by_email(email)
        db.collection('users').document(user.uid).delete()
        return jsonify({"status": "success", "message": "User removed from allowed list"}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)