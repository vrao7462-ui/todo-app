const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const searchTask = document.getElementById("searchTask");
const prioritySelect = document.getElementById("priority");

const totalTasks = document.getElementById("totalTasks");
const activeTasks = document.getElementById("activeTasks");
const completedTasks = document.getElementById("completedTasks");

const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");

const emptyMessage = document.getElementById("emptyMessage");

const allBtn = document.getElementById("allBtn");
const activeBtn = document.getElementById("activeBtn");
const completedBtn = document.getElementById("completedBtn");

const clearCompletedBtn = document.getElementById("clearCompleted");
const themeBtn = document.getElementById("themeBtn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

/* DATE */
const currentDate = document.getElementById("currentDate");

if (currentDate) {
    const today = new Date();

    currentDate.textContent =
        today.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        });
}

/* SAVE TASKS */
function saveTasks() {
    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}

/* UPDATE STATS */
function updateStats() {

    const total = tasks.length;

    const completed = tasks.filter(
        task => task.completed
    ).length;

    const active = total - completed;

    totalTasks.textContent = total;
    activeTasks.textContent = active;
    completedTasks.textContent = completed;

    const percentage =
        total === 0
        ? 0
        : Math.round(
            (completed / total) * 100
        );

    progressFill.style.width =
        percentage + "%";

    progressText.textContent =
        percentage + "% Completed";
}

/* RENDER TASKS */
function renderTasks() {

    taskList.innerHTML = "";

    let filteredTasks = [...tasks];

    if (currentFilter === "active") {
        filteredTasks =
            filteredTasks.filter(
                task => !task.completed
            );
    }

    if (currentFilter === "completed") {
        filteredTasks =
            filteredTasks.filter(
                task => task.completed
            );
    }

    const searchText =
        searchTask.value.toLowerCase();

    filteredTasks =
        filteredTasks.filter(task =>
            task.text
                .toLowerCase()
                .includes(searchText)
        );

    if (filteredTasks.length === 0) {
        emptyMessage.style.display = "block";
    } else {
        emptyMessage.style.display = "none";
    }

    filteredTasks.forEach(task => {

        const originalIndex =
            tasks.indexOf(task);

        const li =
            document.createElement("li");

        li.className = "task-item";

        li.innerHTML = `
            <div class="task-content">

                <input
                    type="checkbox"
                    ${task.completed ? "checked" : ""}
                    class="task-check">

                <span class="task-text ${
                    task.completed
                    ? "completed"
                    : ""
                }">
                    ${task.text}
                </span>

                <span class="priority-badge">
                    ${task.priority}
                </span>

            </div>

            <div class="task-actions">

                <button
                    class="edit-btn">
                    ✏️
                </button>

                <button
                    class="delete-btn">
                    🗑️
                </button>

            </div>
        `;

        const checkbox =
            li.querySelector(".task-check");

        checkbox.addEventListener(
            "change",
            () => {
                tasks[
                    originalIndex
                ].completed =
                    checkbox.checked;

                saveTasks();
                renderTasks();
            }
        );

        const editBtn =
            li.querySelector(".edit-btn");

        editBtn.addEventListener(
            "click",
            () => {

                const updated =
                    prompt(
                        "Edit Task",
                        task.text
                    );

                if (
                    updated &&
                    updated.trim() !== ""
                ) {
                    tasks[
                        originalIndex
                    ].text =
                        updated.trim();

                    saveTasks();
                    renderTasks();
                }
            }
        );

        const deleteBtn =
            li.querySelector(".delete-btn");

        deleteBtn.addEventListener(
            "click",
            () => {

                tasks.splice(
                    originalIndex,
                    1
                );

                saveTasks();
                renderTasks();
            }
        );

        taskList.appendChild(li);
    });

    updateStats();
}

/* ADD TASK */
function addTask() {

    const text =
        taskInput.value.trim();

    if (text === "") {
        alert(
            "Please enter a task."
        );
        return;
    }

    tasks.push({
        text: text,
        priority:
            prioritySelect.value,
        completed: false
    });

    taskInput.value = "";

    saveTasks();
    renderTasks();
}

/* ADD BUTTON */
addBtn.addEventListener(
    "click",
    addTask
);

/* ENTER KEY */
taskInput.addEventListener(
    "keypress",
    function(event) {

        if (
            event.key === "Enter"
        ) {
            addTask();
        }
    }
);

/* SEARCH */
searchTask.addEventListener(
    "input",
    renderTasks
);

/* FILTERS */
allBtn.addEventListener(
    "click",
    () => {
        currentFilter = "all";
        renderTasks();
    }
);

activeBtn.addEventListener(
    "click",
    () => {
        currentFilter = "active";
        renderTasks();
    }
);

completedBtn.addEventListener(
    "click",
    () => {
        currentFilter =
            "completed";

        renderTasks();
    }
);

/* CLEAR COMPLETED */
clearCompletedBtn.addEventListener(
    "click",
    () => {

        tasks =
            tasks.filter(
                task =>
                    !task.completed
            );

        saveTasks();
        renderTasks();
    }
);

/* DARK MODE */
themeBtn.addEventListener(
    "click",
    () => {

        document.body
            .classList
            .toggle("dark-mode");

        localStorage.setItem(
            "theme",
            document.body.classList.contains(
                "dark-mode"
            )
        );
    }
);

/* LOAD THEME */
const savedTheme =
    localStorage.getItem(
        "theme"
    );

if (savedTheme === "true") {
    document.body.classList.add(
        "dark-mode"
    );
}

/* INITIAL RENDER */
renderTasks();