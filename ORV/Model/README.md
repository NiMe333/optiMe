# Model računalniškega vida za 2FA preverjanje slike

Ta mapa vsebuje model računalniškega vida, ki preveri, ali je na naloženi sliki **kuli/pencil**. Model se uporablja kot del 2FA postopka v aplikaciji.

Ta del projekta pokriva delo člana 2: pripravo, učenje, optimizacijo in vrednotenje modela računalniškega vida. API, Docker in povezava z aplikacijo so del člana 3.

## Namen

Model rešuje problem **binarne klasifikacije slik**.

Razreda sta:

- `pencil` - pravilna slika, na kateri je kuli,
- `no_pencil` - napačna slika, na kateri ni kulija.

Če model napove `pencil`, se slika sprejme. Če napove `no_pencil`, se slika zavrne.

## Dataset

Dataset se nahaja v mapi:

```text
ORV/Orv_preprocessing/dataset/processed/
```

Struktura:

```text
processed/
  pencil/
  no_pencil/
```

Trenutni dataset vsebuje:

```text
pencil: 116 slik
no_pencil: 116 slik
```

Dataset je uravnotežen, ker imata oba razreda enako število slik.

## Pristop

Uporabljen je pristop **prenosnega učenja** z modelom **MobileNetV2**.

Osnovni del MobileNetV2 je uporabljen kot ekstraktor značilk. Originalni klasifikacijski del modela ni uporabljen. Namesto njega je dodan lasten klasifikacijski del za razreda `pencil` in `no_pencil`.

Dodani sloji:

```text
GlobalAveragePooling2D
Dropout
Dense sigmoid
```

Izhod modela je verjetnost, da je na sliki kuli.

## Učenje modela

Za učenje se uporablja datoteka:

```text
train_model.py
```

Skripta naredi naslednje:

1. preveri dataset,
2. prešteje slike v obeh razredih,
3. razdeli slike na učni in validacijski del,
4. uporabi stratificirano delitev podatkov,
5. pripravi slike na velikost 224x224,
6. zgradi model MobileNetV2,
7. nauči dodani klasifikacijski del,
8. izvede fine-tuning zadnjih slojev MobileNetV2,
9. optimizira odločitveni prag oziroma threshold,
10. shrani model in rezultate vrednotenja.

## Fine-tuning

Model se uči v dveh fazah.

V prvi fazi je osnovni del MobileNetV2 zamrznjen. Uči se samo dodani klasifikacijski del.

V drugi fazi se izvede **fine-tuning**, kjer se zadnji sloji MobileNetV2 odmrznejo in dodatno prilagodijo našemu datasetu.

S tem ni uporabljena samo pripravljena knjižnica, ampak je bil vnaprej naučen model prilagojen za naš konkreten problem.

## Hiperparametri

| Hiperparameter            |                     Vrednost |
| ------------------------- | ---------------------------: |
| `image_size`              |                      224x224 |
| `batch_size`              |                           16 |
| `epochs`                  |                           15 |
| `learning_rate`           |                       0.0001 |
| `fine_tune_epochs`        |                           10 |
| `fine_tune_learning_rate` |                      0.00001 |
| `fine_tune_at`            |                          100 |
| `validation_split`        |                          0.2 |
| `dropout`                 |                          0.3 |
| `threshold_values`        | 0.4, 0.5, 0.6, 0.7, 0.8, 0.9 |

## Optimizacija thresholda

Threshold je odločitveni prag, ki določa, kdaj model sliko sprejme kot `pencil`.

Model po učenju sam preveri več vrednosti thresholda:

```text
0.4, 0.5, 0.6, 0.7, 0.8, 0.9
```

Za vsako vrednost izračuna:

- accuracy,
- precision,
- recall,
- F1-score,
- false accepts,
- false rejects.

Najboljši threshold se shrani v:

```text
models/best_threshold.json
```

Trenutno izbrani najboljši threshold:

```text
threshold: 0.8
```

## Rezultati

Model je bil ovrednoten na validacijskem naboru.

Končni rezultat z najboljšim thresholdom:

```text
accuracy: 0.89
threshold: 0.8
```

Classification report:

```text
              precision    recall  f1-score   support

   no_pencil       0.95      0.83      0.89        24
      pencil       0.85      0.96      0.90        23

    accuracy                           0.89        47
   macro avg       0.90      0.89      0.89        47
weighted avg       0.90      0.89      0.89        47
```

Confusion matrix:

```text
[[20  4]
 [ 1 22]]
```

Razlaga matrike:

- 20 slik `no_pencil` je bilo pravilno zavrnjenih,
- 4 slike `no_pencil` so bile napačno sprejete kot `pencil`,
- 22 slik `pencil` je bilo pravilno sprejetih,
- 1 slika `pencil` je bila napačno zavrnjena.

## Shranjene datoteke

Po učenju se ustvarita mapi:

```text
models/
results/
```

V `models/` se shranijo:

```text
pencil_classifier.keras
best_pencil_model.keras
class_names.json
training_config.json
best_threshold.json
```

V `results/` se shranijo:

```text
accuracy.png
loss.png
classification_report.txt
confusion_matrix.txt
threshold_optimization.txt
threshold_optimization.json
```

## Napoved ene slike

Za uporabo naučenega modela na eni sliki se uporablja datoteka:

```text
predict_image.py
```

Skripta:

1. naloži shranjen model,
2. naloži razrede,
3. naloži najboljši threshold,
4. pripravi sliko na velikost 224x224,
5. izračuna verjetnost razreda `pencil`,
6. izpiše končno napoved.

Primer pravilne slike:

```text
Slika: ../Orv_preprocessing/dataset/processed/pencil/pencil_1.jpg
Threshold: 0.8
Napoved: pencil
Rezultat: pravilna slika - na sliki je kuli/pencil.
```

Primer napačne slike:

```text
Slika: ../Orv_preprocessing/dataset/processed/no_pencil/no_pencil_1.jpg
Threshold: 0.8
Napoved: no_pencil
Rezultat: napačna slika - na sliki ni kulija/pencil.
```
