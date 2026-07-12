from flask import Flask, jsonify, request
from flask_cors import CORS
from recommender import get_recommendations
import tensorflow as tf
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
import numpy as np
import os

# ============================================
# CREATE THE FLASK APP
# ============================================
app = Flask(__name__)
CORS(app)

# ============================================
# LOAD THE ID VERIFICATION MODEL ONCE, AT STARTUP
# ============================================
# We load it here (not inside the route) so it only loads ONCE
# when the server starts, not on every single request — much faster
MODEL_PATH = os.path.join("id_verification", "document_classifier.keras")
id_model = tf.keras.models.load_model(MODEL_PATH)

# TEMPORARY FOLDER TO SAVE UPLOADED IMAGES BEFORE PREDICTING
UPLOAD_FOLDER = "temp_uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# ============================================
# ROUTE — GET RECOMMENDATIONS FOR A USER
# ============================================
@app.route("/recommendations/<user_id>", methods=["GET"])
def recommendations(user_id):
    product_ids = get_recommendations(user_id, top_n=4)
    return jsonify({
        "user_id": user_id,
        "recommended_product_ids": product_ids
    })


# ============================================
# ROUTE — VERIFY AN ID DOCUMENT IMAGE
# ============================================
@app.route("/verify-id", methods=["POST"])
def verify_id():
    # CHECK IF A FILE WAS ACTUALLY SENT
    if "image" not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    uploaded_file = request.files["image"]

    if uploaded_file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    # SAVE THE FILE TEMPORARILY SO WE CAN LOAD IT
    temp_path = os.path.join(UPLOAD_FOLDER, uploaded_file.filename)
    uploaded_file.save(temp_path)

    try:
        # LOAD AND PREPROCESS THE IMAGE — SAME STEPS AS test_model.py
        img = image.load_img(temp_path, target_size=(160, 160))
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = preprocess_input(img_array)

        # RUN THE PREDICTION
        prediction = float(id_model.predict(img_array)[0][0])

        # documents=0, not_documents=1 (from training)
        is_document = prediction < 0.5
        confidence = (1 - prediction) if is_document else prediction

        return jsonify({
            "is_document": is_document,
            "confidence": round(confidence * 100, 1)
        })

    finally:
        # CLEAN UP — DELETE THE TEMPORARY FILE REGARDLESS OF SUCCESS/FAILURE
        if os.path.exists(temp_path):
            os.remove(temp_path)


# ============================================
# HEALTH CHECK
# ============================================
@app.route("/", methods=["GET"])
def health_check():
    return jsonify({"status": "ML server is running"})


# ============================================
# RUN THE SERVER
# ============================================
if __name__ == "__main__":
    app.run(port=5000, debug=True)