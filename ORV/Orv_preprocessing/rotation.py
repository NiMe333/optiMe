import cv2
import os
import random

DIR = "dataset/processed/pencil"

for file in os.listdir(DIR):

    path = os.path.join(DIR, file)

    img = cv2.imread(path)

    if img is None:
        continue

    h, w = img.shape[:2]

    angle = random.randint(-25, 25)

    matrix = cv2.getRotationMatrix2D((w // 2, h // 2), angle, 1.0)

    rotated = cv2.warpAffine(img, matrix, (w, h))

    name, ext = os.path.splitext(file)

    output_name = f"{name}_rotated{ext}"

    output_path = os.path.join(DIR, output_name)

    cv2.imwrite(output_path, rotated)

print("Done augmenting")