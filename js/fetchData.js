export async function fetchData() {
    let response = await fetch('../json/schedule.json')
    return await response.json()
}