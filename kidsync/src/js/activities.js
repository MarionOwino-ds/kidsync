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
        await renderKidButtons();
        await loadActivities(currentChild.id);
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

async function renderKidButtons() {
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
    await renderKidButtons();
    await loadActivities(id);
}

async function loadActivities(childId) {
    try {
        const response = await fetch(`${API_BASE}/activities.php?child_id=${childId}&action=get`);
        const data = await response.json();

        if (data.success && data.activities && data.activities.length > 0) {
            renderActivities(data.activities);
            renderWeekly(data.activities);
        } else {
            renderNoActivities();
        }
    } catch (error) {
        console.error('Error loading activities:', error);
        renderNoActivities();
    }
}

function renderActivities(activities) {
    const gal = document.getElementById("gallery");

    if (activities && activities.length > 0) {
        // Show most recent 6 activities
        const recent = activities.slice(0, 6);
        gal.innerHTML = recent.map(a => {
            const icon = getActivityIcon(a.activity_type);
            return `
                <div class="activity-item">
                    <div class="photo">${icon}</div>
                    <div class="activity-info">
                        <h3>${a.activity_type}</h3>
                        <div class="time">${new Date(a.activity_date).toLocaleString()}</div>
                        <div class="description">${a.description || 'Activity logged'}</div>
                    </div>
                </div>
            `;
        }).join("");
    } else {
        renderDefaultActivities();
    }
}

function renderWeekly(activities) {
    const wgal = document.getElementById("weeklyGallery");

    if (activities && activities.length > 0) {
        // Get older activities for weekly highlights
        const weekly = activities.slice(6, 12);
        if (weekly.length > 0) {
            wgal.innerHTML = weekly.map(a => {
                const icon = getActivityIcon(a.activity_type);
                return `
                    <div class="activity-item">
                        <div class="photo">${icon}</div>
                        <div class="activity-info">
                            <h3>${a.activity_type}</h3>
                            <div class="time">${new Date(a.activity_date).toLocaleDateString()}</div>
                            <div class="description">${a.description || 'Great progress this week!'}</div>
                        </div>
                    </div>
                `;
            }).join("");
            return;
        }
    }

    // Default weekly content
    wgal.innerHTML = `
        <div class="activity-item">
            <div class="photo">🎉</div>
            <div class="activity-info">
                <h3>Best Week Ever!</h3>
                <div class="time">This Week</div>
                <div class="description">${currentChild.name} had an amazing week with great progress!</div>
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

function renderNoActivities() {
    const gal = document.getElementById("gallery");
    gal.innerHTML = `
        <div class="activity-item">
            <div class="photo">📋</div>
            <div class="activity-info">
                <h3>No Activities Yet</h3>
                <div class="time">Today</div>
                <div class="description">No activities have been logged for ${currentChild.name} yet</div>
            </div>
        </div>
    `;
}

function getActivityIcon(activityType) {
    const icons = {
        'reading': '📚',
        'art': '🎨',
        'sports': '⚽',
        'music': '🎵',
        'science': '🔬',
        'math': '🔢',
        'lunch': '🍽️',
        'snack': '🍎',
        'nap': '😴',
        'play': '🎮',
        'outdoor': '🌳',
        'arrival': '🚌',
        'departure': '👋'
    };
    const lowerType = (activityType || '').toLowerCase();
    return icons[lowerType] || '📍';
}

function logout() {
    localStorage.clear();
    window.location.href = 'login.html';
}