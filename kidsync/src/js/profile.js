const API_BASE = '../../backend/api';

window.addEventListener("load", () => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData || !userData.id) {
        window.location.href = 'login.html';
        return;
    }

    const childrenData = JSON.parse(localStorage.getItem('userChildren') || '[]');

    // Display user info
    document.getElementById("profileName").textContent = `${userData.first_name} ${userData.last_name}`;
    document.getElementById("profileEmail").textContent = userData.email;
    document.getElementById("profileInitials").textContent = (userData.first_name[0] + userData.last_name[0]).toUpperCase();

    // Display contact info
    document.getElementById("userEmail").textContent = userData.email;
    document.getElementById("userPhone").textContent = userData.phone || 'Not provided';
    document.getElementById("userJoined").textContent = new Date().toLocaleDateString();

    // Display children
    const childrenList = document.getElementById("childrenList");
    childrenList.innerHTML = '';

    if (childrenData.length > 0) {
        childrenData.forEach(child => {
            const div = document.createElement('div');
            div.className = 'child-item';
            div.innerHTML = `
                <div class="child-name">${child.first_name} ${child.last_name}</div>
                <div class="child-info">${child.grade} • ${child.school_name} • Age: ${child.age}</div>
            `;
            childrenList.appendChild(div);
        });
    } else {
        childrenList.innerHTML = '<p style="text-align: center; color: #999;">No children registered</p>';
    }
});

function editProfile() {
    alert('Edit profile feature coming soon!');
}

function logout() {
    localStorage.clear();
    window.location.href = 'login.html';
}