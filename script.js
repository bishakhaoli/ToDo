const taskInput = document.getElementById("taskInput");
const dueDateInput = document.getElementById("dueDateInput");
const priorityInput = document.getElementById("priorityInput");
const addButton = document.getElementById("addButton");
const taskList = document.getElementById("taskList");
const STORAGE_KEY = "todoTasksV1";

let tasks = loadTasks();

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task) => {
    const li = createTaskElement(task);
    taskList.appendChild(li);
  });
}

function createTaskElement(task) {
  const li = document.createElement("li");
  li.className = "task";
  if (task.done) li.classList.add("done");

  const left = document.createElement("div");
  left.className = "task-left";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.setAttribute("aria-label", "Mark task complete");
  checkbox.checked = task.done;

  const details = document.createElement("div");
  details.className = "task-details";

  const span = document.createElement("span");
  span.className = "task-text";
  span.textContent = task.text;

  const meta = document.createElement("span");
  meta.className = "task-meta";
  meta.textContent = task.dueDate ? `Due: ${task.dueDate}` : "No due date";

  const badge = document.createElement("span");
  badge.className = `priority-badge priority-${task.priority.toLowerCase()}`;
  badge.textContent = `${task.priority} Priority`;

  checkbox.addEventListener("change", () => {
    li.classList.toggle("done", checkbox.checked);
    task.done = checkbox.checked;
    saveTasks();
  });

  const delBtn = document.createElement("button");
  delBtn.type = "button";
  delBtn.className = "delete-btn";
  delBtn.textContent = "Delete";

  delBtn.addEventListener("click", () => {
    tasks = tasks.filter((t) => t.id !== task.id);
    saveTasks();
    renderTasks();
  });

  details.appendChild(span);
  details.appendChild(meta);
  details.appendChild(badge);
  left.appendChild(checkbox);
  left.appendChild(details);

  li.appendChild(left);
  li.appendChild(delBtn);
  return li;
}

function addTask() {
  const text = taskInput.value.trim();
  const dueDate = dueDateInput.value;
  const priority = priorityInput.value;
  if (!text) return;

  const task = {
    id: crypto.randomUUID(),
    text,
    dueDate,
    priority,
    done: false,
  };

  tasks.push(task);
  saveTasks();
  renderTasks();

  taskInput.value = "";
  dueDateInput.value = "";
  priorityInput.value = "Medium";
  taskInput.focus();
}

addButton.addEventListener("click", addTask);
taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTask();
});

renderTasks();

