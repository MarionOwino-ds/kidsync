document.getElementById('loginForm').addEventListener('submit', e => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (email === 'parent@demo.com' && password === 'demo123') {

        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userName', 'Sarah Johnson');

        window.location.href = 'dashboard.html';
    } else {
        alert('Invalid credentials!\nDemo: parent@demo.com / demo123');
    }
});
