const API_BASE = '../../backend/api';
let kids = [];
let current = null;
let userData = null;

function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = 'login.html';
        return false;
    }

    const userDataStr = localStorage.getItem('userData');
    if (userDataStr) {
        userData = JSON.parse(userDataStr);
    }
    return true;
}

window.addEventListener("load", async () => {
    if (!checkAuth()) return;

    // Set user name in UI
    if (userData) {
        document.getElementById("userName").textContent = userData.first_name;
        document.getElementById("avatar").textContent = (userData.first_name[0] + userData.last_name[0]).toUpperCase();
    }

    // Load children data from API
    await loadChildren();
    renderKids();
    renderActivityFeed();
    renderLocation();
    loadMessages();
});

async function loadChildren() {
    if (!userData) return;

    try {
        const response = await fetch(`${API_BASE}/children.php?parent_id=${userData.id}`);
        const data = await response.json();

        if (data.success) {
            kids = data.children;
            localStorage.setItem('userChildren', JSON.stringify(kids));
        } else {
            // Fallback to localStorage
            const storedChildren = localStorage.getItem('userChildren');
            if (storedChildren) {
                kids = JSON.parse(storedChildren);
            }
        }
    } catch (error) {
        console.error('Error loading children:', error);
        // Fallback to localStorage
        const storedChildren = localStorage.getItem('userChildren');
        if (storedChildren) {
            kids = JSON.parse(storedChildren);
        }
    }
}

function renderKids() {
    const container = document.getElementById("kidsGrid");
    container.innerHTML = "";

    if (kids.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999;">No children registered yet. <a href="signup.html">Add a child</a></p>';
        return;
    }

    kids.forEach(kid => {
        const statusClass = kid.status === 'at-school' ? 'status-at-school' :
            kid.status === 'on-bus' ? 'status-on-bus' : 'status-home';
        const statusText = kid.status === 'at-school' ? 'At School' :
            kid.status === 'on-bus' ? 'On Bus' : 'Home';

        const deviceToken = kid.device_token || 'No token';
        const deviceUrl = `http://localhost/kidsync/child-device/index.html?child_id=${kid.id}`;
        const hasNewMessages = (kid.unread_messages || 0) > 0;
        const notificationBadge = hasNewMessages ? `<span class="notification-badge">${kid.unread_messages}</span>` : '';

        const div = document.createElement("div");
        div.className = "kid-card";
        div.innerHTML = `
            ${notificationBadge}
            <div class="kid-header" onclick="viewChildMessages(${kid.id}, '${kid.first_name}')" style="cursor: pointer;" title="Click to view messages">
                <div class="kid-avatar">${kid.first_name[0]}</div>
                <div class="kid-info">
                    <h3>${kid.first_name} ${kid.last_name} ${hasNewMessages ? '🔔' : ''}</h3>
                    <p>${kid.grade} • ${kid.school_name || 'School'}</p>
                </div>
            </div>
            <span class="status-badge ${statusClass}">
                ${statusText}
            </span>
            <div class="quick-stats">
                <div class="stat" onclick="viewChildMessages(${kid.id}, '${kid.first_name}')" style="cursor: pointer;" title="Click to view messages">
                    <div class="val" style="${hasNewMessages ? 'color: #f97316; animation: pulse 2s infinite;' : ''}">${kid.unread_messages || 0}</div>
                    <div class="lbl">Messages ${hasNewMessages ? '🔔' : ''}</div>
                </div>
                <div class="stat">
                    <div class="val">${kid.activities_today || 0}</div>
                    <div class="lbl">Activities</div>
                </div>
            </div>
            <div style="background: #fef3c7; padding: 0.5rem; border-radius: 6px; margin: 0.5rem 0; font-size: 0.75rem;">
                <strong>📱 Device Token:</strong><br>
                <code style="background: #fff; padding: 0.2rem 0.4rem; border-radius: 3px; font-size: 0.7rem; display: block; margin: 0.3rem 0; word-break: break-all;">${deviceToken}</code>
                <button onclick="copyToken('${deviceToken}')" style="background: #f97316; color: white; border: none; padding: 0.3rem 0.6rem; border-radius: 4px; font-size: 0.7rem; cursor: pointer; width: 100%;">📋 Copy Token</button>
            </div>
            <div style="background: #dbeafe; padding: 0.5rem; border-radius: 6px; margin: 0.5rem 0; font-size: 0.75rem;">
                <strong>🔗 Device Simulator:</strong><br>
                <button onclick="copyUrl('${deviceUrl}')" style="background: #2563eb; color: white; border: none; padding: 0.3rem 0.6rem; border-radius: 4px; font-size: 0.7rem; cursor: pointer; width: 100%; margin-top: 0.3rem;">📋 Copy Device URL</button>
                <button onclick="window.open('${deviceUrl}', '_blank')" style="background: #10b981; color: white; border: none; padding: 0.3rem 0.6rem; border-radius: 4px; font-size: 0.7rem; cursor: pointer; width: 100%; margin-top: 0.3rem;">🚀 Open Simulator</button>
            </div>
            <div class="actions">
                <button class="btn btn-primary" onclick="viewKidDashboard(${kid.id})">📊 View</button>
                <button class="btn btn-secondary" onclick="openLocation(${kid.id})">📍 Track</button>
            </div>
        `;
        container.appendChild(div);
    });
}

function copyToken(token) {
    navigator.clipboard.writeText(token).then(() => {
        alert('✅ Device token copied to clipboard!\n\nPaste this in the child device simulator.');
    }).catch(() => {
        prompt('Copy this device token:', token);
    });
}

function copyUrl(url) {
    navigator.clipboard.writeText(url).then(() => {
        alert('✅ Device URL copied!\n\nOpen this URL in a new tab to simulate the child\'s device.');
    }).catch(() => {
        prompt('Copy this URL:', url);
    });
}

async function renderActivityFeed() {
    const activityFeed = document.getElementById("activityFeed");
    activityFeed.innerHTML = '<p style="text-align: center; color: #999;">Loading activities...</p>';

    if (kids.length === 0) {
        activityFeed.innerHTML = '<p style="text-align: center; color: #999;">No activities yet</p>';
        return;
    }

    try {
        // Load activities for first child
        const firstChild = kids[0];
        const response = await fetch(`${API_BASE}/activities.php?child_id=${firstChild.id}`);
        const data = await response.json();

        activityFeed.innerHTML = '';

        if (data.success && data.activities.length > 0) {
            data.activities.slice(0, 5).forEach(activity => {
                const time = new Date(activity.activity_time).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                });

                const div = document.createElement('div');
                div.className = 'activity-item';
                div.innerHTML = `
                    <div class="time">${time}</div>
                    <div class="event">${activity.icon} ${activity.title}</div>
                `;
                activityFeed.appendChild(div);
            });
        } else {
            activityFeed.innerHTML = '<p style="text-align: center; color: #999;">No activities today</p>';
        }
    } catch (error) {
        console.error('Error loading activities:', error);
        activityFeed.innerHTML = '<p style="text-align: center; color: #999;">Error loading activities</p>';
    }
}

async function renderLocation() {
    if (kids.length === 0) return;

    try {
        const firstChild = kids[0];
        const response = await fetch(`${API_BASE}/location.php?child_id=${firstChild.id}`);
        const data = await response.json();

        if (data.success && data.location) {
            const loc = data.location;
            document.getElementById("busStatus").textContent = firstChild.status === 'on-bus' ? 'On Route' :
                firstChild.status === 'at-school' ? 'At School' : 'Home';
            document.getElementById("locationName").textContent = loc.location_name || 'Unknown';
            document.getElementById("locationTime").textContent = new Date(loc.timestamp).toLocaleTimeString();
            document.getElementById("latitude").textContent = parseFloat(loc.latitude).toFixed(6);
            document.getElementById("longitude").textContent = parseFloat(loc.longitude).toFixed(6);
            document.getElementById("speed").textContent = parseFloat(loc.speed).toFixed(1) + ' km/h';
        } else {
            // Default values
            document.getElementById("busStatus").textContent = "No Data";
            document.getElementById("locationName").textContent = "Unknown";
            document.getElementById("locationTime").textContent = "-";
            document.getElementById("latitude").textContent = "-";
            document.getElementById("longitude").textContent = "-";
            document.getElementById("speed").textContent = "0 km/h";
        }
    } catch (error) {
        console.error('Error loading location:', error);
    }
}

async function loadMessages() {
    if (!userData || kids.length === 0) return;

    try {
        const response = await fetch(`${API_BASE}/messages.php?sender_type=parent&sender_id=${userData.id}`);
        const data = await response.json();

        const msgList = document.getElementById('msgList');
        msgList.innerHTML = '';

        if (data.success && data.messages.length > 0) {
            data.messages.slice(0, 5).forEach(msg => {
                const div = document.createElement('div');
                div.className = 'msg ' + (msg.sender_type === 'teacher' ? 'msg-teacher' : 'msg-parent');
                div.innerHTML = `<strong>${msg.sender_name}:</strong> ${msg.message}`;
                msgList.appendChild(div);
            });
        } else {
            msgList.innerHTML = '<p style="text-align: center; color: #999; padding: 1rem;">No messages yet</p>';
        }
    } catch (error) {
        console.error('Error loading messages:', error);
    }
}

function selectKid(id) {
    localStorage.setItem("selectedKidId", id);
    window.location.href = "kid-dashboard.html";
}

function viewKidDashboard(kidId) {
    localStorage.setItem("selectedKidId", kidId);
    window.location.href = "kid-dashboard.html";
}

function openLocation(kidId) {
    localStorage.setItem("selectedKidId", kidId);
    window.location.href = "location.html";
}

function openMessages() {
    alert("Opening Messages");
}

async function sendMsg() {
    const inp = document.getElementById("msgInput");
    if (!inp.value.trim() || !userData || kids.length === 0) return;

    try {
        // Send message to first child's teacher (you can modify this logic)
        const response = await fetch(`${API_BASE}/messages.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sender_type: 'parent',
                sender_id: userData.id,
                receiver_type: 'teacher',
                receiver_id: 1, // Default teacher, modify as needed
                child_id: kids[0].id,
                message: inp.value
            })
        });

        const data = await response.json();

        if (data.success) {
            const list = document.getElementById("msgList");
            const div = document.createElement("div");
            div.className = "msg msg-parent";
            div.innerHTML = `<strong>You:</strong> ${inp.value}`;
            list.appendChild(div);
            list.scrollTop = list.scrollHeight;
            inp.value = "";
        }
    } catch (error) {
        console.error('Error sending message:', error);
        alert('Failed to send message');
    }
}

function logout() {
    if (confirm("Are you sure you want to logout?")) {
        localStorage.clear();
        window.location.href = 'login.html';
    }
}

// View child messages in modal
async function viewChildMessages(childId, childName) {
    const modal = document.getElementById('messagesModal');
    const modalChildName = document.getElementById('modalChildName');
    const modalMessagesList = document.getElementById('modalMessagesList');

    modalChildName.textContent = childName;
    modalMessagesList.innerHTML = '<p style="text-align: center; color: #999;">Loading messages...</p>';
    modal.classList.add('show');

    try {
        const response = await fetch(`${API_BASE}/messages.php?child_id=${childId}`);
        const data = await response.json();

        if (data.success && data.messages && data.messages.length > 0) {
            // Filter messages for parent (from teacher)
            const parentMessages = data.messages.filter(m => m.receiver_type === 'parent');

            if (parentMessages.length > 0) {
                modalMessagesList.innerHTML = parentMessages.map(msg => {
                    const isUnread = msg.is_read === 0;
                    const time = new Date(msg.created_at).toLocaleString();

                    return `
                        <div class="message-item ${isUnread ? 'unread' : ''}">
                            <div class="message-header">
                                <span class="message-sender">📧 ${msg.sender_name || 'Teacher'} ${isUnread ? '🔔 NEW' : ''}</span>
                                <span class="message-time">${time}</span>
                            </div>
                            <div class="message-text">${msg.message}</div>
                        </div>
                    `;
                }).join('');

                // Mark messages as read
                markMessagesAsRead(childId);
            } else {
                modalMessagesList.innerHTML = '<p class="no-messages">📭 No messages from teacher yet</p>';
            }
        } else {
            modalMessagesList.innerHTML = '<p class="no-messages">📭 No messages yet</p>';
        }
    } catch (error) {
        console.error('Error loading messages:', error);
        modalMessagesList.innerHTML = '<p class="no-messages" style="color: #ef4444;">❌ Failed to load messages</p>';
    }
}

function closeMessagesModal() {
    const modal = document.getElementById('messagesModal');
    modal.classList.remove('show');

    // Reload children data to update notification badges
    loadChildren().then(() => renderKids());
}

async function markMessagesAsRead(childId) {
    try {
        await fetch(`${API_BASE}/messages.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'mark_read',
                child_id: childId,
                receiver_type: 'parent'
            })
        });
    } catch (error) {
        console.error('Error marking messages as read:', error);
    }
}

// Close modal when clicking outside
window.onclick = function (event) {
    const messagesModal = document.getElementById('messagesModal');
    const addChildModal = document.getElementById('addChildModal');

    if (event.target === messagesModal) {
        closeMessagesModal();
    }
    if (event.target === addChildModal) {
        closeAddChildModal();
    }
}

// Add Child Modal Functions
function openAddChildModal() {
    const modal = document.getElementById('addChildModal');
    modal.classList.add('show');
    document.getElementById('addChildForm').reset();
}

function closeAddChildModal() {
    const modal = document.getElementById('addChildModal');
    modal.classList.remove('show');
}

// Handle Add Child Form Submission
document.addEventListener('DOMContentLoaded', () => {
    const addChildForm = document.getElementById('addChildForm');
    if (addChildForm) {
        addChildForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = {
                parent_id: userData.id,
                first_name: document.getElementById('childFirstName').value,
                last_name: document.getElementById('childLastName').value,
                age: parseInt(document.getElementById('childAge').value),
                grade: document.getElementById('childGrade').value,
                school_code: document.getElementById('childSchoolCode').value
            };

            try {
                const response = await fetch(`${API_BASE}/add_child.php`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (data.success) {
                    alert(`✅ Child added successfully!\n\n📱 Device Token: ${data.device_token}\n\nSave this token for the child device simulator.`);
                    closeAddChildModal();

                    // Reload children data
                    await loadChildren();
                    renderKids();
                } else {
                    alert('❌ Failed to add child: ' + data.message);
                }
            } catch (error) {
                alert('❌ Error adding child: ' + error.message);
            }
        });
    }
});

// Send reply from parent to teacher
async function sendReply() {
    const input = document.getElementById('replyInput');
    const message = input.value.trim();
    if (!message || !userData) return;

    // Get current child and teacher info from modal context
    const childId = localStorage.getItem('selectedKidId') || (kids && kids[0] ? kids[0].id : null);
    const teacherId = window.currentTeacherId || 1; // You may want to set this dynamically

    try {
        const response = await fetch(`${API_BASE}/messages.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sender_type: 'parent',
                sender_id: userData.id,
                receiver_type: 'teacher',
                receiver_id: teacherId,
                child_id: childId,
                message
            })
        });
        const data = await response.json();
        if (data.success) {
            input.value = '';
            await loadMessages();
            if (typeof loadModalMessages === 'function') loadModalMessages(childId);
        } else {
            alert('Error sending reply: ' + data.message);
        }
    } catch (error) {
        alert('Error sending reply: ' + error.message);
    }
}

