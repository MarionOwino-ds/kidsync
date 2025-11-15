let kids = [];
let current = null;

if (!localStorage.getItem("user")) {
    localStorage.setItem(
        "user",
        JSON.stringify({ name: "Marion Angela", email: "marion@example.com" })
    );
}

if (!localStorage.getItem("kids")) {
    localStorage.setItem(
        "kids",
        JSON.stringify([
            { id: 1, firstName: "Alice", lastName: "Ngugi", grade: "Pre-K", status: "At School" },
            { id: 2, firstName: "Ben", lastName: "Otieno", grade: "Grade 1", status: "On Bus" },
            { id: 3, firstName: "Clara", lastName: "Kamau", grade: "Kindergarten", status: "Home" }
        ])
    );
}

function getUser() {
    return JSON.parse(localStorage.getItem("user"));
}

function getKids() {
    return JSON.parse(localStorage.getItem("kids"));
}

function checkAuth() {
    const user = getUser();
    if (!user) {
        window.location.href = "login.html";
    }
}

window.addEventListener("load", () => {
    checkAuth();
    const user = getUser();
    document.getElementById("userName").textContent = user.name.split(" ")[0];
    document.getElementById("avatar").textContent = user.name
        .split(" ")
        .map(n => n[0])
        .join("");
    kids = getKids();
    renderKids();
    renderActivityFeed();
    renderLocation();
});

function renderKids() {
    const container = document.getElementById("kidsGrid");
    container.innerHTML = "";
    kids.forEach(kid => {
        const div = document.createElement("div");
        div.className = "kid-card";
        div.innerHTML = `
            <div class="kid-header">
                <div class="kid-avatar">${kid.firstName[0]}</div>
                <div class="kid-info">
                    <h3>${kid.firstName} ${kid.lastName}</h3>
                    <p>${kid.grade}</p>
                </div>
            </div>
            <span class="status-badge ${kid.status === 'At School' ? 'status-at-school' : kid.status === 'On Bus' ? 'status-on-bus' : 'status-home'}">
                ${kid.status}
            </span>
            <div class="actions">
                <button class="btn btn-primary" onclick="viewKidDashboard(${kid.id})">View</button>
                <button class="btn btn-secondary" onclick="openLocation(${kid.id})">Location</button>
            </div>
        `;
        container.appendChild(div);
    });
}

function renderActivityFeed() {
    const activityFeed = document.getElementById("activityFeed");
    activityFeed.innerHTML = `
        <div class="activity-item">
            <div class="time">08:00</div>
            <div class="event">School starts</div>
        </div>
        <div class="activity-item">
            <div class="time">10:30</div>
            <div class="event">Snack break</div>
        </div>
        <div class="activity-item">
            <div class="time">12:00</div>
            <div class="event">Lunch time</div>
        </div>
        <div class="activity-item">
            <div class="time">15:00</div>
            <div class="event">Dismissal</div>
        </div>
    `;
}

function renderLocation() {
    document.getElementById("busStatus").textContent = "On Route";
    document.getElementById("locationName").textContent = "Nairobi - Thika Road";
    document.getElementById("locationTime").textContent = "12:45 PM";
    document.getElementById("latitude").textContent = "-1.2921";
    document.getElementById("longitude").textContent = "36.8219";
    document.getElementById("speed").textContent = "40 km/h";
}

function selectKid(id) {
    localStorage.setItem("selectedKidId", id);
    window.location.href = "kid-dashboard.html";
}

function viewKidDashboard(kidId) {
    localStorage.setItem("selectedKidId", kidId);
    window.location.href = "kid-dashboard.html";
}

function openLocation(kidId) {
    localStorage.setItem("selectedKidId", kidId);
    window.location.href = "location.html";
}

function openMessages() {
    alert("Opening Messages");
}

function sendMsg() {
    const inp = document.getElementById("msgInput");
    if (!inp.value.trim()) return;
    const list = document.getElementById("msgList");
    const div = document.createElement("div");
    div.className = "msg msg-parent";
    div.innerHTML = `<strong>You:</strong> ${inp.value}`;
    list.appendChild(div);
    list.scrollTop = list.scrollHeight;
    inp.value = "";
}
