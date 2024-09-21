const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
]

function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
}
function getSuffix(day: number) {
    if (String(day).endsWith("3")) {
        return "rd"
    } else if (String(day).endsWith("2")) {
        return "nd"
    } else if (String(day).endsWith("1")) {
        return "st"
    } else return "th"
}

export default {
    months,
    getDaysInMonth,
    getSuffix
}