import cv2
import os
import numpy as np

INPUT_DIR = "dataset/raw/no_pencil"
OUTPUT_DIR = "dataset/processed/no_pencil"

os.makedirs(OUTPUT_DIR, exist_ok=True)

def preprocess(img_path):
    img = cv2.imread(img_path)

    if img is None:
        return None

    img = cv2.resize(img, (320, 320))

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY) #barva ni potrebna za zaznavo svincnika ki je oblikovno zaznamovan

    clahe = cv2.createCLAHE(clipLimit=1, tileGridSize=(8, 8)) #popravi konstrast
    enhanced = clahe.apply(gray)

    blur = cv2.GaussianBlur(enhanced, (0, 0), 2) #pri 0, 0 se kernel sam izracuna

    sharpened = cv2.addWeighted(enhanced, 1.5, blur, -0.5, 0) #original (vse informacije tudi mehki prehodi) blur (mehke frekvence) original - mehke frekvence = visoke frekvence (robovi)

    return sharpened

for file in os.listdir(INPUT_DIR):
    path = os.path.join(INPUT_DIR, file)

    processed = preprocess(path)

    if processed is None:
        continue

    output_path = os.path.join(OUTPUT_DIR, file)

    cv2.imwrite(output_path, processed)

print("Done preprocessing")