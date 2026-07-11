import pandas as pd 
from sklearn.metrics.pairwise import cosine_similarity
from mock_data import df

# ============================================
# STEP 1 — BUILD THE USER-ITEM MATRIX
# ============================================
# This turns our long list of interactions into a table:
# rows = users, columns = products, values = ratings

user_item_matrix = df.pivot_table(
    index="user_id",
    columns="product_id",
    values="rating",
    fill_value=0 #if a user never rated a product, use 0
)

# ============================================
# STEP 2 — CALCULATE SIMILARITY BETWEEN ALL USERS
# ============================================
# cosine_similarity compares every user's row of numbers
# to every other user's row, and gives a score from 0 to 1
# 1 = identical taste, 0 = completely different taste

similarity_matrix = cosine_similarity(user_item_matrix)

# CONVERT BACK INTO A READABLE DATAFRAME
# (rows AND columns are both user_ids, so we can look up any pair)

similarity_df = pd.DataFrame(
    similarity_matrix,
    index=user_item_matrix.index,
    columns=user_item_matrix.index
)


# ============================================
# STEP 3 — FUNCTION TO GET RECOMMENDATIONS FOR A USER
# ============================================
def get_recommendations(user_id,top_n=4):
    # SAFETY CHECK — if this user has no data, we can't recommend anything
    if user_id not in similarity_df.index:
        return []
    # FIND THE MOST SIMILAR USERS TO THIS ONE
    # .sort_values(ascending=False) puts highest similarity first
    # We drop the user themselves (they're always 100% similar to themselves)
    similar_users = similarity_df[user_id].sort_values(ascending=False).drop(user_id)

    # PRODUCTS THIS USER HAS ALREADY RATED — we don't want to recommend these again
    already_rated = set(user_item_matrix.loc[user_id][user_item_matrix.loc[user_id] > 0].index)

    recommendations = {}

    # GO THROUGH SIMILAR USERS, MOST SIMILAR FIRST
    for similar_user, similarity_score in similar_users.items():
        if similarity_score <= 0:
            continue # skip user with no meaningful similarity

        # LOOK AT WHAT THIS SIMILAR USER RATED HIGHLY
        their_ratings = user_item_matrix.loc[similar_user]

        for product_id, rating in their_ratings.items():
            if rating > 0 and product_id not in already_rated:
                # WEIGHT THE RATING BY HOW SIMILAR THIS USER IS TO US
                score = rating * similarity_score

                # IF WE'VE SEEN THIS PRODUCT RECOMMENDED BEFORE, KEEP THE HIGHER SCORE
                if product_id not in recommendations or score > recommendations[product_id]:
                    recommendations[product_id] = score

                    # SORT RECOMMENDATIONS BY SCORE, HIGHEST FIRST
                    sorted_recommandations = sorted(
                        recommendations.items(), key=lambda x: x[1], reverse=True
                    )

                    # RETURN JUST THE PRODUCT IDS, LIMITED TO top_n
                    return [product_id for product_id, score in sorted_recommandations[:top_n]]
                
# ============================================
# TEST IT
# ============================================
if __name__ == "__main__":
    print("user-Item Matrix:")
    print(user_item_matrix)

    print("\n\nSimilarity Between Users:")
    print(similarity_df.round(2))

    print("\n\nRecommendations for user_1:")
    recs = get_recommendations("user_1")
    print(recs)

    print("\n\nRecommendations for user_2:")
    recs2 = get_recommendations("user_2")
    print(recs2)
   