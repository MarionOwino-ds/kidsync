let current = null;

window.addEventListener("load", () => {
    checkAuth();
    const kids = getKids();
    current = kids[0];
    renderKidButtons();
    renderActivities();
    renderWeekly();
});

function renderKidButtons() {
    const sel = document.getElementById("kidSelector");
    const allKids = getKids();
    sel.innerHTML = allKids.map(k => `<button class="kid-btn ${k.id === current.id ? 'active' : ''}" onclick="selectKid(${k.id})">${k.name}</button>`).join("");
}

function selectKid(id) {
    current = getKidById(id);
    renderKidButtons();
    renderActivities();
}

function renderActivities() {
    const activities = getActivitiesByKid(current.id);
    const gal = document.getElementById("gallery");
    gal.innerHTML = activities.map(a => `
        <div class="activity-item">
            <div class="photo">${a.title.split(' ')[0]}</div>
            <div class="activity-info">
                <h3>${a.title}</h3>
                <div class="time">${a.time}</div>
                <div class="description">${a.desc}</div>
            </div>
        </div>
    `).join("");
}

function renderWeekly() {
    const wgal = document.getElementById("weeklyGallery");
    wgal.innerHTML = `
        <div class="activity-item">
            <div class="photo">🎉</div>
            <div class="activity-info">
                <h3>Best Week Ever!</h3>
                <div class="time">This Week</div>
                <div class="description">${current.name} had an amazing week with great progress!</div>
            </div>
        </div>
        <div class="activity-item">
            <div class="photo">⭐</div>
            <div class="activity-info">
                <h3>Star Student</h3>
                <div class="time">Recognized</div>
                <div class="description">Excellent behavior and participation in class</div>
            </div>
        </div>
    `;
}