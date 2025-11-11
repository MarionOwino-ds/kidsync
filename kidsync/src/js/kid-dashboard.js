window.addEventListener("load", () => {
    checkAuth();
    const kidId = localStorage.getItem('selectedKidId') || 1;
    const kid = getKidById(kidId);
    if (kid) displayKidDashboard(kid);
});

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
            <div class="stat-value">${kid.msgs}</div>
        </div>
        <div class="stat-card">
            <div class="stat-icon">😴</div>
            <div class="stat-title">Sleep</div>
            <div class="stat-value">9h</div>
        </div>
        <div class="stat-card">
            <div class="stat-icon">😊</div>
            <div class="stat-title">Mood</div>
            <div class="stat-value">Happy</div>
        </div>
    `;

    document.getElementById("activityList").innerHTML = kid.activity.map(a => `
        <div class="activity-item">
            <div class="activity-time">${a.time}</div>
            <div class="activity-desc">${a.e}</div>
        </div>
    `).join("");
}