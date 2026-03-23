const taskInput = document.getElementById("taskInput");
const dueDateInput = document.getElementById("dueDateInput");
const priorityInput = document.getElementById("priorityInput");
const addButton = document.getElementById("addButton");
const taskList = document.getElementById("taskList");

function addTask() {
  const text = taskInput.value.trim();
  const dueDate = dueDateInput.value;
  const priority = priorityInput.value;
  if (!text) return;

  const li = document.createElement("li");
  li.className = "task";

  const left = document.createElement("div");
  left.className = "task-left";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.setAttribute("aria-label", "Mark task complete");

  const details = document.createElement("div");
  details.className = "task-details";

  const span = document.createElement("span");
  span.className = "task-text";
  span.textContent = text;

  const meta = document.createElement("span");
  meta.className = "task-meta";
  meta.textContent = dueDate ? `Due: ${dueDate}` : "No due date";

  const badge = document.createElement("span");
  badge.className = `priority-badge priority-${priority.toLowerCase()}`;
  badge.textContent = `${priority} Priority`;

  checkbox.addEventListener("change", () => {
    li.classList.toggle("done", checkbox.checked);
  });

  const delBtn = document.createElement("button");
  delBtn.type = "button";
  delBtn.className = "delete-btn";
  delBtn.textContent = "Delete";

  delBtn.addEventListener("click", () => {
    li.remove();
  });

  details.appendChild(span);
  details.appendChild(meta);
  details.appendChild(badge);
  left.appendChild(checkbox);
  left.appendChild(details);

  li.appendChild(left);
  li.appendChild(delBtn);
  taskList.appendChild(li);

  taskInput.value = "";
  dueDateInput.value = "";
  priorityInput.value = "Medium";
  taskInput.focus();
}

addButton.addEventListener("click", addTask);
taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTask();
});

