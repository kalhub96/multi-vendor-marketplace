import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras import layers, models

# ============================================
# SETTINGS
# ============================================
IMAGE_SIZE = (160, 160) # all images get resized to this
BATCH_SIZE = 8          # how many images the model looks at per step
EPOCHS = 10             # how many times it goes through all the data

# ============================================
# STEP 1 — LOAD AND PREPARE THE IMAGES
# ============================================
# ImageDataGenerator automatically:
#  - reads images from folders
#  - resizes them
#  - splits into training and validation sets
#  - labels them based on FOLDER NAME (documents=0, not_documents=1)

datagen = ImageDataGenerator(
    preprocessing_function=preprocess_input,  # prepares pixels the way MobileNetV2 expects
    validation_split=0.2  # use 20% of images to check how well it's learning
)

train_data = datagen.flow_from_directory(
    "dataset",
    target_size=IMAGE_SIZE,
    batch_size=BATCH_SIZE,
    class_mode="binary",
    subset="training"
)

validation_data = datagen.flow_from_directory(
    "dataset",
    target_size=IMAGE_SIZE,
    batch_size=BATCH_SIZE,
    class_mode="binary",
    subset="validation"
)

print("\nclass labels (auto-detected from folder names):")
print(train_data.class_indices)

# ============================================
# STEP 2 — LOAD THE PRE-TRAINED BASE MODEL
# ============================================
base_model = MobileNetV2(
    input_shape=(160, 160, 3),  # 160x160 pixels, 3 color channels (RGB)
    include_top=False,
    weights="imagenet"
)

# FREEZE THE BASE MODEL — don't let training change its existing knowledge
base_model.trainable = False

# ============================================
# STEP 3 — ADD OUR OWN SMALL DECISION LAYER ON TOP
# ============================================
model = models.Sequential([
    base_model,
    layers.GlobalAveragePooling2D(),  # simplifies the output into a manageable size
    layers.Dense(64, activation="relu"),  # a small "thinking" layer
    layers.Dropout(0.3),  # helps prevent overfitting (memorizing instead of learning)
    layers.Dense(1, activation="sigmoid")  # final output: a number between 0 and 1
])

# ============================================
# STEP 4 — COMPILE THE MODEL
# ============================================
model.compile(
    optimizer="adam",
    loss="binary_crossentropy",  # standard loss function for yes/no predictions
    metrics=["accuracy"]
)

model.summary()

# ============================================
# STEP 5 — TRAIN IT
# ============================================
print("\nStarting training...\n")

history = model.fit(
    train_data,
    validation_data=validation_data,
    epochs=EPOCHS
)

# ============================================
# STEP 6 — SAVE THE TRAINED MODEL
# ============================================
model.save("document_classifier.keras")
print("\n✓ Model saved as document_classifier.keras")