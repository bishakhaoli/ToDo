const taskInput = document.getElementById("taskInput");
const dueDateInput = document.getElementById("dueDateInput");
const priorityInput = document.getElementById("priorityInput");
const addButton = document.getElementById("addButton");
const taskList = document.getElementById("taskList");
const STORAGE_KEY = "todoTasksV1";

function getStorage() {
  // Prefer localStorage, but some Safari privacy settings block it.
  try {
    const testKey = "__todo_test__";
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    return window.localStorage;
  } catch (e) {
    // Fallback keeps tasks through refresh for the current tab/session.
    try {
      const testKey = "__todo_test__";
      window.sessionStorage.setItem(testKey, "1");
      window.sessionStorage.removeItem(testKey);
      return window.sessionStorage;
    } catch {
      return null;
    }
  }
}

const store = getStorage();

let tasks = loadTasks();

function loadTasks() {
  try {
    if (!store) return [];
    const raw = store.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    return [];
  }
}

function saveTasks() {
  if (!store) return;
  store.setItem(STORAGE_KEY, JSON.stringify(tasks));
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

