import os
import shutil
import subprocess
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D
from tensorflow.keras.models import Model

# --- CONFIGURATION ---
KAGGLE_DATASET = "vipoooool/new-plant-diseases-dataset"
BASE_DIR = "dataset"
EXTRACTED_DIR = "new plant diseases dataset(augmented)/New Plant Diseases Dataset(Augmented)/train"

# The exact 25 classes your app expects
EXPECTED_CLASSES = [
    "Apple___Apple_scab", "Apple___Black_rot", "Apple___Cedar_apple_rust", "Apple___healthy",
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot", "Corn_(maize)___Common_rust_", "Corn_(maize)___Northern_Leaf_Blight", "Corn_(maize)___healthy",
    "Grape___Black_rot", "Grape___Esca_(Black_Measles)", "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)", "Grape___healthy",
    "Potato___Early_blight", "Potato___Late_blight", "Potato___healthy",
    "Tomato___Bacterial_spot", "Tomato___Early_blight", "Tomato___Late_blight", "Tomato___Leaf_Mold", "Tomato___Septoria_leaf_spot", 
    "Tomato___Spider_mites Two-spotted_spider_mite", "Tomato___Target_Spot", "Tomato___Tomato_Yellow_Leaf_Curl_Virus", "Tomato___Tomato_mosaic_virus", "Tomato___healthy"
]

def download_and_prepare_dataset():
    print("Downloading dataset from Kaggle...")
    # NOTE: You must have your kaggle.json configured for this to work.
    subprocess.run(["kaggle", "datasets", "download", "-d", KAGGLE_DATASET, "--unzip"], check=True)
    
    # Create a new directory specifically for our 25 classes
    filtered_dir = "filtered_dataset"
    if not os.path.exists(filtered_dir):
        os.makedirs(filtered_dir)
        
    print("Filtering the exactly 25 classes needed...")
    for cls in EXPECTED_CLASSES:
        src = os.path.join(EXTRACTED_DIR, cls)
        dst = os.path.join(filtered_dir, cls)
        if os.path.exists(src):
            shutil.copytree(src, dst, dirs_exist_ok=True)
            print(f"Copied {cls}")
        else:
            print(f"WARNING: Class {cls} not found in the downloaded dataset!")
            
    return filtered_dir

def train_model(data_dir):
    print("Preparing data generators...")
    datagen = ImageDataGenerator(rescale=1./255, validation_split=0.2)

    train_generator = datagen.flow_from_directory(
        data_dir,
        target_size=(224, 224),
        batch_size=32,
        class_mode='categorical',
        subset='training'
    )

    val_generator = datagen.flow_from_directory(
        data_dir,
        target_size=(224, 224),
        batch_size=32,
        class_mode='categorical',
        subset='validation'
    )

    print("Building MobileNetV2 Model...")
    base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
    base_model.trainable = False # Freeze base model for faster training

    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = Dense(128, activation='relu')(x)
    predictions = Dense(len(EXPECTED_CLASSES), activation='softmax')(x)

    model = Model(inputs=base_model.input, outputs=predictions)
    model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

    print("Training model (fast local version - fewer steps)...")
    model.fit(
        train_generator,
        epochs=1,
        steps_per_epoch=50,  # Limit steps so it completes quickly on CPU
        validation_data=val_generator,
        validation_steps=10
    )

    print("Saving model to app/models/leaf_disease_model.h5...")
    if not os.path.exists("app/models"):
        os.makedirs("app/models")
    model.save("app/models/leaf_disease_model.h5")
    print("Done! The model is ready to be used by the backend.")

if __name__ == "__main__":
    try:
        filtered_path = download_and_prepare_dataset()
        train_model(filtered_path)
    except Exception as e:
        print(f"An error occurred: {e}")
        print("\nPlease make sure you have installed Kaggle (pip install kaggle) and set up your kaggle.json token!")
