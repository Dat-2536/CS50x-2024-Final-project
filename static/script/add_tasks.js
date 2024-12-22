document.getElementById("addTaskBtn").onclick = function (event) {
    event.preventDefault();

    const taskInput = document.getElementById("taskInput");
    const task = taskInput.value.trim();

    if (task === "") {
        alert("Task cannot be empty");
        return;
    }

    fetch("/add_task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: taskInput.value }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const taskList = document.getElementById("taskList");
            const newTask = document.createElement("li");
            newTask.className = "task text-dark list-group-item d-flex justify-content-between align-items-center";
            newTask.setAttribute("data-task-id", data.task_id); // Set the data-task-id

            newTask.innerHTML = `
                <span>${task}</span>
                <div>
                    <button class="btn btn-sm" onclick="completeTask(${data.task_id})">
                        <i id="complete-task" class="ti-check"></i>
                    </button>
                    <button class="btn btn-sm" onclick="deleteTask(${data.task_id})">
                        <i id="delete-task" class="ti-trash"></i>
                    </button>
                </div>
            `;

            taskList.appendChild(newTask); // Add the new task to the list
            taskInput.value = ""; // Clear the input field
        } else {
            alert(data.error || "Failed to add task");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("An error occurred while adding the task.");
    });
};


function completeTask(taskId) {
    console.log("Task ID:", taskId); // Debugging statement
    fetch("/complete_task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task_id: taskId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const taskElement = document.querySelector(`li[data-task-id='${taskId}']`);
            console.log("Task Element:", taskElement); // Debugging statement
            if (taskElement) {
                taskElement.classList.add("completed");
                const completeButton = taskElement.querySelector("button[onclick^='completeTask']");
                if (completeButton) {
                    completeButton.remove();
                }
            }
        }
    });
}

function deleteTask(taskId) {
    fetch("/delete_task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task_id: taskId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const taskElement = document.querySelector(`li[data-task-id='${taskId}']`);
            if (taskElement) {
                taskElement.remove();
            }
        }
    });
}

function isLoggedIn() {
    // Check if a specific cookie or session exists
    return document.cookie.includes("session=");
}
