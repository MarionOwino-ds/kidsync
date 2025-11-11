let current = null;
let refreshInterval;

window.addEventListener("load", () => {
    checkAuth();
    const kidId = localStorage.getItem('selectedKidId') || 1;
    current = getKidById(kidId);
    displayKidLocation(current);
    displayHistory();
    refreshInterval = setInterval(() => {
        refreshLocation();
    }, 10000);
});

window.addEventListener("beforeunload", () => {
    clearInterval(refreshInterval);
});

function displayKidLocation(kid) {
    document.getElementById("kidName").textContent = `Tracking: ${kid.name}`;
    document.getElementById("statusBadge").className = `status-badge status-${kid.status}`;
    document.getElementById("statusBadge").textContent = kid.status.toUpperCase().replace('-', ' ');
    
    const locHtml = `
        <div class="loc-row">
            <span class="loc-label">🚌 Status:</span>
            <span class="loc-value">${kid.status === 'on-bus' ? 'On Bus' : kid.status === 'at-school' ? 'At School' : 'Home'}</span>
        </div>
        <div class="loc-row">
            <span class="loc-label">📍 Latitude:</span>
            <span class="loc-value">${kid.lat}</span>
        </div>
        <div class="loc-row">
            <span class="loc-label">📍 Longitude:</span>
            <span class="loc-value">${kid.lon}</span>
        </div>
        <div class="loc-row">
            <span class="loc-label">📍 Address:</span>
            <span class="loc-value">${kid.loc}</span>
        </div>
        <div class="loc-row">
            <span class="loc-label">🚗 Speed:</span>
            <span class="loc-value">${kid.speed}</span>
        </div>
        <div class="loc-row">
            <span class="loc-label">🕐 Last Update:</span>
            <span class="loc-value">${kid.time}</span>
        </div>
    `;
    document.getElementById("locData").innerHTML = locHtml;
}

function displayHistory() {
    const kid = current;
    const historyHtml = `
        <div class="history-item">
            <div class="history-time">${kid.time}</div>
            <div class="history-info">📍 ${kid.loc} (${kid.lat}, ${kid.lon})</div>
        </div>
        <div class="history-item">
            <div class="history-time">2 mins ago</div>
            <div class="history-info">📍 School Road</div>
        </div>
        <div class="history-item">
            <div class="history-time">5 mins ago</div>
            <div class="history-info">📍 Heading to ${kid.loc}</div>
        </div>
    `;
    document.getElementById("historyList").innerHTML = historyHtml;
}

function refreshLocation() {
    current = getKidById(current.id);
    displayKidLocation(current);
    displayHistory();
}