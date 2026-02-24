//divs
export let mainDiv = document.getElementById("main")
export let personalTable = document.getElementById("personal-table")
export let filterDiv = document.getElementById("filter")
export let personalFilterDiv = document.getElementById("personal-filter")

//util
export let times = [
    "8:00 - 8:45",
    "9:00 - 9:45",
    "10:00 - 10:45",
    "11:00 - 11:45",
    "12:00 - 12:45",
    "13:00 - 13:45",
    "14:00 - 14:45",
    "15:00 - 15:45",
    "16:00 - 16:45",
    "17:00 - 17:45",
    "18:00 - 18:45",
    "19:00 - 19:45",
    "20:00 - 20:45",
]
export let startPeriod = 0 //inclusive
export let endPeriod = 13 //exclusive
export let startDayCode = -1 //inclusive
export let endDayCode = 5 //exclusive

//data
export let days = null
export let lessons = null
export let filteredData = null

export let data = null
export let filters = {
    subjects: null,
    teachers: null,
    classrooms: null,
    classes: null
}

//functions
export function setDays(value) {
    days = value
}

export function setData(value) {
    lessons = value
}

export function setFilteredData(value) {
    filteredData = value
}


export function setFilters(key, value) {
    if (value.length === 0) {
        filters[key] = null
        return
    }
    filters[key] = value
    console.log(filters[key])
}

export function setCoordinates(elem, x, y) {
    elem.setAttribute("data-x", x)
    elem.setAttribute("data-y", y)
}

export function setAfterFetch(json) {
    days = json.days
    lessons = json.lessons
    data = json.data
    filteredData = json['filter_data']
}