from flask import Flask,jsonify
from flask_cors import CORS
from recommender import get_recommendations

# ============================================
# CREATE THE FLASK APP
# ============================================
app = Flask(__name__)

# ALLOW NEXT.JS (running on a different port) TO CALL THIS API
CORS(app)


# ============================================
# ROUTE — GET RECOMMENDATIONS FOR A USER
# ============================================
@app.route("/recommendations/<user_id>", methods=["GET"])
def recommandations(user_id):
    #CALL OUR ML FUNCTION FROM recommender.py
    product_ids = get_recommendations(user_id, top_n=4)

    # SEND BACK AS JSON - the format web apps understand
    return jsonify({
        "user_id": user_id,
        "recommended_product_ids": product_ids
    })

# ============================================
# A SIMPLE HEALTH CHECK ROUTE
# ============================================
@app.route("/", methods=["GET"])
def health_check():
    return jsonify({"status": "ML server is running"})

# ============================================
# RUN THE SERVER
# ============================================
if __name__ == "__main__":
    app.run(port=5000, debug=True)