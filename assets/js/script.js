// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
    return nextId++;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    const taskId = task.id;
    const card = $(`
      <div id="card-${taskId}" class="card draggable mb-2" data-task-id="${taskId}">
        <div class="card-body">
          <h5 class="card-title">${task.title}</h5>
          <p class="card-text">${task.description}</p>
          <button class="btn btn-danger btn-sm delete-task" data-bs-toggle="modal" data-bs-target="#deleteModal">
            Delete
          </button>
        </div>
      </div>
    `);
    return card;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    $(".draggable").draggable({ revert: "invalid", cursor: "move" });
    $("#todo-cards").empty();
    $("#in-progress-cards").empty();
    $("#done-cards").empty();
  
    taskList.forEach((task) => {
      const card = createTaskCard(task);
      if (task.status === "To Do") {
        $("#todo-cards").append(card);
      } else if (task.status === "In Progress") {
        $("#in-progress-cards").append(card);
      } else if (task.status === "Done") {
        $("#done-cards").append(card);
      }
    });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();

    const title = $("#task-title").val();
    const description = $("#task-description").val();
    const status = "To Do";
    const id = generateTaskId();
  
    const newTask = { id, title, description, status };
    taskList.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    localStorage.setItem("nextId", JSON.stringify(nextId));
  
    renderTaskList();
    $("#formModal").modal("hide");
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    const taskId = $(event.target).closest(".draggable").data("task-id");
    taskList = taskList.filter((task) => task.id !== taskId);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const taskId = ui.helper.data("task-id");
    const newStatus = $(event.target).closest(".lane").attr("id").toLowerCase();
  
    taskList = taskList.map((task) => {
      if (task.id === taskId) {
        task.status = newStatus;
      }
      return task;
    });
  
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
  renderTaskList();

  $("#form").submit(handleAddTask);
  $(".delete-task").click(handleDeleteTask);

  $(".lane").droppable({
    accept: ".draggable",
    drop: handleDrop,
  });

  $("#due-date").datepicker();
});
