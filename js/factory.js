import {
    times,
    startDayCode,
    endDayCode,
    startPeriod,
    endPeriod,
    days,
    setCoordinates,
    setFilters,
    filters
} from "./globalVariables.js"
import {filterAndApply} from "./filters.js";

export function createTable() {
    let table = createElement("table")

    let tableHead = createElement("thead")
    table.appendChild(tableHead)

    let tableHeadRow = createElement("tr")
    tableHead.appendChild(tableHeadRow)

    let blank = createElement("th")
    blank.classList.add("time")
    tableHeadRow.appendChild(blank)

    let x = -1
    let y = -1
    for (const day in days) {
        let th = createElement("th")
        th.textContent = day
        setCoordinates(th, x, y)
        x++
        tableHeadRow.appendChild(th)
    }


    let tbody = createElement("tbody")
    table.appendChild(tbody)

    for (let i = startPeriod; i < endPeriod; i++) {
        let tr = createElement("tr")
        tbody.appendChild(tr)
        for (let j = startDayCode; j < endDayCode; j++) {
            let td = createElement("td")
            tr.appendChild(td)
            if (j === startDayCode) {
                td.textContent = times[i]
                td.classList.add("time")
                continue
            }

            td.appendChild(createDiv({"class": "dummy-item"}))
            tr.appendChild(td)
            setCoordinates(td, j, i)
        }
    }

    return table
}

export function createDropdown(data, id, labelText) {
    let labelId = labelText.toLowerCase() + "-dropdown-btn"
    let field = createDiv({"class": "field"})
    let label = createElement("label", {"class": "field-label", "for": labelId}, labelText)
    field.appendChild(label)

    let dropDownDiv = createDiv({"class": "dd", "id": id})
    field.appendChild(dropDownDiv)
    let btn = createElement(
        "button",
        {
            "id": labelId,
            "type": "button",
            "class": "dd-btn",
            "aria-haspopup": "listbox",
            "aria-expanded": "false"
        },
        "View all"
    )
    btn.appendChild(createElement("span", {"class": "dd-caret"}, "▾"))
    dropDownDiv.appendChild(btn)

    let elements = createDiv({"class": "dd-menu", "role": "listbox"})
    dropDownDiv.appendChild(elements)
    for (let d of data) {
        let label = createElement("label", {"class": "dd-item"})
        elements.appendChild(label)
        label.appendChild(createElement("input", {"type": "checkbox", "value": d}))
        label.innerHTML += d
    }
    return field
}

export function initCheckboxDropdown(id) {
    let root = document.getElementById(id)
    const btn = root.querySelector(".dd-btn");
    const checks = [...root.querySelectorAll('input[type="checkbox"]')];

    function setLabel() {
        const selected = checks.filter(c => c.checked).map(c => c.value);
        setFilters(id, selected)
        filterAndApply()
        btn.firstChild.textContent = selected.length ? selected.length + " Selected" : "View all ";
    }

    function open() {
        root.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
    }

    function close() {
        root.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
    }

    btn.addEventListener("click", (e) => {
        e.stopPropagation();
        root.classList.contains("open") ? close() : open();
    });

    root.addEventListener("click", (e) => e.stopPropagation());

    document.addEventListener("click", close);
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") close();
    });

    checks.forEach(c => c.addEventListener("change", setLabel));
    setLabel();
}

export function createSelect(data, id, labelText) {
    let field = createDiv({"class": "field"})
    let label = createElement("label", {"class": "field-label", "for": id}, labelText)
    field.appendChild(label)

    let wrap = createDiv({"class": "select-wrap"})
    field.appendChild(wrap)

    const select = createElement("select", {"class": "select", "id": id});
    wrap.appendChild(select)

    const placeholder = createElement("option", {"value": "", "selected": "true", "disabled": "true"}, "Select slot");
    select.appendChild(placeholder);

    const frag = document.createDocumentFragment();
    for (const item of data) {
        const opt = createElement("option", {"value": item}, item);
        frag.appendChild(opt);
    }
    select.appendChild(frag);
    return field
}

export function createDiv(attributes, text = "", color = "") {
    let div = createElement("div", attributes, text)
    if (color) div.style.background = color;
    return div;
}

export function createElement(type, attributes = null, text = '') {
    if (typeof type !== "string")
        return null

    let element = document.createElement(type)
    if (attributes != null)
        for (let attr in attributes) {
            element.setAttribute(attr, attributes[attr])
        }
    if (text !== '') {
        element.textContent = text
    }
    return element
}