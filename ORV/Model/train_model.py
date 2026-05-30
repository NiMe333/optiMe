import json
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import tensorflow as tf
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
)
from sklearn.model_selection import train_test_split


# Osnovne nastavitve

BASE_DIR = Path(__file__).resolve().parent
DATASET_DIR = BASE_DIR.parent / "Orv_preprocessing" / "dataset" / "processed"

MODEL_DIR = BASE_DIR / "models"
RESULTS_DIR = BASE_DIR / "results"

MODEL_DIR.mkdir(exist_ok=True)
RESULTS_DIR.mkdir(exist_ok=True)

IMAGE_SIZE = (224, 224)
BATCH_SIZE = 16
EPOCHS = 15
LEARNING_RATE = 0.0001
VALIDATION_SPLIT = 0.2
SEED = 42

FINE_TUNE_EPOCHS = 10
FINE_TUNE_LEARNING_RATE = 0.00001
FINE_TUNE_AT = 100

THRESHOLD_VALUES = [0.4, 0.5, 0.6, 0.7, 0.8, 0.9]


# Preverjanje dataseta

def check_dataset():
    if not DATASET_DIR.exists():
        raise FileNotFoundError(f"Dataset folder ne obstaja: {DATASET_DIR}")

    pencil_dir = DATASET_DIR / "pencil"
    no_pencil_dir = DATASET_DIR / "no_pencil"

    if not pencil_dir.exists() or not no_pencil_dir.exists():
        raise FileNotFoundError(
            "Dataset mora vsebovati mapi 'pencil' in 'no_pencil'."
        )

    pencil_count = len(list(pencil_dir.glob("*")))
    no_pencil_count = len(list(no_pencil_dir.glob("*")))

    print("Dataset:", DATASET_DIR)
    print("pencil slike:", pencil_count)
    print("no_pencil slike:", no_pencil_count)


# Priprava datasetov

def load_and_preprocess_image(image_path, label):
    image = tf.io.read_file(image_path)
    image = tf.image.decode_image(image, channels=3, expand_animations=False)
    image = tf.image.resize(image, IMAGE_SIZE)
    image.set_shape(IMAGE_SIZE + (3,))

    return image, label


def create_datasets():
    image_paths = []
    labels = []

    class_names = ["no_pencil", "pencil"]

    for label, class_name in enumerate(class_names):
        class_dir = DATASET_DIR / class_name

        for image_path in class_dir.glob("*"):
            if image_path.suffix.lower() in [".jpg", ".jpeg", ".png", ".webp"]:
                image_paths.append(str(image_path))
                labels.append(label)

    train_paths, val_paths, train_labels, val_labels = train_test_split(
        image_paths,
        labels,
        test_size=VALIDATION_SPLIT,
        random_state=SEED,
        stratify=labels,
    )

    print("Razredi:", class_names)
    print("Train no_pencil:", train_labels.count(0))
    print("Train pencil:", train_labels.count(1))
    print("Validation no_pencil:", val_labels.count(0))
    print("Validation pencil:", val_labels.count(1))

    with open(MODEL_DIR / "class_names.json", "w") as file:
        json.dump(class_names, file, indent=4)

    train_ds = tf.data.Dataset.from_tensor_slices((train_paths, train_labels))
    val_ds = tf.data.Dataset.from_tensor_slices((val_paths, val_labels))

    train_ds = train_ds.shuffle(buffer_size=len(train_paths), seed=SEED)
    train_ds = train_ds.map(
        load_and_preprocess_image,
        num_parallel_calls=tf.data.AUTOTUNE,
    )
    train_ds = train_ds.batch(BATCH_SIZE).prefetch(tf.data.AUTOTUNE)

    val_ds = val_ds.map(
        load_and_preprocess_image,
        num_parallel_calls=tf.data.AUTOTUNE,
    )
    val_ds = val_ds.batch(BATCH_SIZE).prefetch(tf.data.AUTOTUNE)

    return train_ds, val_ds, class_names


# Gradnja modela

def build_model():
    data_augmentation = tf.keras.Sequential(
        [
            tf.keras.layers.RandomFlip("horizontal"),
            tf.keras.layers.RandomRotation(0.08),
            tf.keras.layers.RandomZoom(0.1),
        ],
        name="data_augmentation",
    )

    base_model = tf.keras.applications.MobileNetV2(
        input_shape=IMAGE_SIZE + (3,),
        include_top=False,
        weights="imagenet",
    )

    base_model.trainable = False

    inputs = tf.keras.Input(shape=IMAGE_SIZE + (3,))

    x = data_augmentation(inputs)
    x = tf.keras.applications.mobilenet_v2.preprocess_input(x)
    x = base_model(x, training=False)
    x = tf.keras.layers.GlobalAveragePooling2D()(x)
    x = tf.keras.layers.Dropout(0.3)(x)

    outputs = tf.keras.layers.Dense(1, activation="sigmoid")(x)

    model = tf.keras.Model(inputs, outputs)

    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=LEARNING_RATE),
        loss="binary_crossentropy",
        metrics=["accuracy"],
    )

    return model, base_model


# Callbacki

def create_callbacks():
    return [
        tf.keras.callbacks.EarlyStopping(
            monitor="val_loss",
            patience=4,
            restore_best_weights=True,
        ),
        tf.keras.callbacks.ModelCheckpoint(
            MODEL_DIR / "best_pencil_model.keras",
            monitor="val_accuracy",
            save_best_only=True,
            mode="max",
        ),
    ]


# Risanje grafov

def save_training_plots(history):
    plt.figure()
    plt.plot(history.history["accuracy"], label="train accuracy")
    plt.plot(history.history["val_accuracy"], label="validation accuracy")
    plt.title("Točnost modela")
    plt.xlabel("Epoch")
    plt.ylabel("Accuracy")
    plt.legend()
    plt.savefig(RESULTS_DIR / "accuracy.png")
    plt.close()

    plt.figure()
    plt.plot(history.history["loss"], label="train loss")
    plt.plot(history.history["val_loss"], label="validation loss")
    plt.title("Loss modela")
    plt.xlabel("Epoch")
    plt.ylabel("Loss")
    plt.legend()
    plt.savefig(RESULTS_DIR / "loss.png")
    plt.close()


# Pridobivanje napovedi

def get_true_labels_and_probabilities(model, val_ds):
    probabilities = model.predict(val_ds, verbose=0).flatten()

    true_labels = []

    for _, labels in val_ds:
        true_labels.extend(labels.numpy().astype(int).flatten())

    return np.array(true_labels), probabilities


# Optimizacija thresholda

def optimize_threshold(model, val_ds):
    true_labels, probabilities = get_true_labels_and_probabilities(model, val_ds)

    results = []

    print("\nOptimizacija thresholda...")

    for threshold in THRESHOLD_VALUES:
        predicted_labels = (probabilities >= threshold).astype(int)

        accuracy = accuracy_score(true_labels, predicted_labels)
        precision = precision_score(true_labels, predicted_labels, zero_division=0)
        recall = recall_score(true_labels, predicted_labels, zero_division=0)
        f1 = f1_score(true_labels, predicted_labels, zero_division=0)

        matrix = confusion_matrix(true_labels, predicted_labels, labels=[0, 1])

        false_accepts = int(matrix[0][1])
        false_rejects = int(matrix[1][0])

        result = {
            "threshold": threshold,
            "accuracy": accuracy,
            "precision": precision,
            "recall": recall,
            "f1_score": f1,
            "false_accepts": false_accepts,
            "false_rejects": false_rejects,
            "confusion_matrix": matrix.tolist(),
        }

        results.append(result)

        print(
            f"Threshold {threshold:.2f} -> "
            f"accuracy: {accuracy:.4f}, "
            f"precision: {precision:.4f}, "
            f"recall: {recall:.4f}, "
            f"false accepts: {false_accepts}, "
            f"false rejects: {false_rejects}"
        )

    best_result = results[0]

    for result in results[1:]:
        better_accuracy = result["accuracy"] > best_result["accuracy"]
        same_accuracy_less_false_accepts = (
            result["accuracy"] == best_result["accuracy"]
            and result["false_accepts"] < best_result["false_accepts"]
        )

        if better_accuracy or same_accuracy_less_false_accepts:
            best_result = result

    with open(RESULTS_DIR / "threshold_optimization.json", "w") as file:
        json.dump(results, file, indent=4)

    with open(RESULTS_DIR / "threshold_optimization.txt", "w") as file:
        file.write("Threshold optimization results\n\n")

        for result in results:
            file.write(
                f"Threshold {result['threshold']:.2f} | "
                f"accuracy: {result['accuracy']:.4f} | "
                f"precision: {result['precision']:.4f} | "
                f"recall: {result['recall']:.4f} | "
                f"f1: {result['f1_score']:.4f} | "
                f"false_accepts: {result['false_accepts']} | "
                f"false_rejects: {result['false_rejects']}\n"
            )

        file.write("\nBest threshold:\n")
        file.write(json.dumps(best_result, indent=4))

    with open(MODEL_DIR / "best_threshold.json", "w") as file:
        json.dump(
            {
                "best_threshold": best_result["threshold"],
                "accuracy": best_result["accuracy"],
                "precision": best_result["precision"],
                "recall": best_result["recall"],
                "f1_score": best_result["f1_score"],
                "false_accepts": best_result["false_accepts"],
                "false_rejects": best_result["false_rejects"],
            },
            file,
            indent=4,
        )

    print("\nNajboljši threshold:")
    print(json.dumps(best_result, indent=4))

    return best_result


# Vrednotenje modela

def evaluate_model(model, val_ds, class_names, threshold):
    true_classes, probabilities = get_true_labels_and_probabilities(model, val_ds)
    predicted_classes = (probabilities >= threshold).astype(int)

    report = classification_report(
        true_classes,
        predicted_classes,
        labels=[0, 1],
        target_names=class_names,
        zero_division=0,
    )

    matrix = confusion_matrix(
        true_classes,
        predicted_classes,
        labels=[0, 1],
    )

    print("\nKončno vrednotenje z najboljšim thresholdom:")
    print("Threshold:", threshold)

    print("\nClassification report:")
    print(report)

    print("\nConfusion matrix:")
    print(matrix)

    with open(RESULTS_DIR / "classification_report.txt", "w") as file:
        file.write(f"Threshold: {threshold}\n\n")
        file.write(report)

    with open(RESULTS_DIR / "confusion_matrix.txt", "w") as file:
        file.write(f"Threshold: {threshold}\n\n")
        file.write(str(matrix))


# Glavni program

def main():
    check_dataset()

    train_ds, val_ds, class_names = create_datasets()

    model, base_model = build_model()
    model.summary()

    history = model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=EPOCHS,
        callbacks=create_callbacks(),
    )

    print("\nZačetek fine-tuning faze...")

    base_model.trainable = True

    for layer in base_model.layers[:FINE_TUNE_AT]:
        layer.trainable = False

    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=FINE_TUNE_LEARNING_RATE),
        loss="binary_crossentropy",
        metrics=["accuracy"],
    )

    fine_tune_history = model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=FINE_TUNE_EPOCHS,
        callbacks=create_callbacks(),
    )

    for key in fine_tune_history.history:
        history.history[key].extend(fine_tune_history.history[key])

    model.save(MODEL_DIR / "pencil_classifier.keras")

    best_threshold_result = optimize_threshold(model, val_ds)
    best_threshold = best_threshold_result["threshold"]

    config = {
        "image_size": IMAGE_SIZE,
        "batch_size": BATCH_SIZE,
        "epochs": EPOCHS,
        "learning_rate": LEARNING_RATE,
        "validation_split": VALIDATION_SPLIT,
        "threshold": best_threshold,
        "model": "MobileNetV2 transfer learning",
        "classes": class_names,
        "fine_tune_epochs": FINE_TUNE_EPOCHS,
        "fine_tune_learning_rate": FINE_TUNE_LEARNING_RATE,
        "fine_tune_at": FINE_TUNE_AT,
        "threshold_values": THRESHOLD_VALUES,
    }

    with open(MODEL_DIR / "training_config.json", "w") as file:
        json.dump(config, file, indent=4)

    save_training_plots(history)
    evaluate_model(model, val_ds, class_names, best_threshold)

    print("\nModel je uspešno naučen.")
    print(f"Najboljši threshold: {best_threshold}")
    print(f"Model shranjen v: {MODEL_DIR / 'pencil_classifier.keras'}")
    print(f"Rezultati shranjeni v: {RESULTS_DIR}")


if __name__ == "__main__":
    main()