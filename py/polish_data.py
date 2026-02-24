import json

from . import extract_data_from_regulartt
from .personal_data import *


def contains_class(target):
    split = target.split("; ")
    arr = [s for s in split if s in target_classes]
    return len(arr) > 0


def contains_subject(target):
    base = target.split(" (", 1)[0].strip()
    return base in target_subjects


def add_color_and_short_name(target):
    for cl in target:
        split = cl['subject'].split(" (", 1)
        base = split[0].strip()
        add = split[1].strip()
        cl['color'] = target_subjects[base]['color']
        cl['short_name'] = target_subjects[base]['short_name'] + " (" + add

    return target


def get_teachers(target):
    teachers = set(
        t.strip()
        for obj in target
        for t in obj['teachers'].split(" / ")
        if t.strip()
    )

    return sorted(teachers)


def get_classrooms(target):
    classrooms = set(
        obj['classroom'] for obj in target
    )

    return sorted(classrooms)


def extract_filter_data(target):
    filter_dict = {}
    subject_set = sorted(set(t['subject'] for t in target))
    for s in subject_set:
        filter_dict[s] = []

    for subject in filter_dict:
        for t in target:
            if t['subject'] == subject:
                filter_dict[subject].append({
                    "time": t['time'],
                    "day": t['day'],
                    "teachers": t['teachers'],
                    "classroom": t['classroom']
                })
    return filter_dict


def main():
    timetable, days_dict = extract_data_from_regulartt.main()
    data = sorted([obj for obj in timetable if contains_subject(obj['subject'])],
                  key=lambda s: (s['day_code'], s['start_period']))

    data = sorted([obj for obj in data if contains_class(obj['classes'])],
                  key=lambda s: (s['day_code'], s['start_period']))

    data.extend(target_labs)
    data = add_color_and_short_name(data)

    filtered_data = extract_filter_data(data)
    schedule = {
        "days": days_dict,
        "data": {
            "classes": target_classes,
            "teachers": get_teachers(data),
            "classrooms": get_classrooms(data),
            "subjects": sorted(obj for obj in filtered_data),
        },
        "filter_data": filtered_data,
        "lessons": data
    }

    with open("json/schedule.json", "w", encoding="utf-8") as f:
        json.dump(schedule, f, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    main()
