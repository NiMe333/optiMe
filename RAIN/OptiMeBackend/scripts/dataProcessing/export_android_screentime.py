import subprocess
import csv
import re
from datetime import datetime
from pathlib import Path

OUTPUT_DIR = Path("./scripts/dataProcessing/data")
OUTPUT_DIR.mkdir(exist_ok=True)


def run_adb_command(command):
    result = subprocess.run(
        command,
        shell=True,
        capture_output=True,
        text=True
    )

    if result.returncode != 0:
        raise Exception(result.stderr)

    return result.stdout


def time_to_minutes(time_str):
    """
    Pretvori:
    46:56 -> minute
    01:11 -> minute
    02:35 -> minute
    """

    try:
        parts = time_str.split(":")

        if len(parts) == 2:
            minutes = int(parts[0])
            seconds = int(parts[1])

            return round(minutes + (seconds / 60), 2)

        return 0

    except:
        return 0


print("Preverjam Android napravo...")

devices_output = run_adb_command("adb devices")

connected_devices = []

for line in devices_output.splitlines():
    if "\tdevice" in line:
        connected_devices.append(line.split("\t")[0])

if not connected_devices:
    raise Exception("Ni povezane Android naprave.")

print(f"Najdena naprava: {connected_devices[0]}")

print("Berem usage stats...")

usage_output = run_adb_command(
    "adb shell dumpsys usagestats"
)

# Samsung / Android 7-8 format
pattern = re.compile(
    r'package=([\w\.]+)\s+totalTime="([\d:]+)"\s+lastTime="([^"]+)"'
)

results = []

for match in pattern.finditer(usage_output):
    package_name = match.group(1)
    total_time = match.group(2)
    last_time = match.group(3)

    total_minutes = time_to_minutes(total_time)

    # preskoči app-e z 0 usage
    if total_minutes <= 0:
        continue

    results.append({
        "package_name": package_name,
        "total_time": total_time,
        "total_minutes": total_minutes,
        "last_time": last_time
    })

# sortiraj po usage času
results.sort(
    key=lambda x: x["total_minutes"],
    reverse=True
)

now = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")

output_file = OUTPUT_DIR / f"android_screentime_{now}.csv"

print(f"Shranjujem CSV: {output_file}")

with open(output_file, "w", newline="", encoding="utf-8") as csvfile:
    writer = csv.writer(csvfile)

    writer.writerow([
        "package_name",
        "total_time",
        "total_minutes",
        "last_time",
        "exported_at"
    ])

    for row in results:
        writer.writerow([
            row["package_name"],
            row["total_time"],
            row["total_minutes"],
            row["last_time"],
            datetime.now().isoformat()
        ])

print("DONE")
print(f"CSV ustvarjen: {output_file}")