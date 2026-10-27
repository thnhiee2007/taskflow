
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const emptyMessage = document.getElementById("empty-message");

const totalCount = document.getElementById("total-count");
const activeCount = document.getElementById("active-count");
const doneCount = document.getElementById("done-count");

let tasks = JSON.parse(
    localStorage.getItem("taskflow-tasks") || "[]"
);
let currentFilter = "all";

document.getElementById("today").textContent =
    new Date().toLocaleDateString("vi-VN", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });

function updateSummary() {
    totalCount.textContent = tasks.length;
    activeCount.textContent =
        tasks.filter(task => !task.completed).length;
    doneCount.textContent =
        tasks.filter(task => task.completed).length;

    localStorage.setItem("taskflow-tasks", JSON.stringify(tasks));
}

function renderTasks() {
    taskList.replaceChildren();

    const filteredTasks = tasks.filter(task => {
        if (currentFilter === "active") return !task.completed;
        if (currentFilter === "done") return task.completed;
        return true;
    });

    filteredTasks.forEach(task => {
        const item = document.createElement("li");
        item.className = "task-item";

        if (task.completed) {
            item.classList.add("completed");
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute(
            "aria-label",
            "Đánh dấu hoàn thành " + task.name
        );

        checkbox.addEventListener("change", () => {
            task.completed = checkbox.checked;
            renderTasks();
        });

        const name = document.createElement("span");
        name.className = "task-name";
        name.textContent = task.name;

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Xóa";
        deleteButton.setAttribute(
            "aria-label",
            "Xóa công việc " + task.name
        );

        deleteButton.addEventListener("click", () => {
            tasks = tasks.filter(item => item.id !== task.id);
            renderTasks();
        });

        item.append(checkbox, name, deleteButton);
        taskList.appendChild(item);
    });

    emptyMessage.hidden = filteredTasks.length > 0;
    updateSummary();
}

taskForm.addEventListener("submit", event => {
    event.preventDefault();

    const name = taskInput.value.trim();
    if (!name) return;

    tasks.push({
        id: Date.now() + Math.random(),
        name: name,
        completed: false
    });

    taskInput.value = "";
    renderTasks();
    taskInput.focus();
});

document.querySelectorAll(".filter").forEach(button => {
    button.addEventListener("click", () => {
        currentFilter = button.dataset.filter;

        document.querySelectorAll(".filter").forEach(filter => {
            filter.classList.toggle("active", filter === button);
        });

        renderTasks();
    });
});

renderTasks();
