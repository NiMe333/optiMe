import json
from pathlib import Path

import numpy as np
import tensorflow as tf
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix

from train_model import create_datasets, MODEL_DIR, RESULTS_DIR


MODEL_PATH = MODEL_DIR / "pencil_classifier.keras"
THRESHOLDS = [0.4, 0.5, 0.6, 0.7, 0.8, 0.9]


def get_true_labels_and_probabilities(model, val_ds):
    probabilities = model.predict(val_ds, verbose=0).flatten()

    true_labels = []

    for _, labels in val_ds:
        true_labels.extend(labels.numpy().astype(int).flatten())

    return np.array(true_labels), probabilities


def evaluate_threshold(true_labels, probabilities, threshold):
    predicted_labels = (probabilities >= threshold).astype(int)

    accuracy = accuracy_score(true_labels, predicted_labels)
    precision = precision_score(true_labels, predicted_labels, zero_division=0)
    recall = recall_score(true_labels, predicted_labels, zero_division=0)
    f1 = f1_score(true_labels, predicted_labels, zero_division=0)

    matrix = confusion_matrix(true_labels, predicted_labels, labels=[0, 1])

    false_accepts = matrix[0][1]
    false_rejects = matrix[1][0]

    return {
        "threshold": threshold,
        "accuracy": accuracy,
        "precision": precision,
        "recall": recall,
        "f1_score": f1,
        "false_accepts": int(false_accepts),
        "false_rejects": int(false_rejects),
        "confusion_matrix": matrix.tolist(),
    }


def find_best_threshold(results):
    best_result = results[0]

    for result in results[1:]:
        better_accuracy = result["accuracy"] > best_result["accuracy"]
        same_accuracy_less_false_accepts = (
            result["accuracy"] == best_result["accuracy"]
            and result["false_accepts"] < best_result["false_accepts"]
        )

        if better_accuracy or same_accuracy_less_false_accepts:
            best_result = result

    return best_result


def save_results(results, best_result):
    RESULTS_DIR.mkdir(exist_ok=True)
    MODEL_DIR.mkdir(exist_ok=True)

    txt_path = RESULTS_DIR / "threshold_optimization.txt"
    json_path = RESULTS_DIR / "threshold_optimization.json"
    best_threshold_path = MODEL_DIR / "best_threshold.json"

    lines = []
    lines.append("Threshold optimization results\n")
    lines.append("threshold | accuracy | precision | recall | f1_score | false_accepts | false_rejects\n")

    for result in results:
        lines.append(
            f"{result['threshold']:.2f} | "
            f"{result['accuracy']:.4f} | "
            f"{result['precision']:.4f} | "
            f"{result['recall']:.4f} | "
            f"{result['f1_score']:.4f} | "
            f"{result['false_accepts']} | "
            f"{result['false_rejects']}\n"
        )

    lines.append("\nBest threshold:\n")
    lines.append(json.dumps(best_result, indent=4))

    with open(txt_path, "w") as file:
        file.writelines(lines)

    with open(json_path, "w") as file:
        json.dump(results, file, indent=4)

    with open(best_threshold_path, "w") as file:
        json.dump(
            {
                "best_threshold": best_result["threshold"],
                "accuracy": best_result["accuracy"],
                "false_accepts": best_result["false_accepts"],
                "false_rejects": best_result["false_rejects"],
            },
            file,
            indent=4,
        )

    print(f"\nRezultati optimizacije shranjeni v: {txt_path}")
    print(f"Najboljši threshold shranjen v: {best_threshold_path}")


def main():
    if not MODEL_PATH.exists():
        raise FileNotFoundError(f"Model ne obstaja: {MODEL_PATH}")

    print("Nalagam model...")
    model = tf.keras.models.load_model(MODEL_PATH)

    print("Pripravljam validacijski dataset...")
    _, val_ds, class_names = create_datasets()

    print("Razredi:", class_names)

    true_labels, probabilities = get_true_labels_and_probabilities(model, val_ds)

    results = []

    for threshold in THRESHOLDS:
        result = evaluate_threshold(true_labels, probabilities, threshold)
        results.append(result)

        print(
            f"Threshold {threshold:.2f} -> "
            f"accuracy: {result['accuracy']:.4f}, "
            f"precision: {result['precision']:.4f}, "
            f"recall: {result['recall']:.4f}, "
            f"false accepts: {result['false_accepts']}, "
            f"false rejects: {result['false_rejects']}"
        )

    best_result = find_best_threshold(results)

    print("\nNajboljši threshold:")
    print(json.dumps(best_result, indent=4))

    save_results(results, best_result)


if __name__ == "__main__":
    main()