import json
import requests


def main():
    url = "https://finki.edupage.org/timetable/server/regulartt.js"
    params = {"__func": "regularttGetData"}

    payload = {
        "__args": [None, "28"],
        "__gsh": "00000000"
    }

    headers = {
        "Content-Type": "application/json;charset=UTF-8",
        "Accept": "application/json",
        "Origin": "https://finki.edupage.org",
        "Referer": "https://finki.edupage.org/",
    }

    r = requests.post(url, params=params, json=payload, headers=headers, timeout=30)
    print("Status:", r.status_code)
    r.raise_for_status()

    data = r.json()

    with open("json/regulartt.json", "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    main()
