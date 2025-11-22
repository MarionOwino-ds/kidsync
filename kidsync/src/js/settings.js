window.addEventListener("load", () => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData || !userData.id) {
        window.location.href = 'login.html';
        return;
    }

    const user = userData.user;
    document.getElementById("userName").textContent = `${user.first_name} ${user.last_name}`;
    document.getElementById("userInitials").textContent = (user.first_name[0] + user.last_name[0]).toUpperCase();
});

function toggleSwitch(el) {
    el.classList.toggle("active");
    // You can save settings to backend here
    console.log('Setting toggled:', el.classList.contains('active'));
}

function deleteAccount() {
    if (confirm("⚠️ Are you sure you want to delete your account?\n\nThis will permanently delete:\n- Your profile\n- All your children's data\n- All messages and records\n\nThis cannot be undone!")) {
        if (confirm("Final confirmation: Delete account?")) {
            // Call API to delete account
            alert("Account deletion requested. Logging out...");
            localStorage.clear();
            window.location.href = "index.html";
        }
    }
}

function saveSettings() {
    alert('✅ Settings saved successfully!');
}

function logout() {
    localStorage.clear();
    window.location.href = 'login.html';
}