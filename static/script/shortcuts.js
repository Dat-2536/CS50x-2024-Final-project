// Keyboard shortcuts
document.addEventListener("keydown", function(event) {
    switch (event.key) {
        case " ":
            toggleTimer();
            break;
        case "Escape":
            closeProfile = document.getElementById("closeProfileModal");
            closeAvatar = document.getElementById("closeModal");
            cancelDelete = document.getElementById("cancelDelete");
            closeProfile.click();
            closeAvatar.click();
            cancelDelete.click();
            break;
        default:
            break;
    }
})
