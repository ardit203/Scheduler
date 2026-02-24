import {createElement, createSelect} from "./factory.js";
import * as global from "./globalVariables.js";
import {populateTable} from "./filters.js";


export function filterAndPopulateSELECT() {
    let schedule = JSON.parse(localStorage.getItem("schedule"))
    console.log(schedule)
    if (schedule == null) {
        createSelects()
        addApplyButton()
        showEmptyDiv()
    } else {
        addRemoveBtn()
        populateTable(global.personalTable, schedule)
    }
}


export function createSelects() {
    global.personalFilterDiv.innerHTML = ""
    for (let key in global.filteredData) {
        let select = createSelect(generateFields(key), key, key)
        global.personalFilterDiv.appendChild(select)
    }
}

export function showEmptyDiv() {
    global.personalTable.innerHTML = "Apply all the select fields"
}

function generateFields(key) {
    let dict = []
    for (let elem of global.filteredData[key]) {
        dict.push(elem.day + " | " + elem.time + " | " + elem.teachers)
    }
    return dict
}

export function addApplyButton() {
    if (document.getElementById("apply-filters-btn"))
        return

    let btn = createElement("button", {"id": "apply-filters-btn"}, "Apply Filters")
    global.personalFilterDiv.appendChild(btn)
    btn.addEventListener("click", () => apply())
}


export function apply() {
    let selectsElements = global.personalFilterDiv.getElementsByTagName("select")
    let selected = []

    for (let i = 0; i < selectsElements.length; i++) {
        let fields = selectsElements[i].value.split(" | ")
        if (fields.length !== 3) {
            continue
        }
        selected.push({
            subject: selectsElements[i].id,
            day: fields[0],
            time: fields[1],
            teachers: fields[2]
        })
    }

    let personalLessons = []
    selected.forEach(s => {
        let lesson = global.lessons.find(l => s.subject === l.subject && s.day === l.day && s.time === l.time && s.teachers === l.teachers)
        if (lesson) {
            personalLessons.push(lesson)
        }
    })

    localStorage.setItem("schedule", JSON.stringify(personalLessons))
    filterAndPopulateSELECT()
}


export function addRemoveBtn() {
    if (document.getElementById("remove-filters-btn"))
        return

    let btn = createElement("button", {"id": "remove-filters-btn"}, "Remove Table")
    global.personalFilterDiv.innerHTML = ""
    global.personalFilterDiv.appendChild(btn)
    btn.addEventListener("click", () => {
        localStorage.removeItem("schedule")
        filterAndPopulateSELECT()
    })
}