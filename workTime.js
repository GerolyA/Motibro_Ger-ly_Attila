//------------------------------------------------
// Db init
let db = JSON.parse(JSON.stringify(localStorage));

//------------------------------------------------
// Változók
let selectYear = document.getElementById("selectYear");
let selectMonth = document.getElementById("selectMonth");
let selectWeek = document.getElementById("selectWeek");

let selectedYear = selectYear.value;
let selectedMonth = selectMonth.value;
let selectedWeek = selectWeek.value;

//------------------------------------------------
// Első betöltés hívások
listPosts(dbFilterByDate("", selectedYear, selectedMonth, selectedWeek));
createSelectionSet(db);

//------------------------------------------------
// Metódusok/eljárások
function dbFilterByDate(searchedDate = null, searchedYear = null, searchedMonth = null, searchedWeek = null) {

    let filteredDb = {};

    for (const key in db) {
        let post = JSON.parse(db[key]);

        let year = new Date(post.date).getFullYear();
        let month = new Date(post.date).getMonth() + 1;
        let week = getDateWeek(new Date(post.date));

        let dayFilter = searchedDate ? searchedDate == post.date : true;
        let yearFilter = searchedYear ? searchedYear == year : true;
        let monthFilter = searchedMonth ? searchedMonth == month : true;
        let weekFilter = searchedWeek ? searchedWeek == week : true;

        if (dayFilter && yearFilter && monthFilter && weekFilter) {
            filteredDb[key] = JSON.stringify(post);
        }
    }
    return filteredDb;
}

function listPosts(db) {

    const table = document.getElementById('tableBody');

    for (const key in db) {

        let post = JSON.parse(db[key]);
        let row = document.createElement('tr');

        let dateCell = document.createElement('td');
        dateCell.innerHTML = post.date;
        row.appendChild(dateCell);

        let workStartCell = document.createElement('td');
        workStartCell.innerHTML = post.workStart;
        row.appendChild(workStartCell);

        let workEndCell = document.createElement('td');
        workEndCell.innerHTML = post.workEnd;
        row.appendChild(workEndCell);

        let descriptionCell = document.createElement('td');
        descriptionCell.innerHTML = post.description;
        row.appendChild(descriptionCell);

        let tagCell = document.createElement('td');
        tagCell.innerHTML = post.tag;
        row.appendChild(tagCell);


        let deleteButtonCell = document.createElement("td");
        let deleteButton = document.createElement('i');
        deleteButton.classList.add("fa-solid", "fa-trash", "text-center");
        deleteButtonCell.appendChild(deleteButton);
        deleteButton.addEventListener("click", () => {
            localStorage.removeItem(key)
            location.reload();
        });
        row.appendChild(deleteButtonCell);
        table.appendChild(row);
    };
}

function savePost(newDate, newWorkStart, newWorkEnd, newDescription, newTag) {

    let newPost = { date: newDate, workStart: newWorkStart, workEnd: newWorkEnd, description: newDescription, tag: newTag };

    localStorage.setItem(findMaxID() + 1, JSON.stringify(newPost));
    location.reload();
}

function fillDb() {
    let teszt1 = { date: "2024-01-05", workStart: "11:13", workEnd: "11:20", description: "Szerződésmódosítás letárgyalás", tag: "ügyfél" };
    let teszt2 = { date: "2024-11-22", workStart: "11:13", workEnd: "11:20", description: "Felhívás áttekintése", tag: "projekt" };
    let teszt3 = { date: "2024-09-07", workStart: "11:13", workEnd: "11:20", description: "Hiánypótlás beküldése", tag: "projekt" };
    let teszt4 = { date: "2023-09-08", workStart: "11:13", workEnd: "11:20", description: "Megbeszélés", tag: "ügyfél" };
    let teszt5 = { date: "2024-11-07", workStart: "11:13", workEnd: "11:20", description: "Szállítói szerződések rögzítése", tag: "projekt" };


    localStorage.setItem(0, JSON.stringify(teszt1));
    localStorage.setItem(1, JSON.stringify(teszt4));
    localStorage.setItem(2, JSON.stringify(teszt3));
    localStorage.setItem(3, JSON.stringify(teszt2));
    localStorage.setItem(4, JSON.stringify(teszt5));

    location.reload();
}

function clearDb() {
    localStorage.clear();
    location.reload();
}

const timeDistance = (date1, date2) => {
    let distance = Math.abs(date1 - date2);
    const hours = Math.floor(distance / 3600000);
    distance -= hours * 3600000;
    const minutes = Math.floor(distance / 60000);
    distance -= minutes * 60000;
    const seconds = Math.floor(distance / 1000);
    return `${hours}:${('0' + minutes).slice(-2)}:${('0' + seconds).slice(-2)}`;
};

function findMaxID() {

    let db = JSON.parse(JSON.stringify(localStorage));
    let maxID = 0;

    Object.keys(db).map(el => {
        maxID = Math.max(maxID, el);
    })
    return maxID;
}

function getDateWeek(date) {
    const currentDate =
        (typeof date === 'object') ? date : new Date();
    const januaryFirst =
        new Date(currentDate.getFullYear(), 0, 1);
    const daysToNextMonday =
        (januaryFirst.getDay() === 1) ? 0 :
            (7 - januaryFirst.getDay()) % 7;
    const nextMonday =
        new Date(currentDate.getFullYear(), 0,
            januaryFirst.getDate() + daysToNextMonday);

    return (currentDate < nextMonday) ? 52 :
        (currentDate > nextMonday ? Math.ceil(
            (currentDate - nextMonday) / (24 * 3600 * 1000) / 7) : 1);
}

//------------------------------------------------
// Set-ek létrehozása
function createSelectionSet(db) {
    let yearSet = new Set();
    let monthSet = new Set();
    let weekSet = new Set();

    for (const key in db) {
        let post = JSON.parse(db[key]);

        yearSet.add(new Date(post.date).getFullYear());
        monthSet.add(new Date(post.date).getMonth() + 1);
        weekSet.add(getDateWeek(new Date(post.date)));
    };

    selectYear.innerHTML = "";
    selectMonth.innerHTML = "";
    selectWeek.innerHTML = "";

    let defaultOptionYear = document.createElement("option");
    defaultOptionYear.value = "";
    defaultOptionYear.innerHTML = "Összes év";
    selectYear.appendChild(defaultOptionYear);

    let defaultOptionMonth = document.createElement("option");
    defaultOptionMonth.value = "";
    defaultOptionMonth.innerHTML = "Összes hónap";
    selectMonth.appendChild(defaultOptionMonth);

    let defaultOptionWeek = document.createElement("option");
    defaultOptionWeek.value = "";
    defaultOptionWeek.innerHTML = "Összes hét";
    selectWeek.appendChild(defaultOptionWeek);


    yearSet.forEach(year => {
        let option = document.createElement("option");
        option.value = year;
        option.innerHTML = year;
        selectYear.appendChild(option);
    });

    monthSet.forEach(month => {
        let option = document.createElement("option");
        option.value = month;
        option.innerHTML = month;
        selectMonth.appendChild(option);
    });

    weekSet.forEach(week => {
        let option = document.createElement("option");
        option.value = week;
        option.innerHTML = week;
        selectWeek.appendChild(option);
    });

    selectYear.value = selectedYear;
    selectMonth.value = selectedMonth;
    selectWeek.value = selectedWeek;
}

//------------------------------------------------
// Event listener létrehozása 

selectYear.addEventListener("change", () => {
    document.getElementById("tableBody").innerHTML = "";
    selectedYear = selectYear.value;
    let newDb = dbFilterByDate("", selectedYear, selectedMonth, selectedWeek);
    createSelectionSet(newDb);
    listPosts(newDb);
});

selectMonth.addEventListener("change", () => {
    document.getElementById("tableBody").innerHTML = "";
    selectedMonth = selectMonth.value;
    let newDb = dbFilterByDate("", selectedYear, selectedMonth, selectedWeek);
    createSelectionSet(newDb);
    listPosts(newDb);
});

selectWeek.addEventListener("change", () => {
    document.getElementById("tableBody").innerHTML = "";
    selectedWeek = selectWeek.value;
    let newDb = dbFilterByDate("", selectedYear, selectedMonth, selectedWeek);
    createSelectionSet(newDb);
    listPosts(newDb);
});

document.getElementById("clearFilters").addEventListener("click", () => {
    selectedYear = "";
    selectedMonth = "";
    selectedWeek = "";
    document.getElementById("tableBody").innerHTML = "";
    listPosts(dbFilterByDate("", "", "", ""));
    createSelectionSet(db);
})