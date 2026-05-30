import json
import os
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import tensorflow as tf
from sklearn.metrics import classification_report, confusion_matrix

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
THRESHOLD = 0.5


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


def create_datasets():
    train_ds = tf.keras.utils.image_dataset_from_directory(
        DATASET_DIR,
        validation_split=VALIDATION_SPLIT,
        subset="training",
        seed=SEED,
        image_size=IMAGE_SIZE,
        batch_size=BATCH_SIZE,
        label_mode="binary",
    )

    val_ds = tf.keras.utils.image_dataset_from_directory(
        DATASET_DIR,
        validation_split=VALIDATION_SPLIT,
        subset="validation",
        seed=SEED,
        image_size=IMAGE_SIZE,
        batch_size=BATCH_SIZE,
        label_mode="binary",
        shuffle=False,
    )

    class_names = train_ds.class_names
    print("Razredi:", class_names)

    with open(MODEL_DIR / "class_names.json", "w") as file:
        json.dump(class_names, file, indent=4)

    AUTOTUNE = tf.data.AUTOTUNE

    train_ds = train_ds.cache().shuffle(1000).prefetch(buffer_size=AUTOTUNE)
    val_ds = val_ds.cache().prefetch(buffer_size=AUTOTUNE)

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

    return model



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


# Vrednotenje modela


def evaluate_model(model, val_ds, class_names):
    probabilities = model.predict(val_ds)
    predicted_classes = (probabilities >= THRESHOLD).astype(int).flatten()

    true_classes = []

    for _, labels in val_ds:
        true_classes.extend(labels.numpy().astype(int).flatten())

    true_classes = np.array(true_classes)

    report = classification_report(
        true_classes,
        predicted_classes,
        target_names=class_names,
        zero_division=0,
    )

    matrix = confusion_matrix(true_classes, predicted_classes)

    print("\nClassification report:")
    print(report)

    print("\nConfusion matrix:")
    print(matrix)

    with open(RESULTS_DIR / "classification_report.txt", "w") as file:
        file.write(report)

    with open(RESULTS_DIR / "confusion_matrix.txt", "w") as file:
        file.write(str(matrix))


def main():
    check_dataset()

    train_ds, val_ds, class_names = create_datasets()

    model = build_model()
    model.summary()

    callbacks = [
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

    history = model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=EPOCHS,
        callbacks=callbacks,
    )

    model.save(MODEL_DIR / "pencil_classifier.keras")

    config = {
        "image_size": IMAGE_SIZE,
        "batch_size": BATCH_SIZE,
        "epochs": EPOCHS,
        "learning_rate": LEARNING_RATE,
        "validation_split": VALIDATION_SPLIT,
        "threshold": THRESHOLD,
        "model": "MobileNetV2 transfer learning",
        "classes": class_names,
    }

    with open(MODEL_DIR / "training_config.json", "w") as file:
        json.dump(config, file, indent=4)

    save_training_plots(history)
    evaluate_model(model, val_ds, class_names)

    print("\nModel je uspešno naučen.")
    print(f"Model shranjen v: {MODEL_DIR / 'pencil_classifier.keras'}")
    print(f"Rezultati shranjeni v: {RESULTS_DIR}")


if __name__ == "__main__":
    main()
