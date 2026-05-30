# RAIN

## Zagon

Pred zagonom mora biti Docker Desktop zagnan.

```bash
cd ./RAIN
./run.sh
```

Skripta zažene:

- Mosquitto MQTT broker
- backend API
- MQTT processor

---

## Porti

```txt
3000 - backend API
1883 - MQTT
9001 - MQTT WebSocket
```

---

## Logi

### Vsi logi

```bash
docker compose logs -f
```

### Backend

```bash
docker compose logs -f backend
```

### MQTT processor - Heartbeat

```bash
docker compose logs -f mqtt-processor
```

### Mosquitto

```bash
docker compose logs -f mosquitto
```

---

## Test backenda

```bash
curl http://localhost:3000
```

Pričakovan odgovor:

```txt
Backend is running
```

---

## Ustavitev

```bash
docker compose down
```

## Imagi

```bash
docker images
```

---

## Pomembno

Telefon in računalnik morata biti v istem omrežju.
