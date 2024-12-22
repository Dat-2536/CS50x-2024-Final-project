document.addEventListener("DOMContentLoaded", function () {
    // Show the alert box when clicking delete account
    document.getElementById("delete-account").onclick = function () {
        console.log("Delete account clicked"); // Debugging
        document.getElementById("overlay").style.display = "block";
        document.getElementById("alertBox").style.display = "block";
    };

    // Hide the alert box when clicking cancel
    document.getElementById("cancelDelete").onclick = function () {
        console.log("Cancel clicked"); // Debugging
        document.getElementById("overlay").style.display = "none";
        document.getElementById("alertBox").style.display = "none";
    };

    // Send the POST request to delete the account when clicking delete
    document.getElementById("confirmDelete").onclick = function () {
        console.log("Confirm delete clicked"); // Debugging
        fetch("/delete_account", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        })
        .then(response => {
            if (response.redirected) {
                alert("Your account has been deleted.");
                window.location.href = response.url; // Redirect after success
            } else {
                alert("An error occurred. Please try again.");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Failed to connect to the server.");
        });
    };
});
