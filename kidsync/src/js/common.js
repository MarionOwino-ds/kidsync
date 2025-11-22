function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = 'login.html';
    }
}

function getUser() {
    const user = localStorage.getItem('userData');
    return user ? JSON.parse(user) : null;
}

function logout() {
    if (confirm("Are you sure you want to logout?")) {
        localStorage.clear();
        window.location.href = 'login.html';
    }
}