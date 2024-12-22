// Get DOM Elements
const username = document.getElementById("username");
const dropdownMenu = document.getElementById("dropdownMenu");

// Toggle dropdown visibility when username is clicked
username.addEventListener("click", function (event) {
    dropdownMenu.style.display =
        dropdownMenu.style.display === "block" ? "none" : "block";
});

// Close dropdown if clicked outside the menu or username
document.addEventListener("click", function (event) {
    if (!username.contains(event.target) && !dropdownMenu.contains(event.target)) {
        dropdownMenu.style.display = "none";
    }
});
