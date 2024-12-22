// Show the upload modal when the "Change Avatar" button is clicked
document.getElementById("change-avatar").onclick = function () {
    document.getElementById("avatarModal").style.display = "flex";
};

// Close the modal when the close button (×) is clicked
document.getElementById("closeModal").onclick = function () {
    document.getElementById("avatarModal").style.display = "none";
};

// Handle form submission (upload profile picture)
document.getElementById("avatarForm").onsubmit = function (event) {
    event.preventDefault(); // Prevent default form submission

    const formData = new FormData();
    const fileInput = document.getElementById("profile_picture");
    formData.append("profile_picture", fileInput.files[0]);

    fetch("/upload_profile_picture", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Close modal and reload the page to reflect the new profile picture
            document.getElementById("avatarModal").style.display = "none";
            location.reload();
        } else {
            alert(data.error); // Display an error message if the upload fails
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("An error occurred while uploading the profile picture.");
    });
};
