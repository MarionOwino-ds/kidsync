const API_BASE = '../../backend/api';
let currentChild = null;
let locationHistory = [];
let refreshInterval;

window.addEventListener("load", async () => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData || !userData.id) {
        window.location.href = 'login.html';
        return;
    }

    const childrenData = JSON.parse(localStorage.getItem('userChildren') || '[]');
    const childId = localStorage.getItem('selectedKidId') || (childrenData && childrenData[0]?.id);
    if (childId) {
        loadLocationData(childId);
        refreshInterval = setInterval(() => {
            loadLocationData(childId);
        }, 30000); // Refresh every 30 seconds
    }
});

window.addEventListener("beforeunload", () => {
    clearInterval(refreshInterval);
});

async function loadLocationData(childId) {
    try {
        const response = await fetch(`${API_BASE}/location.php?child_id=${childId}&action=get`);
        const data = await response.json();

        if (data.success && data.location) {
            currentChild = data.child;
            displayKidLocation(data.location, data.child);
            if (data.history) {
                locationHistory = data.history;
                displayHistory(data.history);
            }
        }
    } catch (error) {
        console.error('Error loading location:', error);
    }
}

function displayKidLocation(location, child) {
    document.getElementById("kidName").textContent = `Tracking: ${child.name}`;

    const status = location.status || 'Unknown';
    const statusClass = status.toLowerCase().replace(/\s+/g, '-');
    document.getElementById("statusBadge").className = `status-badge status-${statusClass}`;
    document.getElementById("statusBadge").textContent = status.toUpperCase();

    const locHtml = `
        <div class="loc-row">
            <span class="loc-label">🚌 Status:</span>
            <span class="loc-value">${status}</span>
        </div>
        <div class="loc-row">
            <span class="loc-label">📍 Latitude:</span>
            <span class="loc-value">${location.latitude || 'N/A'}</span>
        </div>
        <div class="loc-row">
            <span class="loc-label">📍 Longitude:</span>
            <span class="loc-value">${location.longitude || 'N/A'}</span>
        </div>
        <div class="loc-row">
            <span class="loc-label">📍 Address:</span>
            <span class="loc-value">${location.location_name || 'Unknown'}</span>
        </div>
        <div class="loc-row">
            <span class="loc-label">🚗 Speed:</span>
            <span class="loc-value">${location.speed || 0} km/h</span>
        </div>
        <div class="loc-row">
            <span class="loc-label">🕐 Last Update:</span>
            <span class="loc-value">${new Date(location.timestamp).toLocaleString()}</span>
        </div>
    `;
    document.getElementById("locData").innerHTML = locHtml;
}

function displayHistory(history) {
    if (!history || history.length === 0) {
        document.getElementById("historyList").innerHTML = '<div class="history-item"><div class="history-info">No location history available</div></div>';
        return;
    }

    const historyHtml = history.map(loc => `
        <div class="history-item">
            <div class="history-time">${new Date(loc.timestamp).toLocaleString()}</div>
            <div class="history-info">📍 ${loc.location_name} (${loc.latitude}, ${loc.longitude}) - ${loc.status}</div>
        </div>
    `).join('');
    document.getElementById("historyList").innerHTML = historyHtml;
}

function refreshLocation() {
    const childId = localStorage.getItem('selectedKidId');
    if (childId) {
        loadLocationData(childId);
    }
}

function logout() {
    localStorage.clear();
    window.location.href = 'login.html';
}