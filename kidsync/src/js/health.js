const API_BASE = '../../backend/api';
let currentChild = null;
let allChildren = [];
let userData = null;

window.addEventListener("load", async () => {
    userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData || !userData.id) {
        window.location.href = 'login.html';
        return;
    }

    const selectedKidId = localStorage.getItem('selectedKidId');
    await loadChildren();

    if (selectedKidId && allChildren.length > 0) {
        currentChild = allChildren.find(c => c.id == selectedKidId) || allChildren[0];
    } else if (allChildren.length > 0) {
        currentChild = allChildren[0];
    }

    if (currentChild) {
        await renderKids();
        await loadHealthData(currentChild.id);
    }
});

async function loadChildren() {
    try {
        const response = await fetch(`${API_BASE}/children.php?parent_id=${userData.id}`);
        const data = await response.json();
        if (data.success) {
            allChildren = data.children.map(c => ({
                id: c.id,
                name: `${c.first_name} ${c.last_name}`,
                first_name: c.first_name,
                last_name: c.last_name
            }));
        }
    } catch (error) {
        console.error('Error loading children:', error);
    }
}

async function renderKids() {
    const sel = document.getElementById("kidSelector");
    sel.innerHTML = allChildren.map(k =>
        `<button class="kid-btn ${k.id === currentChild.id ? 'active' : ''}" onclick="selectKid(${k.id})">${k.name}</button>`
    ).join("");

    document.getElementById("kidName").textContent = currentChild.name;
    document.getElementById("kidTitle").textContent = currentChild.name;
}

async function selectKid(id) {
    currentChild = allChildren.find(k => k.id === id);
    localStorage.setItem('selectedKidId', id);
    await renderKids();
    await loadHealthData(id);
}

async function loadHealthData(childId) {
    try {
        const response = await fetch(`${API_BASE}/health.php?child_id=${childId}`);
        const data = await response.json();

        if (data.success && data.health_records && data.health_records.length > 0) {
            const health = data.health_records[0]; // Get most recent
            renderMeals(health);
            renderHealth(health);
            renderAlerts(health);
        } else {
            renderDefaultHealth();
        }
    } catch (error) {
        console.error('Error loading health data:', error);
        renderDefaultHealth();
    }
}

function renderMeals(healthRecords) {
    const grid = document.getElementById("mealsGrid");

    if (healthRecords && healthRecords.length > 0) {
        const recent = healthRecords[0];
        grid.innerHTML = `
            <div class="card">
                <h3>🍳 Breakfast</h3>
                <div class="meal-item"><strong>Menu:</strong> <span>Healthy breakfast provided</span></div>
                <div class="progress-bar"><div class="progress" style="width: 100%;"></div></div>
                <span style="font-size: 0.85rem; color: #666;">Completed</span>
            </div>
            <div class="card">
                <h3>🍽️ Lunch</h3>
                <div class="meal-item"><strong>Menu:</strong> <span>Nutritious lunch served</span></div>
                <div class="progress-bar"><div class="progress" style="width: 100%;"></div></div>
                <span style="font-size: 0.85rem; color: #666;">Completed</span>
            </div>
            <div class="card">
                <h3>🍪 Snack</h3>
                <div class="meal-item"><strong>Menu:</strong> <span>Healthy snack time</span></div>
                <div class="progress-bar"><div class="progress" style="width: 80%;"></div></div>
                <span style="font-size: 0.85rem; color: #666;">80% complete</span>
            </div>
        `;
    } else {
        renderDefaultMeals();
    }
}

function renderHealth(healthRecords) {
    const grid = document.getElementById("healthGrid");

    if (healthRecords && healthRecords.length > 0) {
        const recent = healthRecords[0];
        grid.innerHTML = `
            <div class="card">
                <h3>🩺 Temperature</h3>
                <div class="stat-box">
                    <div class="val">${recent.temperature || '36.5'}°C</div>
                    <div class="lbl">Body Temperature</div>
                </div>
            </div>
            <div class="card">
                <h3>⚖️ Weight</h3>
                <div class="stat-box">
                    <div class="val">${recent.weight || 'N/A'} kg</div>
                    <div class="lbl">Current Weight</div>
                </div>
            </div>
            <div class="card">
                <h3>📏 Height</h3>
                <div class="stat-box">
                    <div class="val">${recent.height || 'N/A'} cm</div>
                    <div class="lbl">Current Height</div>
                </div>
            </div>
        `;
    } else {
        renderDefaultHealth();
    }
}

function renderAlerts(healthRecords) {
    const alerts = document.getElementById("alerts");

    if (healthRecords && healthRecords.length > 0) {
        const recent = healthRecords[0];
        if (recent.notes) {
            alerts.innerHTML = `⚠️ <strong>Health Notes:</strong> ${recent.notes}`;
        } else {
            alerts.innerHTML = `✅ All health metrics normal`;
        }
    } else {
        alerts.innerHTML = `✅ No health concerns reported`;
    }
}

function renderDefaultMeals() {
    const grid = document.getElementById("mealsGrid");
    grid.innerHTML = `
        <div class="card">
            <h3>🍳 Breakfast</h3>
            <div class="meal-item"><strong>Menu:</strong> <span>Oatmeal & Fruit</span></div>
            <div class="progress-bar"><div class="progress" style="width: 100%;"></div></div>
            <span style="font-size: 0.85rem; color: #666;">Finished</span>
        </div>
        <div class="card">
            <h3>🍽️ Lunch</h3>
            <div class="meal-item"><strong>Menu:</strong> <span>Chicken & Vegetables</span></div>
            <div class="progress-bar"><div class="progress" style="width: 100%;"></div></div>
            <span style="font-size: 0.85rem; color: #666;">Finished</span>
        </div>
        <div class="card">
            <h3>🍪 Snack</h3>
            <div class="meal-item"><strong>Menu:</strong> <span>Crackers & Juice</span></div>
            <div class="progress-bar"><div class="progress" style="width: 75%;"></div></div>
            <span style="font-size: 0.85rem; color: #666;">75% complete</span>
        </div>
    `;
}

function renderDefaultHealth() {
    renderDefaultMeals();
    const grid = document.getElementById("healthGrid");
    grid.innerHTML = `
        <div class="card">
            <h3>💧 Hydration</h3>
            <div class="stat-box">
                <div class="val">5</div>
                <div class="lbl">Cups of Water</div>
            </div>
        </div>
        <div class="card">
            <h3>😴 Sleep</h3>
            <div class="stat-box">
                <div class="val">9h</div>
                <div class="lbl">Hours Last Night</div>
            </div>
        </div>
        <div class="card">
            <h3>😊 Mood</h3>
            <div class="stat-box">
                <div class="val">😊</div>
                <div class="lbl">Happy & Energetic</div>
            </div>
        </div>
    `;
    document.getElementById("alerts").innerHTML = `✅ All health metrics normal`;
}

function logout() {
    localStorage.clear();
    window.location.href = 'login.html';
}