# iPhone Screen Time Extraction from macOS Biome Streams

Extract near real-time iPhone app usage data from macOS Biome streams and export it to CSV.

This project parses Apple's internal `App.InFocus` Biome stream, which contains foreground app activity synced from an iPhone to macOS through iCloud / Screen Time sharing.

---

# Features

- Extract iPhone foreground app activity
- Generate app usage sessions
- Export daily usage statistics
- Export total daily phone usage
- No jailbreak required
- Works entirely offline
- Uses Apple's synced Biome data on macOS

---

# Requirements

- macOS
- iPhone
- Same Apple ID on both devices
- Screen Time enabled
- Share Across Devices enabled
- Python 3.10+
- Git

---

# How It Works

```text
iPhone
   ↓
iCloud Screen Time Sync
   ↓
macOS Biome Database
   ↓
SEGB Parser
   ↓
CSV Exports
```

The script reads:

```text
~/Library/Biome/streams/restricted/App.InFocus/remote
```

These files contain foreground app transition events synced from the iPhone.

---

# Setup

## 1. Enable Screen Time Sync

### On iPhone

```text
Settings → Screen Time → Share Across Devices = ON
```

### On macOS

```text
System Settings → Screen Time → Share Across Devices = ON
```

---

# 2. Grant Full Disk Access

macOS protects the Biome database.

You must give your terminal Full Disk Access.

Go to:

```text
System Settings → Privacy & Security → Full Disk Access
```

Add one of these:

- Terminal
- VS Code

Then restart the application.

---

# 3. Project Structure

The repository already includes the `ccl-segb` parser from

```bash
git clone https://github.com/cclgroupltd/ccl-segb.git
```

You do not need to clone anything separately.

Example project structure:

```text
SysDataIOS/
├── ccl-segb/
├── daily_iphone_usage.py
├── README.md
```

---

# 4. Verify iPhone Data Exists

Run:

```bash
find ~/Library/Biome/streams/restricted/App.InFocus/remote -type f
```

If files appear, the iPhone data is synced successfully.

---

# Running the Script

Run:

```bash
python3 daily_iphone_usage.py
```

Example output:

```text
Reading: /Users/user/Library/Biome/streams/restricted/App.InFocus/remote/...

Sessions: 8214
Exported: iphone_realtime_events.csv
Exported: iphone_realtime_daily_usage.csv
Exported: iphone_realtime_daily_totals.csv
```

---

# Output Files

## `iphone_realtime_events.csv`

Contains every detected app session.

Example:

```csv
start,end,duration_seconds,app
2026-05-05T19:00:00+02:00,2026-05-05T19:45:00+02:00,2700,com.google.ios.youtube
```

---

## `iphone_realtime_daily_usage.csv`

Daily usage grouped by app.

Example:

```csv
date,app,usage_minutes
2026-05-05,com.google.ios.youtube,113.77
```

---

## `iphone_realtime_daily_totals.csv`

Total phone usage per day.

Example:

```csv
date,total_hours
2026-05-05,4.58
```

---

# Important Notes

This data is derived from:

```text
foreground enter → foreground exit
```

events.

The results are very close to Apple's Screen Time, but not always identical.

Apple's actual Screen Time system likely includes:

- idle detection
- background activity heuristics
- media playback logic
- unlock state filtering
- additional private streams

So small differences are expected.
