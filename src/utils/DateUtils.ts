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
const days = [
    "SUN",
    "MON",
    "TUE",
    "WED",
    "THU",
    "FRI",
    "SAT"
]

function getDaysInMonth(year: number, month: number) {
    return new Date(year, month, 0).getDate();
}
function getDateFromMonth(year: number, month: number, day: number) {
    return days[new Date(year, month, day).getDay()];
}
function getSuffix(day: number) {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd"
        default: return "th";
    }
}

export default {
    months,
    days,
    getDaysInMonth,
    getDateFromMonth,
    getSuffix
}