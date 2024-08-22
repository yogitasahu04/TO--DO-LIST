
// Load tasks from localStorage or initialize an empty array
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let taskCompleted = false; // Flag to indicate if a task was completed

// Function to save tasks to localStorage
const saveTasks = () => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

// Function to add a new task
const addTask = () => {
    const taskInput = document.getElementById("taskInput");
    const text = taskInput.value.trim();

    if (text) {
        tasks.push({ text: text, completed: false });
        taskInput.value = "";
        saveTasks(); // Save the updated task list to localStorage
        updateTasksList();
    }
};

// Function to delete a task
const deleteTask = (index) => {
    tasks.splice(index, 1);
    saveTasks(); // Save the updated task list to localStorage
    updateTasksList(false); // Update the task list UI without confetti
};

// Function to edit a task
const editTask = (index) => {
    // Set the task text in the input field
    const taskInput = document.getElementById('taskInput');
    taskInput.value = tasks[index].text;

    // Remove the task from the array
    tasks.splice(index, 1);
    saveTasks(); // Save the updated task list to localStorage
    updateTasksList(); // Update the task list UI
};

// Function to toggle the completion status of a task
const toggleTaskComplete = (index) => {
    tasks[index].completed = !tasks[index].completed;
    console.log("Task completion toggled:", tasks[index]); // Debug log
    taskCompleted = true; // Mark as a task completion event
    saveTasks(); // Save the updated task list to localStorage
    updateTasksList();
};

// Function to update the task list and status number
const updateTasksList = (triggerConfetti = true) => {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    tasks.forEach((task, index) => {
        const listItem = document.createElement('li');
        listItem.className = 'taskItem';

        listItem.innerHTML = `
            <div class="task ${task.completed ? 'completed' : ''}">
                <input type="checkbox" class="checkbox" ${task.completed ? 'checked' : ''}/>
                <p>${task.text}</p>
            </div>
            <div class="icons">
                <img src="./img/edit.png" onclick="editTask(${index})" alt="Edit Task" />
                <img src="./img/bin.png" onclick="deleteTask(${index})" alt="Delete Task" />
            </div>
        `;

        listItem.querySelector('.checkbox').addEventListener('change', () => toggleTaskComplete(index));
        taskList.append(listItem);
    });

    updateStatus(triggerConfetti);
    filterTaskList(); // Apply filtering after updating the task list
};

// Function to update the status number
const updateStatus = (triggerConfetti) => {
    const completedTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    document.getElementById('numbers').innerText = `${completedTasks} / ${totalTasks}`;

    // Update the progress bar
    const progress = (totalTasks === 0) ? 0 : (completedTasks / totalTasks) * 100;
    document.getElementById('progress').style.width = `${progress}%`;

    if (triggerConfetti && taskCompleted && tasks.length && completedTasks === totalTasks) {
        showMessage(); // Show the message
        blaskconfetti(); // Launch confetti when all tasks are complete
        taskCompleted = false; // Reset the flag after confetti is triggered
    }
};

// Function to reset tasks
const resetTasks = () => {
    tasks = [];
    saveTasks(); // Save the cleared task list to localStorage
    updateTasksList(false); // Update the task list UI without confetti
};

// Event listener for form submission
document.getElementById('newTask').addEventListener('click', function (e) {
    e.preventDefault();
    addTask();
});

// Event listener for reset button
document.getElementById('resetButton').addEventListener('click', function () {
    resetTasks();
});

// Load tasks from localStorage when the page loads
document.addEventListener('DOMContentLoaded', updateTasksList);

// Function to show confetti animation
const launchConfetti = () => {
    console.log("Launching confetti"); // Debug log
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
};

// Function to show "Keep it up!" message
const showMessage = () => {
    const details = document.querySelector('.details');
    const message = document.createElement('p');
    message.className = 'congrats-message';
    message.textContent = 'Congratulation!';
    details.appendChild(message);

    // Remove the message after 3 seconds
    setTimeout(() => {
        message.remove();
    }, 3000);
};

// Search functionality
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('#searchInput');
    const taskList = document.querySelector('#task-list');

    // Event listener for search input
    searchInput.addEventListener('input', function () {
        const query = this.value.toLowerCase();
        const tasks = taskList.querySelectorAll('.taskItem');
        
        tasks.forEach(task => {
            const taskText = task.querySelector('.task p').textContent.toLowerCase();
            if (taskText.includes(query)) {
                task.style.display = 'flex'; // Show matching task
            } else {
                task.style.display = 'none'; // Hide non-matching task
            }
        });
    });
});

const blaskconfetti = () => {
    const count = 200,
    defaults = {
        origin: { y: 0.7 },
    };

    function fire(particleRatio, opts) {
        confetti(
            Object.assign({}, defaults, opts, {
                particleCount: Math.floor(count * particleRatio),
            })
        );
    }

    fire(0.25, {
        spread: 26,
        startVelocity: 55,
    });

    fire(0.2, {
        spread: 60,
    });

    fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
    });

    fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
    });

    fire(0.1, {
        spread: 120,
        startVelocity: 45,
    });
};

// Filter functionality
const filterTaskList = () => {
    const filterValue = document.getElementById('filter-tasks').value;
    const taskItems = document.querySelectorAll('.taskItem');

    taskItems.forEach(taskItem => {
        const task = taskItem.querySelector('.task');
        const isCompleted = task.classList.contains('completed');

        switch (filterValue) {
            case 'all':
                taskItem.style.display = 'flex';
                break;
            case 'completed':
                taskItem.style.display = isCompleted ? 'flex' : 'none';
                break;
            case 'pending':
                taskItem.style.display = !isCompleted ? 'flex' : 'none';
                break;
        }
    });
};

// Event listener for filter change
document.getElementById('filter-tasks').addEventListener('change', filterTaskList);
