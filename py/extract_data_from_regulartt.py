import json
from . import request


def get_table(tables, name, cols=None):
    """
    Find a table by its name (and optionally by its data_columns).
    """
    if cols is None:
        for t in tables:
            if t["def"]["name"] == name:
                return t
        raise KeyError(f"Table not found: {name}")

    for t in tables:
        if t["def"]["name"] == name and t.get("data_columns") == cols:
            return t
    raise KeyError(f"Table not found: {name} with columns {cols}")


def decode_days(day_names, bitstr: str):
    bitstr = (bitstr or "").strip()
    return [day_names[i] for i, ch in enumerate(bitstr) if ch == "1" and i < len(day_names)]


def time_range(periods, start_period, duration):
    """
    Safe time range builder.
    Skips empty/invalid start periods.
    """
    sp = str(start_period).strip()
    if not sp.isdigit():
        return ""

    start = periods.get(sp)
    if not start:
        return ""

    dur = int(duration) if str(duration).strip().isdigit() else 1
    end_period = str(int(sp) + max(dur - 1, 0))
    end = periods.get(end_period, start)

    return f"{start['starttime']}–{end['endtime']}"


def extract_periods(start, length):
    start = int(start)
    length = int(length)
    return [p for p in range(start, start + length)]


def extract_variables(tables):
    subjects = {r["id"]: r for r in get_table(tables, "Subjects")["data_rows"]}
    teachers = {r["id"]: r for r in get_table(tables, "Teachers")["data_rows"]}
    classes = {r["id"]: r for r in get_table(tables, "Classes")["data_rows"]}
    classrooms = {r["id"]: r for r in get_table(tables, "Classrooms")["data_rows"]}
    lessons = {r["id"]: r for r in get_table(tables, "Lessons")["data_rows"]}
    cards = get_table(tables, "Cards")["data_rows"]

    # Periods table uses "period" as the key, not "id"
    periods = {str(r["period"]): r for r in get_table(tables, "Periods")["data_rows"]}

    # Days names (columns)
    days_rows = get_table(tables, "Days", ["name", "short"])["data_rows"]
    days_rows = sorted(days_rows, key=lambda x: int(x["id"]))  # keep Mon..Fri order
    day_names = [d["name"] for d in days_rows]  # ["Понеделник", "Вторник", ...]
    days_dict = {value: i for i, value in enumerate(day_names)}

    return subjects, teachers, classes, classrooms, lessons, cards, periods, days_dict, day_names


def assemble(tables):
    subjects, teachers, classes, classrooms, lessons, cards, periods, days_dict, day_names = extract_variables(tables)

    rows = []

    for c in cards:
        period = str(c.get("period", "")).strip()
        days = str(c.get("days", "")).strip()

        # IMPORTANT: skip cards that are not placed on timetable
        if not period.isdigit() or not days:
            continue

        lesson = lessons.get(c.get("lessonid"))
        if not lesson:
            continue

        duration = int(lesson.get("durationperiods", 1) or 1)

        subj = subjects.get(lesson.get("subjectid"), {})
        subject_name = subj.get("name", lesson.get("subjectid", ""))

        teacher_ids = lesson.get("teacherids", []) or []
        teacher_names = " / ".join(teachers.get(tid, {}).get("short", tid) for tid in teacher_ids)

        class_ids = lesson.get("classids", []) or []
        class_names = "; ".join(classes.get(cid, {}).get("name", cid) for cid in class_ids)

        room_ids = c.get("classroomids", []) or []
        room_names = ", ".join(classrooms.get(rid, {}).get("short", rid) for rid in room_ids)

        row = {
            "day": ", ".join(decode_days(day_names, days)),
            "day_code": days_dict[", ".join(decode_days(day_names, days))],
            "start_period": int(period),
            "duration_periods": duration,
            "time": time_range(periods, period, duration),
            "periods": extract_periods(period, duration),
            "subject": subject_name,
            "teachers": teacher_names,
            "classes": class_names,
            "classroom": room_names,
        }

        rows.append(row)

    return rows, days_dict


def main():
    request.main()
    with open("json/regulartt.json", "r", encoding="utf-8") as f:
        d2 = json.load(f)

    tables = d2["r"]["dbiAccessorRes"]["tables"]

    return assemble(tables)


if __name__ == "__main__":
    main()
