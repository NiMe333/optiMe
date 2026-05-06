import os
import sys
import csv
from pathlib import Path
from datetime import datetime, timezone
from collections import defaultdict
from zoneinfo import ZoneInfo

# ---------------------------------------------------------------------
# Add the ccl-segb parser to Python's import path.
#
# You need to have cloned this repo first:
#   git clone https://github.com/cclgroupltd/ccl-segb.git ./ccl-segb
# ---------------------------------------------------------------------
sys.path.insert(0, os.path.abspath("./ccl-segb"))

import ccl_segb

# ---------------------------------------------------------------------
# Location of synced iPhone App.InFocus data on macOS.
#
# This is where macOS stores remote Biome app focus events synced
# from your iPhone.
# ---------------------------------------------------------------------
REMOTE_DIR = Path(os.path.expanduser(
    "~/Library/Biome/streams/restricted/App.InFocus/remote"
))

# Local timezone used for daily grouping.
LOCAL_TZ = ZoneInfo("Europe/Ljubljana")

# Output files.
EVENTS_CSV = "iphone_realtime_events.csv"
DAILY_CSV = "iphone_realtime_daily_usage.csv"
TOTALS_CSV = "iphone_realtime_daily_totals.csv"


# ---------------------------------------------------------------------
# Ignore system UI events that are not real user app usage.
# ---------------------------------------------------------------------
IGNORE_PREFIXES = (
    "com.apple.SpringBoard",
    "com.apple.springboard",
    "com.apple.control-center",
)


def read_varint(data, i):
    """
    Read a protobuf-style varint from binary data.

    Apple Biome records are stored in a protobuf-like binary format.
    Numbers in protobuf are often encoded as varints.

    Args:
        data: Raw bytes from one SEGB record.
        i: Current byte index.

    Returns:
        A tuple: (decoded_value, new_index)
    """
    shift = 0
    result = 0

    while i < len(data):
        b = data[i]
        result |= (b & 0x7F) << shift
        i += 1

        # If the high bit is not set, this is the last byte of the varint.
        if not (b & 0x80):
            return result, i

        shift += 7

    return None, i


def parse_proto_strings_and_state(data):
    """
    Parse one App.InFocus payload.

    The payload is protobuf-like. For this specific stream:

    - Field 3 appears to be the active/inactive flag:
        1 = app entered foreground / became active
        0 = app left foreground / became inactive

    - One of the string fields contains the app bundle identifier,
      for example:
        com.google.ios.youtube
        com.facebook.Facebook
        com.openai.chat

    Args:
        data: Raw bytes from one SEGB record.

    Returns:
        (app_bundle_id, active_state)

        Example:
            ("com.google.ios.youtube", 1)
            ("com.google.ios.youtube", 0)
    """
    i = 0
    active = None
    strings = []

    while i < len(data):
        key, i = read_varint(data, i)

        if key is None:
            break

        field = key >> 3
        wire = key & 7

        # Wire type 0 = varint
        if wire == 0:
            value, i = read_varint(data, i)

            # Field 3 is the active/inactive state.
            if field == 3:
                active = value

        # Wire type 1 = 64-bit value
        elif wire == 1:
            i += 8

        # Wire type 2 = length-delimited value, often a string
        elif wire == 2:
            length, i = read_varint(data, i)
            raw = data[i:i + length]
            i += length

            try:
                s = raw.decode("utf-8", errors="ignore")

                # Bundle identifiers contain dots.
                if "." in s:
                    strings.append(s)

            except Exception:
                pass

        # Wire type 5 = 32-bit value
        elif wire == 5:
            i += 4

        # Unknown wire type; stop parsing this record safely.
        else:
            break

    app = None

    # Pick the first valid-looking app bundle identifier.
    for s in strings:
        if s.startswith(("com.", "net.", "org.", "io.")):
            if not any(s.startswith(prefix) for prefix in IGNORE_PREFIXES):
                app = s
                break

    return app, active


def get_record_time(record):
    """
    Extract timestamp from a ccl-segb record.

    Different SEGB versions may expose timestamp fields under slightly
    different attribute names, so we try multiple possibilities.

    Returns:
        A timezone-aware UTC datetime, or None.
    """
    for attr in ["creation_timestamp", "timestamp1", "timestamp"]:
        ts = getattr(record, attr, None)

        if isinstance(ts, datetime):
            return ts.astimezone(timezone.utc)

    return None


# ---------------------------------------------------------------------
# Step 1: Read all raw App.InFocus events from remote iPhone Biome files.
# ---------------------------------------------------------------------
raw_events = []

for file in sorted(REMOTE_DIR.glob("*/*")):
    if not file.is_file():
        continue

    device_id = file.parent.name
    print("Reading:", file)

    try:
        for record in ccl_segb.read_segb_file(str(file)):
            ts = get_record_time(record)

            if not ts:
                continue

            app, active = parse_proto_strings_and_state(record.data or b"")

            # Skip records without a valid app bundle ID.
            if not app:
                continue

            # Only keep active/inactive events.
            if active not in (0, 1):
                continue

            raw_events.append({
                "timestamp": ts,
                "device_id": device_id,
                "app": app,
                "active": active,
                "source_file": str(file),
                "offset": getattr(record, "data_start_offset", ""),
            })

    except Exception as e:
        print("ERROR:", file, e)


# Sort all events chronologically.
raw_events.sort(key=lambda x: x["timestamp"])


# ---------------------------------------------------------------------
# Step 2: Convert raw active/inactive events into usage sessions.
#
# Example:
#   19:00 YouTube active=1
#   19:45 YouTube active=0
#
# becomes:
#   YouTube session from 19:00 to 19:45 = 45 minutes
# ---------------------------------------------------------------------
sessions = []

# Tracks currently active app per device.
current = {}

for ev in raw_events:
    device = ev["device_id"]
    app = ev["app"]
    active = ev["active"]
    ts = ev["timestamp"]

    key = device

    if active == 1:
        # If another app was already active, close it at this timestamp.
        # This handles cases where the previous app does not have a clean
        # active=0 event before a new app becomes active.
        if key in current:
            prev = current[key]
            duration = (ts - prev["start"]).total_seconds()

            # Ignore impossible or extremely long sessions.
            if 0 < duration <= 6 * 60 * 60:
                sessions.append({
                    "start": prev["start"],
                    "end": ts,
                    "duration_seconds": int(duration),
                    "device_id": device,
                    "app": prev["app"],
                })

        # Start a new session.
        current[key] = {
            "app": app,
            "start": ts,
        }

    elif active == 0:
        # Close the session only if the inactive event matches
        # the app that is currently active.
        if key in current and current[key]["app"] == app:
            start = current[key]["start"]
            duration = (ts - start).total_seconds()

            if 0 < duration <= 6 * 60 * 60:
                sessions.append({
                    "start": start,
                    "end": ts,
                    "duration_seconds": int(duration),
                    "device_id": device,
                    "app": app,
                })

            del current[key]


# ---------------------------------------------------------------------
# Step 3: Aggregate sessions by day and app.
# ---------------------------------------------------------------------
daily_app = defaultdict(int)
daily_total = defaultdict(int)

for session in sessions:
    # Convert UTC timestamp to local time before grouping by date.
    local_day = session["start"].astimezone(LOCAL_TZ).date().isoformat()

    daily_app[(local_day, session["app"])] += session["duration_seconds"]
    daily_total[local_day] += session["duration_seconds"]


# ---------------------------------------------------------------------
# Step 4: Export detailed session-level CSV.
#
# This file contains every individual app usage session.
# ---------------------------------------------------------------------
with open(EVENTS_CSV, "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)

    writer.writerow([
        "start",
        "end",
        "duration_seconds",
        "duration_minutes",
        "app",
        "device_id",
    ])

    for session in sessions:
        writer.writerow([
            session["start"].astimezone(LOCAL_TZ).isoformat(),
            session["end"].astimezone(LOCAL_TZ).isoformat(),
            session["duration_seconds"],
            round(session["duration_seconds"] / 60, 2),
            session["app"],
            session["device_id"],
        ])


# ---------------------------------------------------------------------
# Step 5: Export daily app usage CSV.
#
# This is usually the main file you want.
# Each row = one app on one day.
# ---------------------------------------------------------------------
with open(DAILY_CSV, "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)

    writer.writerow([
        "date",
        "app",
        "usage_seconds",
        "usage_minutes",
        "usage_hours",
        "daily_total_seconds",
        "daily_total_minutes",
        "daily_total_hours",
    ])

    for (day, app), seconds in sorted(daily_app.items()):
        total = daily_total[day]

        writer.writerow([
            day,
            app,
            seconds,
            round(seconds / 60, 2),
            round(seconds / 3600, 2),
            total,
            round(total / 60, 2),
            round(total / 3600, 2),
        ])


# ---------------------------------------------------------------------
# Step 6: Export daily total usage CSV.
#
# This file contains only total iPhone usage per day.
# ---------------------------------------------------------------------
with open(TOTALS_CSV, "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)

    writer.writerow([
        "date",
        "total_seconds",
        "total_minutes",
        "total_hours",
    ])

    for day, seconds in sorted(daily_total.items()):
        writer.writerow([
            day,
            seconds,
            round(seconds / 60, 2),
            round(seconds / 3600, 2),
        ])


print()
print(f"Sessions: {len(sessions)}")
print(f"Exported: {EVENTS_CSV}")
print(f"Exported: {DAILY_CSV}")
print(f"Exported: {TOTALS_CSV}")

#   iPhone
#     ↓ iCloud sync
#   macOS Biome cache
#     ↓
#   SEGB parsing
#     ↓
#   CSV / analytics