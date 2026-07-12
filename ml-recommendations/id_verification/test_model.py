import tensorflow as tf
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
import numpy as np
import sys

# ============================================
# LOAD OUR TRAINED MODEL
# ============================================
model = tf.keras.models.load_model("document_classifier.keras")

# ============================================
# FUNCTION TO PREDICT A SINGLE IMAGE
# ============================================
def predict_image(image_path):
    # LOAD AND RESIZE THE IMAGE TO MATCH TRAINING SIZE
    img = image.load_img(image_path, target_size=(160, 160))

    # CONVERT IMAGE TO A NUMBER ARRAY
    img_array = image.img_to_array(img)

    # ADD AN EXTRA DIMENSION — model expects a "batch" of images, even if it's just 1
    img_array = np.expand_dims(img_array, axis=0)

    # PREPROCESS EXACTLY LIKE WE DID DURING TRAINING
    img_array = preprocess_input(img_array)

    # GET THE MODEL'S PREDICTION
    prediction = model.predict(img_array)[0][0]

    # REMEMBER: documents=0, not_documents=1 (from training output)
    # So a LOW number = document, HIGH number = not document
    is_document = prediction < 0.5
    confidence = (1 - prediction) if is_document else prediction

    print(f"\nImage: {image_path}")
    print(f"Raw prediction score: {prediction:.4f}")
    print(f"Result: {'DOCUMENT' if is_document else 'NOT A DOCUMENT'}")
    print(f"Confidence: {confidence * 100:.1f}%")


# ============================================
# RUN IT — pass an image path as an argument
# ============================================
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python test_model.py <path_to_image>")
    else:
        predict_image(sys.argv[1])