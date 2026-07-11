import pandas as pd

# ============================================
# MOCK USER-PRODUCT INTERACTIONS
# ============================================
interactions_data = [
    # User 1 — likes electronics
    {"user_id": "user_1", "product_id": "product_1", "product_name": "Wireless Headphones", "category": "electronics", "rating": 5},
    {"user_id": "user_1", "product_id": "product_2", "product_name": "Mechanical Keyboard", "category": "electronics", "rating": 4},
    {"user_id": "user_1", "product_id": "product_5", "product_name": "Wireless Mouse", "category": "electronics", "rating": 4},

    # User 2 — likes food and books
    {"user_id": "user_2", "product_id": "product_7", "product_name": "Ethiopian Coffee Beans", "category": "food", "rating": 5},
    {"user_id": "user_2", "product_id": "product_6", "product_name": "Clean Code Book", "category": "books", "rating": 5},

    # User 3 — likes electronics and home
    {"user_id": "user_3", "product_id": "product_1", "product_name": "Wireless Headphones", "category": "electronics", "rating": 4},
    {"user_id": "user_3", "product_id": "product_4", "product_name": "Laptop Stand", "category": "home", "rating": 5},
    {"user_id": "user_3", "product_id": "product_3", "product_name": "USB-C Hub", "category": "electronics", "rating": 4},

     # User 4 — likes clothing and food
    {"user_id": "user_4", "product_id": "product_8", "product_name": "Traditional Habesha Kemis", "category": "clothing", "rating": 5},
    {"user_id": "user_4", "product_id": "product_7", "product_name": "Ethiopian Coffee Beans", "category": "food", "rating": 4},

    # User 5 — likes electronics heavily (similar taste to User 1)
    {"user_id": "user_5", "product_id": "product_1", "product_name": "Wireless Headphones", "category": "electronics", "rating": 5},
    {"user_id": "user_5", "product_id": "product_2", "product_name": "Mechanical Keyboard", "category": "electronics", "rating": 5},
    {"user_id": "user_5", "product_id": "product_3", "product_name": "USB-C Hub", "category": "electronics", "rating": 4},

    # User 6 — likes books and food (similar taste to User 2)
    {"user_id": "user_6", "product_id": "product_6", "product_name": "Clean Code Book", "category": "books", "rating": 4},
    {"user_id": "user_6", "product_id": "product_7", "product_name": "Ethiopian Coffee Beans", "category": "food", "rating": 5},
]

df = pd.DataFrame(interactions_data)

if __name__ == "__main__":
    print("Our mock interaction data:")
    print(df)
    print(f"\nTotal interactions: {len(df)}")
    print(f"Total unique users: {df['user_id'].nunique()}")
    print(f"Total unique products: {df['product_id'].nunique()}")