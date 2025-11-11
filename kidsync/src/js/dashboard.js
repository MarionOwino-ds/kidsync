let kids = [];
let current = null;

window.addEventListener("load", () => {
    checkAuth();
    const user = getUser();
    document.getElementById("userName").textContent = user.name.split(" ")[0];
    document.getElementById("avatar").textContent = user.name.split(" ").map(n => n[0]).join("");
    kids = getKids();
    renderKids();
});

function selectKid(id) {
    localStorage.setItem('selectedKidId', id);
    window.location.href = 'kid-dashboard.html';
}

function viewKidDashboard(kidId) {
    localStorage.setItem('selectedKidId', kidId);
    window.location.href = 'kid-dashboard.html';
}

function openLocation(kidId) {
    localStorage.setItem('selectedKidId', kidId);
    window.location.href = 'location.html';
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