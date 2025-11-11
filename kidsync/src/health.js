let current = null;

window.addEventListener("load", () => {
    checkAuth();
    const kids = getKids();
    current = kids[0];
    renderKids();
    renderMeals();
    renderHealth();
    renderAlerts();
});

function renderKids() {
    const sel = document.getElementById("kidSelector");
    const allKids = getKids();
    sel.innerHTML = allKids.map(k => `<button class="kid-btn ${k.id === current.id ? 'active' : ''}" onclick="selectKid(${k.id})">${k.name}</button>`).join("");
}

function selectKid(id) {
    current = getKidById(id);
    renderKids();
    renderMeals();
    renderHealth();
    renderAlerts();
}

function renderMeals() {
    const health = getHealthByKid(current.id);
    const grid = document.getElementById("mealsGrid");
    grid.innerHTML = `
        <div class="card">
            <h3>🍳 Breakfast</h3>
            <div class="meal-item"><strong>Menu:</strong> <span>${health.meals?.breakfast}</span></div>
            <div class="progress-bar"><div class="progress" style="width: 100%;"></div></div>
            <span style="font-size: 0.85rem; color: #666;">Finished</span>
        </div>
        <div class="card">
            <h3>🍽️ Lunch</h3>
            <div class="meal-item"><strong>Menu:</strong> <span>${health.meals?.lunch}</span></div>
            <div class="progress-bar"><div class="progress" style="width: 100%;"></div></div>
            <span style="font-size: 0.85rem; color: #666;">Finished</span>
        </div>
        <div class="card">
            <h3>🍪 Snack</h3>
            <div class="meal-item"><strong>Menu:</strong> <span>${health.meals?.snack}</span></div>
            <div class="progress-bar"><div class="progress" style="width: 75%;"></div></div>
            <span style="font-size: 0.85rem; color: #666;">75% complete</span>
        </div>
    `;
}

function renderHealth() {
    const health = getHealthByKid(current.id);
    const grid = document.getElementById("healthGrid");
    grid.innerHTML = `
        <div class="card">
            <h3>💧 Hydration</h3>
            <div class="stat-box">
                <div class="val">${health.hydration}</div>
                <div class="lbl">Cups of Water</div>
            </div>
        </div>
        <div class="card">
            <h3>😴 Sleep</h3>
            <div class="stat-box">
                <div class="val">${health.sleep}h</div>
                <div class="lbl">Hours Last Night</div>
            </div>
        </div>
        <div class="card">
            <h3>😊 Mood</h3>
            <div class="stat-box">
                <div class="val">${health.mood}</div>
                <div class="lbl">Today's Mood</div>
            </div>
        </div>
    `;
}

function renderAlerts() {
    const health = getHealthByKid(current.id);
    const alerts = document.getElementById("alerts");
    if (health.allergies !== "None") {
        alerts.innerHTML = `⚠️ <strong>Allergies:</strong> ${health.allergies}`;
    } else {
        alerts.innerHTML = `✅ No known allergies`;
    }
}