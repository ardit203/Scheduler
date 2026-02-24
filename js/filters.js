import {createDiv, createDropdown, createTable, initCheckboxDropdown} from "./factory.js";
import * as global from "./globalVariables.js";
import * as overlay from "./overlay.js";

export function filterAndPopulateDROPDOWN() {
    let subjects = createDropdown(global.data.subjects, "subjects", "Subjects")
    global.filterDiv.appendChild(subjects)
    initCheckboxDropdown("subjects")

    let teachers = createDropdown(global.data.teachers, "teachers", "Teachers")
    global.filterDiv.appendChild(teachers)
    initCheckboxDropdown("teachers")

    let classrooms = createDropdown(global.data.classrooms, "classrooms", "Classrooms")
    global.filterDiv.appendChild(classrooms)
    initCheckboxDropdown("classrooms")

    let classes = createDropdown(global.data.classes, "classes", "Classes")
    global.filterDiv.appendChild(classes)
    initCheckboxDropdown("classes")

    filterAndApply()
}


export function filterAndApply() {
    let filteredLessons = global.filters.subjects != null
        ? global.lessons.filter(d => global.filters.subjects.includes(d.subject))
        : global.lessons


    filteredLessons = global.filters.teachers != null
        ? filteredLessons.filter(d => containsTeacher(d.teachers))
        : filteredLessons

    filteredLessons = global.filters.classrooms != null
        ? filteredLessons.filter(d => global.filters.classrooms.includes(d.classroom))
        : filteredLessons

    filteredLessons = global.filters.classes != null
        ? filteredLessons.filter(d => containsClass(d.classes))
        : filteredLessons

    populateTable(global.mainDiv, filteredLessons)
}

export function populateTable(div, lessons) {
    div.innerHTML = ""
    let table = createTable()
    div.appendChild(table)
    lessons.forEach(lesson => {
        for (let period of lesson.periods) {
            const el = table.querySelector(`[data-x="${lesson.day_code}"][data-y="${period}"]`)
                .getElementsByClassName("dummy-item")[0];

            let subItem = createDiv({"class": "sub-item"}, "", lesson.color)
            el.appendChild(subItem)
            subItem.addEventListener("click", () => overlay.showOverlay(lesson));

            let classroom = createDiv({"class": "small"}, lesson.classroom)
            let subject = createDiv({"class": "name"}, lesson['short_name'])

            subItem.appendChild(classroom)
            subItem.appendChild(subject)
        }
    })
}

function containsClass(classes) {
    let split = classes.split("; ")
    let filter = split.filter(s => global.filters.classes.includes(s))
    return filter.length > 0
}

function containsTeacher(teachers) {
    let split = teachers.split(" / ")
    let filter = split.filter(s => global.filters.teachers.includes(s))
    return filter.length > 0
}