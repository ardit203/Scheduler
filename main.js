import {setAfterFetch} from "./js/globalVariables.js";
import {filterAndPopulateDROPDOWN} from "./js/filters.js";
import {filterAndPopulateSELECT} from "./js/personalFilters.js";


fetch('./json/schedule.json')
    .then(response => response.json())
    .then(response => main(response))
    .catch(error => {
        console.log(error)
        alert("Something wrong happened while fetching data")
    })

function main(json) {
    setAfterFetch(json)
    filterAndPopulateSELECT()
    filterAndPopulateDROPDOWN()

}






