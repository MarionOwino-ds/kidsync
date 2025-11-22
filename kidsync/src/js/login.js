const API_BASE = '../../backend/api';

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(API_BASE + '/login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.success && data.user.role === 'parent') {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userName', data.user.first_name + ' ' + data.user.last_name);
            localStorage.setItem('userData', JSON.stringify(data.user));
            localStorage.setItem('userChildren', JSON.stringify(data.children || []));
            window.location.href = 'dashboard.html';
        } else {
            alert(data.message || 'Invalid credentials!\nDemo: parent@demo.com / demo123');
        }
    } catch (error) {
        alert('Login error: ' + error.message);
    }
});
