let current = null;

window.addEventListener("load", () => {
    checkAuth();
    const kids = getKids();
    current = kids[0];
    renderKids();
    renderBadges();
    renderMilestones();
    renderProgress();
});

function renderKids() {
    const sel = document.getElementById("kidSelector");
    const allKids = getKids();
    sel.innerHTML = allKids.map(k => `<button class="kid-btn ${k.id === current.id ? 'active' : ''}" onclick="selectKid(${k.id})">${k.name}</button>`).join("");
}

function selectKid(id) {
    current = getKidById(id);
    renderKids();
    renderBadges();
    renderMilestones();
    renderProgress();
}

function renderBadges() {
    const ms = getMilestonesByKid(current.id);
    const b = document.getElementById("badges");
    b.innerHTML = ms.badges?.map(badge => `<div class="badge">${badge}</div>`).join("") || "";
}

function renderMilestones() {
    const ms = getMilestonesByKid(current.id);
    const m = document.getElementById("milestones");
    m.innerHTML = ms.milestones?.map(ms => `
        <div class="milestone">
            <h3>${ms.title}</h3>
            <div class="milestone-date">${ms.date}</div>
            <div class="milestone-desc">${ms.desc}</div>
        </div>
    `).join("") || "";
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