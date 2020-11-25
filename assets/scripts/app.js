const getTaskList = () => {
  return JSON.parse(localStorage.getItem('taskList'));
}

const saveNewTaskItem = (newTask) => {
  //save the new task to localStorage

  let taskList = getTaskList();
  if (!taskList) 
    taskList = new Array();

  taskList.push(newTask);
  localStorage.setItem('taskList', JSON.stringify(taskList));
}

const updateTaskListItem = (index, task) => {

  let taskList = getTaskList();
  taskList[index] = task;
  localStorage.setItem('taskList', JSON.stringify(taskList));
}

const addNewTaskListItem = (newTask) => {
  //create the new list item
  let newListItem = document.createElement('li');

  //create the checkbox input element
  let newCheckbox = document.createElement('input');
  newCheckbox.setAttribute('type', 'checkbox');
  newCheckbox.addEventListener('click', checkedHandler);
  newCheckbox.checked = newTask.complete;
  newCheckbox.setAttribute(
    'id',
    'task-complete-' + document.getElementById('taskList').children.length
  );
  newListItem.appendChild(newCheckbox);

  //create task text
  let taskTextSpan = document.createElement('span');
  taskTextSpan.innerHTML = `${newTask.text}`;
  taskTextSpan.setAttribute(
    'id',
    'span-' + document.getElementById('taskList').children.length
  );
  taskTextSpan.classList.add('text-node');
  newListItem.appendChild(taskTextSpan); // add text to

  //create delete button
  let deleteButton = document.createElement('span');
  deleteButton.innerHTML = `<i class="fas fa-trash"></i>`;
  deleteButton.addEventListener('click', deleteHandler);
  deleteButton.classList.add('delete-btn');
  deleteButton.setAttribute(
    'id',
    'button-' + document.getElementById('taskList').children.length
  );
  newListItem.appendChild(deleteButton);


  //create edit button
  let editButton = document.createElement('span');
  editButton.innerHTML = `<i class="far fa-edit"></i>`;
  editButton.addEventListener('click', editHandler);
  editButton.setAttribute(
    'id',
    'edit-' + document.getElementById('taskList').children.length
  );
  editButton.classList.add('edit-btn');
  newListItem.appendChild(editButton);

  document.getElementById('taskList').appendChild(newListItem);
}

const addTaskHandler = () => {
  let task = document.getElementById('taskInput').value ;
  if(task)
    {let newTask = {
        text: task,
        complete: false,
    };
    saveNewTaskItem(newTask);
    addNewTaskListItem(newTask);
    document.getElementById('taskInput').value = '';
    }
  else{ 
    alert('Please add text');
    return;
  }
}

const checkedHandler = (event) => {
  let listItemIndex = event.target.id.charAt(
    event.target.id.length - 1
  );
  updateTaskListItem(listItemIndex, {
    text: event.target.parentElement.querySelector('span').innerHTML,
    complete: event.target.checked,
  });
}

//handler for task deletion button clicks
const deleteHandler= (event) => {
  let confirmResp = confirm('Are you sure you want to delete this task?');
  if (!confirmResp) return;

  let listItemIndex = event.target.parentNode.id.charAt(
    event.target.parentNode.id.length - 1
  );

  //remove item from taskList in localStorage
  let taskList = getTaskList();
  taskList.splice(listItemIndex, 1);
  localStorage.setItem('taskList', JSON.stringify(taskList));
  
  //remove from DOM
  document.getElementById(event.target.parentNode.id).parentNode.remove();
}

//handler for edit when button clicked
const editHandler = (event) => {
  let editButton = event.target;
  let taskEditInput;
  let taskTextSpan = document.getElementById('span-' + event.target.parentElement.id.charAt(event.target.parentElement.id.length-1));
  console.log(event.target.parentElement.id.charAt(event.target.parentElement.id.length-1));
  if (taskTextSpan) {
    //Edit was clicked
    taskEditInput = document.createElement('input');
    taskEditInput.setAttribute('type', 'text');
    taskEditInput.value = taskTextSpan.innerHTML;
    taskTextSpan.parentElement.replaceChild(taskEditInput, taskTextSpan);
    editButton.parentNode.innerHTML = '<i class="far fa-save"></i>';
  } else {
    //Save was clicked , span does not exist
    taskEditInput = event.target.parentElement.parentElement.querySelector(
      'input[type=text]'
    );
    if(taskEditInput.value)
    {
    taskTextSpan = document.createElement('span');
    taskTextSpan.classList.add('text-node');
    taskTextSpan.setAttribute(
      'id',
      'span-' + event.target.parentElement.id.charAt(event.target.parentElement.id.length-1)
    );
    taskTextSpan.innerHTML = taskEditInput.value;

    updateTaskListItem(editButton.parentElement.id.charAt(editButton.parentElement.id.length - 1), {
      text: taskTextSpan.innerHTML,
      complete: event.target.parentElement.parentElement.querySelector(
        'input[type=checkbox]'
      ).checked,
    });
    }
    else{
        deleteHandler(event);
    }

    event.target.parentElement.parentElement.replaceChild(taskTextSpan, taskEditInput);
    editButton.parentNode.innerHTML = '<i class="far fa-edit"></i>';
  }
}

document.getElementById('addTaskButton').addEventListener('click', addTaskHandler);


const loadFromLocalStorage = () => {
let taskList = JSON.parse(localStorage.getItem('taskList'));
//console.log(taskList);
if (taskList) {
  taskList.forEach((task) => {
    addNewTaskListItem(task);
  });
}
}

loadFromLocalStorage();

