window.addEventListener("load", () => {
    checkAuth();
});

function toggleSwitch(el) {
    el.classList.toggle("active");
}

function deleteAccount() {
    if (confirm("Are you sure? This cannot be undone!")) {
        alert("Account deletion requested. Redirecting to home...");
        window.location.href = "index.html";
    }
}