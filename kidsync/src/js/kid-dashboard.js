const API_BASE = '../../backend/api';
let currentChild = null;
let userData = null;

window.addEventListener("load", async () => {
    // Check authentication
    userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData || !userData.id) {
        window.location.href = 'login.html';
        return;
    }

    const kidId = localStorage.getItem('selectedKidId');
    if (!kidId) {
        alert('No child selected. Redirecting to dashboard...');
        window.location.href = 'dashboard.html';
        return;
    }

    await loadChildData(kidId);
});

async function loadChildData(childId) {
    try {
        // Load child details
        const childResponse = await fetch(`${API_BASE}/children.php?parent_id=${userData.id}`);
        const childData = await childResponse.json();

        if (childData.success) {
            currentChild = childData.children.find(c => c.id == childId);

            if (currentChild) {
                displayKidInfo();
                await loadGrades(childId);
                await loadAttendance(childId);
                await loadMessages(childId);
                await loadActivities(childId);
                await loadHealth(childId);
            } else {
                alert(`Child with ID ${childId} not found. Available children: ${childData.children.map(c => c.id + ':' + c.first_name).join(', ')}`);
                window.location.href = 'dashboard.html';
            }
        } else {
            alert('Failed to load children data: ' + (childData.message || 'Unknown error'));
            window.location.href = 'dashboard.html';
        }
    } catch (error) {
        console.error('Error loading child data:', error);
        alert('Error loading child data: ' + error.message);
        window.location.href = 'dashboard.html';
    }
}

function displayKidInfo() {
    document.getElementById("pageTitle").textContent = `${currentChild.first_name}'s Dashboard`;

    const statusClass = currentChild.status === 'at-school' ? 'at-school' :
        currentChild.status === 'on-bus' ? 'on-bus' : 'home';
    const statusText = currentChild.status === 'at-school' ? 'At School' :
        currentChild.status === 'on-bus' ? 'On Bus' : 'Home';

    document.getElementById("kidCard").innerHTML = `
        <div class="kid-avatar">${currentChild.first_name[0]}</div>
        <div class="kid-name">${currentChild.first_name} ${currentChild.last_name}</div>
        <div class="kid-info">${currentChild.age} years old • ${currentChild.grade}</div>
        <div class="kid-info">${currentChild.school_name}</div>
        <div class="status-badge status-${statusClass}">${statusText}</div>
    `;
}

async function loadGrades(childId) {
    const gradesSection = document.getElementById("gradesSection");

    try {
        const response = await fetch(`${API_BASE}/academic.php?child_id=${childId}`);
        const data = await response.json();

        if (data.success && data.grades && data.grades.length > 0) {
            gradesSection.innerHTML = `
                <h3 style="color: #1e40af; margin-bottom: 1rem;">📚 Recent Grades</h3>
                ${data.grades.map(grade => `
                    <div style="background: #f8fafc; padding: 1rem; margin-bottom: 0.5rem; border-radius: 8px; border-left: 4px solid #2563eb;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <strong style="color: #1e40af; font-size: 1.1rem;">${grade.subject}</strong>
                                <p style="color: #666; font-size: 0.9rem; margin-top: 0.3rem;">${grade.comments || 'No comments'}</p>
                                <small style="color: #999;">${new Date(grade.grade_date).toLocaleDateString()}</small>
                            </div>
                            <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 0.8rem 1.2rem; border-radius: 50%; font-size: 1.5rem; font-weight: bold;">
                                ${grade.grade}
                            </div>
                        </div>
                    </div>
                `).join('')}
            `;
        } else {
            gradesSection.innerHTML = `
                <h3 style="color: #1e40af; margin-bottom: 1rem;">📚 Recent Grades</h3>
                <p style="text-align: center; color: #999; padding: 2rem;">No grades posted yet</p>
            `;
        }
    } catch (error) {
        console.error('Error loading grades:', error);
        gradesSection.innerHTML = `
            <h3 style="color: #1e40af; margin-bottom: 1rem;">📚 Recent Grades</h3>
            <p style="text-align: center; color: #ef4444; padding: 2rem;">❌ Error loading grades: ${error.message}</p>
        `;
    }
}

async function loadAttendance(childId) {
    const attendanceSection = document.getElementById("attendanceSection");

    try {
        const response = await fetch(`${API_BASE}/academic.php?child_id=${childId}&type=attendance`);
        const data = await response.json();

        if (data.success && data.attendance && data.attendance.length > 0) {
            const lastWeek = data.attendance.slice(0, 7);

            attendanceSection.innerHTML = `
                <h3 style="color: #1e40af; margin-bottom: 1rem;">📅 Attendance (Last 7 Days)</h3>
                <div style="display: grid; gap: 0.5rem;">
                    ${lastWeek.map(att => {
                const statusEmoji = att.status === 'present' ? '✅' :
                    att.status === 'absent' ? '❌' :
                        att.status === 'late' ? '🕐' : '🏥';
                const statusText = att.status.charAt(0).toUpperCase() + att.status.slice(1);
                const statusColor = att.status === 'present' ? '#10b981' :
                    att.status === 'absent' ? '#ef4444' :
                        att.status === 'late' ? '#f59e0b' : '#6366f1';

                return `
                            <div style="background: #f8fafc; padding: 0.8rem; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; border-left: 4px solid ${statusColor};">
                                <span style="color: #666;">${new Date(att.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                                <span style="font-weight: 600; color: ${statusColor};">${statusEmoji} ${statusText}</span>
                            </div>
                        `;
            }).join('')}
                </div>
            `;
        } else {
            attendanceSection.innerHTML = `
                <h3 style="color: #1e40af; margin-bottom: 1rem;">📅 Attendance</h3>
                <p style="text-align: center; color: #999; padding: 2rem;">No attendance records yet</p>
            `;
        }
    } catch (error) {
        console.error('Error loading attendance:', error);
        attendanceSection.innerHTML = `
            <h3 style="color: #1e40af; margin-bottom: 1rem;">📅 Attendance</h3>
            <p style="text-align: center; color: #ef4444; padding: 2rem;">❌ Error loading attendance: ${error.message}</p>
        `;
    }
}

async function loadMessages(childId) {
    const messagesSection = document.getElementById("messagesSection");

    try {
        const response = await fetch(`${API_BASE}/messages.php?sender_type=parent&sender_id=${userData.id}&child_id=${childId}`);
        const data = await response.json();

        if (data.success && data.messages && data.messages.length > 0) {
            const parentMessages = data.messages.filter(m => m.receiver_type === 'parent').slice(0, 5);

            if (parentMessages.length > 0) {
                messagesSection.innerHTML = `
                    <h3 style="color: #1e40af; margin-bottom: 1rem;">💬 Teacher Messages</h3>
                    ${parentMessages.map(msg => {
                    const isUnread = msg.is_read === 0;
                    return `
                            <div style="background: ${isUnread ? '#fef3c7' : '#f8fafc'}; padding: 1rem; margin-bottom: 0.5rem; border-radius: 8px; border-left: 4px solid ${isUnread ? '#f97316' : '#2563eb'};">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                    <strong style="color: #1e40af;">📧 ${msg.sender_name || 'Teacher'} ${isUnread ? '🔔' : ''}</strong>
                                    <small style="color: #666;">${new Date(msg.created_at).toLocaleDateString()}</small>
                                </div>
                                <p style="color: #333; line-height: 1.5;">${msg.message}</p>
                            </div>
                        `;
                }).join('')}
                `;
            } else {
                messagesSection.innerHTML = `
                    <h3 style="color: #1e40af; margin-bottom: 1rem;">💬 Teacher Messages</h3>
                    <p style="text-align: center; color: #999; padding: 2rem;">No messages yet</p>
                `;
            }
        } else {
            messagesSection.innerHTML = `
                <h3 style="color: #1e40af; margin-bottom: 1rem;">💬 Teacher Messages</h3>
                <p style="text-align: center; color: #999; padding: 2rem;">No messages yet</p>
            `;
        }
    } catch (error) {
        console.error('Error loading messages:', error);
        messagesSection.innerHTML = `
            <h3 style="color: #1e40af; margin-bottom: 1rem;">💬 Teacher Messages</h3>
            <p style="text-align: center; color: #ef4444; padding: 2rem;">❌ Error loading messages: ${error.message}</p>
        `;
    }
}

async function loadActivities(childId) {
    try {
        const response = await fetch(`${API_BASE}/activities.php?child_id=${childId}&action=get`);
        const data = await response.json();

        const activityList = document.getElementById("activityList");

        if (data.success && data.activities && data.activities.length > 0) {
            activityList.innerHTML = data.activities.slice(0, 10).map(activity => {
                const time = new Date(activity.activity_time).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                });

                return `
                    <div class="activity-item">
                        <div class="activity-time">${activity.icon || '📍'} ${time}</div>
                        <div class="activity-desc">${activity.title}</div>
                    </div>
                `;
            }).join('');
        } else {
            activityList.innerHTML = '<p style="text-align: center; color: #999; padding: 2rem;">No activities today</p>';
        }
    } catch (error) {
        console.error('Error loading activities:', error);
    }
}

async function loadHealth(childId) {
    try {
        const response = await fetch(`${API_BASE}/children.php?parent_id=${userData.id}`);
        const data = await response.json();

        if (data.success) {
            const child = data.children.find(c => c.id == childId);

            if (child && child.health_records) {
                const health = child.health_records;

                document.getElementById("statsGrid").innerHTML = `
                    <div class="stat-card">
                        <div class="stat-icon">🍽️</div>
                        <div class="stat-title">Meals Today</div>
                        <div class="stat-value">${health.meals_today || 0} of 3</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">💬</div>
                        <div class="stat-title">Messages</div>
                        <div class="stat-value">${currentChild.unread_messages || 0}</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">😴</div>
                        <div class="stat-title">Sleep</div>
                        <div class="stat-value">${health.sleep_hours || '0'} hrs</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">🏃</div>
                        <div class="stat-title">Activities</div>
                        <div class="stat-value">${currentChild.activities_today || 0}</div>
                    </div>
                `;
            }
        }
    } catch (error) {
        console.error('Error loading health data:', error);
    }
}

function goBack() {
    window.location.href = 'dashboard.html';
}
