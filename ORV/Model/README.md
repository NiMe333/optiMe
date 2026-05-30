# Model računalniškega vida za 2FA preverjanje slike

Ta mapa vsebuje model računalniškega vida, ki preveri, ali je na naloženi sliki **kuli/pencil**. Model se uporablja kot del 2FA postopka v aplikaciji.

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

Osnovni del MobileNetV2 je uporabljen kot ekstraktor značilk. Originalni klasifikacijski del ni uporabljen. Namesto njega je dodan lasten klasifikacijski del za razreda `pencil` in `no_pencil`.

Dodani sloji:

```text
GlobalAveragePooling2D
Dropout
Dense sigmoid
```

Izhod modela je verjetnost, da je na sliki kuli.

## Hiperparametri

| Hiperparameter   | Vrednost |
| ---------------- | -------: |
| image_size       |  224x224 |
| batch_size       |       16 |
| epochs           |       15 |
| learning_rate    |   0.0001 |
| validation_split |      0.2 |
| threshold        |      0.5 |
| dropout          |      0.3 |

## Učenje modela

Za učenje se uporablja datoteka:

```text
train_model.py
```

Skripta:

1. preveri dataset,
2. razdeli slike na učni in validacijski del,
3. uporabi stratificirano delitev podatkov,
4. pripravi slike na velikost 224x224,
5. zgradi model MobileNetV2,
6. nauči dodani klasifikacijski del,
7. shrani model in rezultate.

Primer delitve podatkov:

```text
Train no_pencil: 92
Train pencil: 93
Validation no_pencil: 24
Validation pencil: 23
```

## Rezultati

Model je bil ovrednoten z metrikami:

- accuracy,
- precision,
- recall,
- F1-score,
- confusion matrix.

Trenutna točnost na validacijskem naboru:

```text
accuracy: 0.77
```

Confusion matrix:

```text
[[18  6]
 [ 5 18]]
```

To pomeni, da je model pravilno prepoznal 18 slik `no_pencil` in 18 slik `pencil`.

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
```

V `results/` se shranijo:

```text
accuracy.png
loss.png
classification_report.txt
confusion_matrix.txt
```

## Napoved ene slike

Za uporabo naučenega modela se uporablja datoteka:

```text
predict_image.py
```

Primer pravilne slike:

```text
Slika: ../Orv_preprocessing/dataset/processed/pencil/pencil_1.jpg
Threshold: 0.5
Verjetnost za razred 1: 0.8193
Napoved: pencil
Rezultat: pravilna slika - na sliki je kuli/pencil.
```

Primer napačne slike:

```text
Slika: ../Orv_preprocessing/dataset/processed/no_pencil/no_pencil_1.jpg
Threshold: 0.5
Verjetnost za razred 1: 0.2909
Napoved: no_pencil
Rezultat: napačna slika - na sliki ni kulija/pencil.
```

## Povezava z aplikacijo

V aplikaciji uporabnik naloži sliko. Slika se pošlje modelu, model pa preveri, ali je na njej kuli.

Potek:

```text
uporabnik naloži sliko
        ↓
model obdela sliko
        ↓
napoved: pencil ali no_pencil
        ↓
slika se sprejme ali zavrne
```

Model je tako pripravljen za uporabo v 2FA postopku aplikacije.
