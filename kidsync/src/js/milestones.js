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
        await loadMilestones(currentChild.id);
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
    await renderKids();
    await loadMilestones(id);
}

async function loadMilestones(childId) {
    try {
        const response = await fetch(`${API_BASE}/milestones.php?child_id=${childId}`);
        const data = await response.json();

        if (data.success && data.milestones && data.milestones.length > 0) {
            renderBadges(data.milestones);
            renderMilestones(data.milestones);
        } else {
            renderNoMilestones();
        }
        renderProgress();
    } catch (error) {
        console.error('Error loading milestones:', error);
        renderDefaultContent();
    }
}

function renderBadges(milestones) {
    const badges = ['🏆', '⭐', '🎨', '📚', '🎵', '⚽'];
    const b = document.getElementById("badges");
    b.innerHTML = badges.map(badge => `<div class="badge">${badge}</div>`).join("");
}

function renderMilestones(milestones) {
    const m = document.getElementById("milestones");

    if (milestones && milestones.length > 0) {
        m.innerHTML = milestones.map(ms => `
            <div class="milestone">
                <h3>${ms.title || ms.milestone_name}</h3>
                <div class="milestone-date">${new Date(ms.date || ms.achieved_date).toLocaleDateString()}</div>
                <div class="milestone-desc">${ms.description || ms.desc || 'Great achievement!'}</div>
            </div>
        `).join("");
    } else {
        m.innerHTML = `
            <div class="milestone">
                <h3>🎯 First Day at School</h3>
                <div class="milestone-date">${new Date().toLocaleDateString()}</div>
                <div class="milestone-desc">Starting their learning journey!</div>
            </div>
        `;
    }
}

function renderProgress() {
    const p = document.getElementById("progress");
    p.innerHTML = `
        <div class="progress-item">
            <div class="progress-title">Social Skills</div>
            <div class="progress-bar"><div class="progress-fill" style="width: 85%;"></div></div>
        </div>
        <div class="progress-item">
            <div class="progress-title">Academic Progress</div>
            <div class="progress-bar"><div class="progress-fill" style="width: 78%;"></div></div>
        </div>
        <div class="progress-item">
            <div class="progress-title">Emotional Growth</div>
            <div class="progress-bar"><div class="progress-fill" style="width: 92%;"></div></div>
        </div>
        <div class="progress-item">
            <div class="progress-title">Physical Development</div>
            <div class="progress-bar"><div class="progress-fill" style="width: 88%;"></div></div>
        </div>
    `;
}

function renderDefaultContent() {
    renderBadges([]);
    renderMilestones([]);
}

function logout() {
    localStorage.clear();
    window.location.href = 'login.html';
}