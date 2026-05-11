import os
import sqlite3
import argparse
import csv
from datetime import datetime, timezone

KNOWLEDGE_DB = os.path.expanduser(
    "~/Library/Application Support/Knowledge/knowledgeC.db"
)

QUERY = """
SELECT
    ZOBJECT.ZVALUESTRING AS app,
    (ZOBJECT.ZENDDATE - ZOBJECT.ZSTARTDATE) AS usage_seconds,
    (ZOBJECT.ZSTARTDATE + 978307200) AS start_time,
    (ZOBJECT.ZENDDATE + 978307200) AS end_time,
    (ZOBJECT.ZCREATIONDATE + 978307200) AS created_at,
    ZOBJECT.ZSECONDSFROMGMT AS timezone_offset_seconds,
    ZSOURCE.ZDEVICEID AS device_id,
    ZSYNCPEER.ZMODEL AS device_model,
    CASE
        WHEN ZSYNCPEER.ZMODEL IS NULL THEN 'Mac'
        WHEN ZSYNCPEER.ZMODEL LIKE 'iPhone%%' THEN 'iPhone'
        WHEN ZSYNCPEER.ZMODEL LIKE 'iPad%%' THEN 'iPad'
        ELSE ZSYNCPEER.ZMODEL
    END AS device_type
FROM ZOBJECT
LEFT JOIN ZSTRUCTUREDMETADATA
    ON ZOBJECT.ZSTRUCTUREDMETADATA = ZSTRUCTUREDMETADATA.Z_PK
LEFT JOIN ZSOURCE
    ON ZOBJECT.ZSOURCE = ZSOURCE.Z_PK
LEFT JOIN ZSYNCPEER
    ON ZSOURCE.ZDEVICEID = ZSYNCPEER.ZDEVICEID
WHERE ZSTREAMNAME = "/app/usage"
ORDER BY ZOBJECT.ZSTARTDATE DESC;
"""

def unix_to_iso(ts):
    if ts is None:
        return ""
    return datetime.fromtimestamp(ts, timezone.utc).isoformat()

def query_database():
    if not os.path.exists(KNOWLEDGE_DB):
        raise FileNotFoundError(f"Could not find knowledgeC.db at {KNOWLEDGE_DB}")

    if not os.access(KNOWLEDGE_DB, os.R_OK):
        raise PermissionError(
            "knowledgeC.db is not readable. Grant Full Disk Access to Terminal/iTerm/VS Code."
        )

    with sqlite3.connect(KNOWLEDGE_DB) as con:
        cur = con.cursor()
        cur.execute(QUERY)
        return cur.fetchall()

def export_csv(rows, output_path):
    headers = [
        "app",
        "usage_seconds",
        "start_time_unix",
        "end_time_unix",
        "created_at_unix",
        "start_time_utc",
        "end_time_utc",
        "created_at_utc",
        "timezone_offset_seconds",
        "device_id",
        "device_model",
        "device_type",
    ]

    with open(output_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(headers)

        for row in rows:
            app, usage, start, end, created, tz, device_id, device_model, device_type = row

            writer.writerow([
                app,
                usage,
                start,
                end,
                created,
                unix_to_iso(start),
                unix_to_iso(end),
                unix_to_iso(created),
                tz,
                device_id or "",
                device_model or "",
                device_type,
            ])

def main():
    parser = argparse.ArgumentParser(
        description="Export all Screen Time app usage from Mac and synced iOS/iPadOS devices."
    )
    parser.add_argument(
        "-o",
        "--output",
        default="screentime_all.csv",
        help="Output CSV file path"
    )
    args = parser.parse_args()

    rows = query_database()
    export_csv(rows, args.output)

    print(f"Exported {len(rows)} rows to {args.output}")

if __name__ == "__main__":
    main()