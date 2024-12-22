// Show the upload modal when the "Change Avatar" button is clicked
document.getElementById("account").onclick = function () {
    document.getElementById("profileModal").style.display = "flex";
};

// Close the modal when the close button (×) is clicked
document.getElementById("closeProfileModal").onclick = function () {
    document.getElementById("profileModal").style.display = "none";
};

// Switch to edit mode
document.getElementById("edit-btn").onclick = function () {
    document.getElementById("profileDetails").style.display = "none";
    document.getElementById("editForm").style.display = "flex";
}

// Cancel edit
document.getElementById("cancel-btn").onclick = function () {
    document.getElementById("profileDetails").style.display = "block";
    document.getElementById("editForm").style.display = "none";
}

// Handle the form submission
document.getElementById("profileForm").onsubmit = function (event) {
    event.preventDefault(); // Prevent the default form submission

    // Get updated values from the form inputs
    const updatedUsername = document.getElementById("newUsername").value;
    const updatedEmail = document.getElementById("newEmail").value;

    // Send the data to the backend via a POST request
    fetch("/update_profile", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: updatedUsername,
            email: updatedEmail,
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                // Update the displayed profile details
                document.getElementById("profileUsername").textContent = updatedUsername;
                document.getElementById("profileEmail").textContent = updatedEmail;

                // Switch back to details view
                document.getElementById("profileDetails").style.display = "block";
                document.getElementById("editForm").style.display = "none";
            } else {
                alert("Failed to update profile.");
            }
        })
        .catch((error) => {
            console.error("Error:", error);
            alert("An error occurred while updating your profile.");
        });
};
