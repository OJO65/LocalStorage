// Get references to various elements on the page using their IDs
const taskForm = document.getElementById("task-form");
const confirmCloseDialog = document.getElementById("confirm-close-dialog");
const openTaskFormBtn = document.getElementById("open-task-form-btn");
const closeTaskFormBtn = document.getElementById("close-task-form-btn");
const addOrUpdateTaskBtn = document.getElementById("add-or-update-task-btn");
const cancelBtn = document.getElementById("cancel-btn");
const discardBtn = document.getElementById("discard-btn");
const tasksContainer = document.getElementById("tasks-container");
const titleInput = document.getElementById("title-input");
const dateInput = document.getElementById("date-input");
const descriptionInput = document.getElementById("description-input");

// Retrieve tasks from localStorage or initialize as an empty array
const taskData = JSON.parse(localStorage.getItem("data")) || [];

// Object to keep track of the task currently being edited
let currentTask = {};

// Function to add a new task or update an existing one
const addOrUpdateTask = () => {
  // Find the index of the task in the array using its id
  const dataArrIndex = taskData.findIndex((item) => item.id === currentTask.id);

  // Create a new task object with an id, title, date, and description
  const taskObj = {
    id: `${titleInput.value.toLowerCase().split(" ").join("-")}-${Date.now()}`, // Generate a unique id based on the title and current time
    title: titleInput.value, // Set the task title from the input field
    date: dateInput.value, // Set the task date from the input field
    description: descriptionInput.value, // Set the task description from the input field
  };

  // If the task is new, add it to the start of the taskData array
  // If it's being updated, replace the existing task in the array
  if (dataArrIndex === -1) {
    taskData.unshift(taskObj);
  } else {
    taskData[dataArrIndex] = taskObj;
  }

  // Save the updated taskData array to localStorage
  localStorage.setItem("data", JSON.stringify(taskData));

  // Update the display of tasks on the page
  updateTaskContainer();

  // Reset the form for the next input
  reset();
};

// Function to update the task container with the current list of tasks
const updateTaskContainer = () => {
  // Clear the tasks container before updating it
  tasksContainer.innerHTML = "";

  // Loop through each task in the taskData array and create HTML elements for them
  taskData.forEach(({ id, title, date, description }) => {
    tasksContainer.innerHTML += `
      <div class="task" id="${id}">
        <p><strong>Title:</strong> ${title}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Description:</strong> ${description}</p>
        <button onclick="editTask(this)" type="button" class="btn">Edit</button>
        <button onclick="deleteTask(this)" type="button" class="btn">Delete</button> 
      </div>
    `;
  });
};

// Function to delete a task
const deleteTask = (buttonEl) => {
  // Find the index of the task to delete using its id
  const dataArrIndex = taskData.findIndex(
    (item) => item.id === buttonEl.parentElement.id
  );

  // Remove the task from the DOM
  buttonEl.parentElement.remove();

  // Remove the task from the taskData array
  taskData.splice(dataArrIndex, 1);

  // Save the updated taskData array to localStorage
  localStorage.setItem("data", JSON.stringify(taskData));
};

// Function to edit a task
const editTask = (buttonEl) => {
  // Find the index of the task to edit using its id
  const dataArrIndex = taskData.findIndex(
    (item) => item.id === buttonEl.parentElement.id
  );

  // Set currentTask to the task being edited
  currentTask = taskData[dataArrIndex];

  // Populate the form with the task's existing values
  titleInput.value = currentTask.title;
  dateInput.value = currentTask.date;
  descriptionInput.value = currentTask.description;

  // Change the button text to "Update Task" since we're editing an existing task
  addOrUpdateTaskBtn.innerText = "Update Task";

  // Show the task form
  taskForm.classList.toggle("hidden");
};

// Function to reset the form to its initial state
const reset = () => {
  // Change the button text back to "Add Task"
  addOrUpdateTaskBtn.innerText = "Add Task";

  // Clear the form input fields
  titleInput.value = "";
  dateInput.value = "";
  descriptionInput.value = "";

  // Hide the task form
  taskForm.classList.toggle("hidden");

  // Clear the currentTask object since we're not editing anymore
  currentTask = {};
};

// If there are tasks saved in localStorage, display them
if (taskData.length) {
  updateTaskContainer();
}

// Event listener to open the task form when the "Add Task" button is clicked
openTaskFormBtn.addEventListener("click", () =>
  taskForm.classList.toggle("hidden")
);

// Event listener to handle closing the task form
closeTaskFormBtn.addEventListener("click", () => {
  // Check if the form contains any input values
  const formInputsContainValues = titleInput.value || dateInput.value || descriptionInput.value;

  // Check if the form inputs have been changed from the current task's values
  const formInputValuesUpdated = titleInput.value !== currentTask.title || dateInput.value !== currentTask.date || descriptionInput.value !== currentTask.description;

  // If the form contains values and those values have been updated, show a confirmation dialog
  if (formInputsContainValues && formInputValuesUpdated) {
    confirmCloseDialog.showModal();
  } else {
    // If no changes were made, reset the form
    reset();
  }
});

// Event listener to close the confirmation dialog when the "Cancel" button is clicked
cancelBtn.addEventListener("click", () => confirmCloseDialog.close());

// Event listener to discard changes and close the form when the "Discard" button is clicked
discardBtn.addEventListener("click", () => {
  confirmCloseDialog.close();
  reset();
});

// Event listener to handle form submission (adding or updating a task)
taskForm.addEventListener("submit", (e) => {
  // Prevent the default form submission behavior
  e.preventDefault();

  // Call the function to add or update the task
  addOrUpdateTask();
});
