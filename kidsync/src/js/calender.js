const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
];

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];


const monthYearText = document.getElementById("monthYear");
const daysContainer = document.getElementById("daysContainer");
const eventsContainer = document.getElementById("eventsContainer");


let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();


const events = [
    { date: "2025-11-10", title: "School Opening Day", desc: "First day of term." },
    { date: "2025-11-22", title: "Sports Day", desc: "Inter-class competitions." },
    { date: "2025-11-30", title: "Parents Meeting", desc: "End-term parent briefing." }
];



function loadCalendar() {
    
    daysContainer.innerHTML = "";

    
    monthYearText.textContent = `${monthNames[currentMonth]} ${currentYear}`;

    
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();

    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

    
    dayNames.forEach(day => {
        const div = document.createElement("div");
        div.classList.add("day-name");
        div.textContent = day;
        daysContainer.appendChild(div);
    });


    for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement("div");
        daysContainer.appendChild(empty);
    }

    
    for (let day = 1; day <= totalDays; day++) {
        const div = document.createElement("div");
        div.classList.add("day");
        div.textContent = day;

        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        
        const event = events.find(ev => ev.date === dateStr);
        if (event) {
            div.classList.add("event");
            div.title = event.title;
            div.onclick = () => showEvents(dateStr);
        }

        daysContainer.appendChild(div);
    }
}


function showEvents(dateStr) {
    eventsContainer.innerHTML = "";

    const todaysEvents = events.filter(ev => ev.date === dateStr);

    todaysEvents.forEach(ev => {
        const box = document.createElement("div");
        box.classList.add("event-item");

        box.innerHTML = `
            <h4>${ev.title}</h4>
            <p class="event-date">${ev.date}</p>
            <p class="event-desc">${ev.desc}</p>
            <button class="event-btn" onclick="rsvp(this)">RSVP</button>
        `;

        eventsContainer.appendChild(box);
    });
}


function rsvp(btn) {
    btn.textContent = "✓ Attending";
    btn.classList.add("attending");
    btn.disabled = true;
}


window.addEventListener("load", () => {
    loadCalendar();
});


document.getElementById("prevMonth").onclick = () => {
    if (currentMonth === 0) {
        currentMonth = 11;
        currentYear--;
    } else {
        currentMonth--;
    }
    loadCalendar();
};

document.getElementById("nextMonth").onclick = () => {
    if (currentMonth === 11) {
        currentMonth = 0;
        currentYear++;
    } else {
        currentMonth++;
    }
    loadCalendar();
};
