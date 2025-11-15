window.addEventListener("load", () => {
    checkAuth();

    const kidId = localStorage.getItem('selectedKidId') || 1;
    const kid = getKidById(kidId);

    if (kid) displayKidDashboard(kid);
});

const kids = [
    { id: 1, name: "Daudi Okelo", age: 5, grade: "Grade 1", emoji: "🧒", status: "at-school", meals: "2 of 3", messages: 3, sleep: "9.5 hrs", mood: "Happy", activity: [{time: "8:15 AM", e: "Boarded Bus"}, {time: "8:45 AM", e: "Arrived at School"}, {time: "9:00 AM", e: "🍽️ Breakfast"}] },
    { id: 2, name: "Zainab Ahmed", age: 4, grade: "Pre-K", emoji: "👧", status: "at-school", meals: "2 of 3", messages: 1, sleep: "8.5 hrs", mood: "Energetic", activity: [{time: "8:00 AM", e: "Boarded Bus"}, {time: "8:30 AM", e: "Arrived at School"}] },
    { id: 3, name: "Liam Johnson", age: 6, grade: "Grade 2", emoji: "👦", status: "at-school", meals: "2 of 3", messages: 5, sleep: "9 hrs", mood: "Playful", activity: [{time: "8:10 AM", e: "Boarded Bus"}, {time: "8:40 AM", e: "Arrived at School"}] }
];

function getKidById(id) {
    return kids.find(k => k.id == id);
}

function displayKidDashboard(kid) {
    document.getElementById("pageTitle").textContent = `${kid.name}'s Dashboard`;
    
    document.getElementById("kidCard").innerHTML = `
        <div class="kid-avatar">${kid.emoji}</div>
        <div class="kid-name">${kid.name}</div>
        <div class="kid-info">${kid.age} years old • ${kid.grade}</div>
        <div class="status-badge status-${kid.status}">${kid.status === 'at-school' ? 'At School' : 'On Bus'}</div>
    `;

    document.getElementById("statsGrid").innerHTML = `
        <div class="stat-card">
            <div class="stat-icon">🍽️</div>
            <div class="stat-title">Meals Today</div>
            <div class="stat-value">${kid.meals}</div>
        </div>
        <div class="stat-card">
            <div class="stat-icon">💬</div>
            <div class="stat-title">Messages</div>
            <div class="stat-value">${kid.messages}</div>
        </div>
        <div class="stat-card">
            <div class="stat-icon">😴</div>
            <div class="stat-title">Sleep</div>
            <div class="stat-value">${kid.sleep}</div>
        </div>
        <div class="stat-card">
            <div class="stat-icon">😊</div>
            <div class="stat-title">Mood</div>
            <div class="stat-value">${kid.mood}</div>
        </div>
    `;

    document.getElementById("activityList").innerHTML = kid.activity.map(a => `
        <div class="activity-item">
            <div class="activity-time">${a.time}</div>
            <div class="activity-desc">${a.e}</div>
        </div>
    `).join("");
}
