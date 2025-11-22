const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const monthYearText = document.getElementById("monthYear");
const daysContainer = document.getElementById("daysContainer");
const eventsContainer = document.getElementById("eventsContainer");

let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

// Real school events (can be fetched from API later)
const events = [
    { date: "2025-11-22", title: "📅 Today - Parent Dashboard", desc: "Check your children's activities" },
    { date: "2025-11-25", title: "🎉 Sports Day", desc: "Inter-class sports competitions" },
    { date: "2025-11-28", title: "👨‍🏫 Parent-Teacher Meeting", desc: "Discuss term progress" },
    { date: "2025-12-01", title: "🎓 Academic Review", desc: "End of term assessments" },
    { date: "2025-12-15", title: "🎄 Holiday Break Starts", desc: "School closes for holidays" },
    { date: "2026-01-05", title: "📚 New Term Begins", desc: "Back to school!" }
];

window.addEventListener("load", () => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData || !userData.id) {
        window.location.href = 'login.html';
        return;
    }

    loadCalendar();
    showUpcomingEvents();
});

function loadCalendar() {
    daysContainer.innerHTML = "";
    monthYearText.textContent = `${monthNames[currentMonth]} ${currentYear}`;

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Day headers
    dayNames.forEach(day => {
        const div = document.createElement("div");
        div.classList.add("day-name");
        div.textContent = day;
        daysContainer.appendChild(div);
    });

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement("div");
        daysContainer.appendChild(empty);
    }

    // Days
    const today = new Date();
    for (let day = 1; day <= totalDays; day++) {
        const div = document.createElement("div");
        div.classList.add("day");
        div.textContent = day;

        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        // Highlight today
        if (day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
            div.style.background = '#dbeafe';
            div.style.fontWeight = 'bold';
            div.style.border = '2px solid #2563eb';
        }

        // Mark event days
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
    eventsContainer.innerHTML = "<h3 style='color: #1e40af; margin-bottom: 1rem;'>Events on " + dateStr + "</h3>";

    const todaysEvents = events.filter(ev => ev.date === dateStr);

    if (todaysEvents.length === 0) {
        eventsContainer.innerHTML += "<p style='text-align: center; color: #999;'>No events on this day</p>";
        return;
    }

    todaysEvents.forEach(ev => {
        const box = document.createElement("div");
        box.classList.add("event-item");
        box.innerHTML = `
            <h4>${ev.title}</h4>
            <p class="event-date">📅 ${ev.date}</p>
            <p class="event-desc">${ev.desc}</p>
            <button class="event-btn" onclick="rsvp(this)">✓ Mark Attending</button>
        `;
        eventsContainer.appendChild(box);
    });
}

function showUpcomingEvents() {
    const today = new Date().toISOString().split('T')[0];
    const upcoming = events.filter(ev => ev.date >= today).slice(0, 5);

    if (upcoming.length > 0 && eventsContainer) {
        eventsContainer.innerHTML = "<h3 style='color: #1e40af; margin-bottom: 1rem;'>Upcoming Events</h3>";
        upcoming.forEach(ev => {
            const box = document.createElement("div");
            box.classList.add("event-item");
            box.innerHTML = `
                <h4>${ev.title}</h4>
                <p class="event-date">📅 ${ev.date}</p>
                <p class="event-desc">${ev.desc}</p>
                <button class="event-btn" onclick="rsvp(this)">✓ Mark Attending</button>
            `;
            eventsContainer.appendChild(box);
        });
    }
}

function rsvp(btn) {
    btn.textContent = "✓ Attending";
    btn.classList.add("attending");
    btn.disabled = true;
    btn.style.cursor = 'not-allowed';
}

function prevMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    loadCalendar();
}

function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    loadCalendar();
}

function logout() {
    localStorage.clear();
    window.location.href = 'login.html';
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
