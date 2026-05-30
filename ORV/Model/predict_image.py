import json
import sys
from pathlib import Path

import numpy as np
import tensorflow as tf
from tensorflow.keras.utils import load_img, img_to_array


BASE_DIR = Path(__file__).resolve().parent

MODEL_PATH = BASE_DIR / "models" / "pencil_classifier.keras"
CLASS_NAMES_PATH = BASE_DIR / "models" / "class_names.json"
CONFIG_PATH = BASE_DIR / "models" / "training_config.json"

IMAGE_SIZE = (224, 224)
DEFAULT_THRESHOLD = 0.5


def load_class_names():
    if not CLASS_NAMES_PATH.exists():
        raise FileNotFoundError(f"Datoteka z razredi ne obstaja: {CLASS_NAMES_PATH}")

    with open(CLASS_NAMES_PATH, "r") as file:
        return json.load(file)


def load_threshold():
    if not CONFIG_PATH.exists():
        return DEFAULT_THRESHOLD

    with open(CONFIG_PATH, "r") as file:
        config = json.load(file)

    return config.get("threshold", DEFAULT_THRESHOLD)


def prepare_image(image_path):
    img = load_img(image_path, target_size=IMAGE_SIZE)
    img_array = img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)

    return img_array


def predict_image(image_path):
    image_path = Path(image_path)

    if not image_path.exists():
        raise FileNotFoundError(f"Slika ne obstaja: {image_path}")

    if not MODEL_PATH.exists():
        raise FileNotFoundError(f"Model ne obstaja: {MODEL_PATH}")

    model = tf.keras.models.load_model(MODEL_PATH)
    class_names = load_class_names()
    threshold = load_threshold()

    img_array = prepare_image(image_path)

    probability = float(model.predict(img_array, verbose=0)[0][0])

    predicted_index = 1 if probability >= threshold else 0
    predicted_class = class_names[predicted_index]

    print("Slika:", image_path)
    print("Threshold:", threshold)
    print("Verjetnost za razred 1:", round(probability, 4))
    print("Napoved:", predicted_class)

    if predicted_class == "pencil":
        print("Rezultat: pravilna slika - na sliki je kuli/pencil.")
    else:
        print("Rezultat: napačna slika - na sliki ni kulija/pencil.")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Uporaba:")
        print("python predict_image.py pot/do/slike.jpg")
        sys.exit(1)

    predict_image(sys.argv[1])