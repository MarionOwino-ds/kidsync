window.addEventListener("load", () => {
    checkAuth();
});

function rsvp(btn) {
    btn.textContent = "✓ Attending";
    btn.classList.add("attending");
    btn.disabled = true;
}