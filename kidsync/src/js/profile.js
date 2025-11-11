window.addEventListener("load", () => {
    checkAuth();
    const user = getUser();
    document.getElementById("profileName").textContent = user.name;
    document.getElementById("profileEmail").textContent = user.email;
});