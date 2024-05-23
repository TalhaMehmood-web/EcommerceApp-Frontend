const startYear = 1990;
let endYear = 2024;
const years = [];

for (let year = startYear; year <= endYear; year++) {
    years.push(year);
}



const currentYear = new Date().getFullYear();
if (currentYear === 2025) {
    years.shift();
    endYear = currentYear;
}
export const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];




export default years;
