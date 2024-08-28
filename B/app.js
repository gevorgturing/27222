// app.js
document.addEventListener('DOMContentLoaded', () => {
    let tasks = [];
    let timeLeft = 20 * 60; // 20 minutes in seconds
    let timerInterval;

    // Fetch tasks from JSON
    fetch('tasks.json')
        .then(response => response.json())
        .then(data => {
            tasks = data;
            setupTest();
            startTimer();
        });

    function setupTest() {
        const tasksDiv = document.getElementById('tasks');
        const selectedTasks = selectRandomTasks(tasks, 10);
        selectedTasks.forEach((task, index) => {
            const taskDiv = document.createElement('div');
            taskDiv.innerHTML = `<p>${index + 1}. ${task.question}</p>`;
            shuffleArray(task.choices).forEach(choice => {
                taskDiv.innerHTML += `<input type="radio" name="q${index}" value="${choice}"> ${choice}<br>`;
            });
            tasksDiv.appendChild(taskDiv);
        });

        // Set random essay topic
        document.getElementById('essayTopic').textContent = selectRandomTasks(tasks, 1)[0].essayTopic;

        // Word count update
        document.getElementById('essayContent').addEventListener('input', updateWordCount);
    }

    function selectRandomTasks(array, count) {
        return array.sort(() => 0.5 - Math.random()).slice(0, count);
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function startTimer() {
        timerInterval = setInterval(() => {
            timeLeft--;
            if(timeLeft <= 0) {
                clearInterval(timerInterval);
                submitTest();
            }
            document.getElementById('timer').textContent = `Time left: ${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`;
        }, 1000);
    }

    function submitTest() {
        clearInterval(timerInterval);
        const answers = document.querySelectorAll('#tasks input[type="radio"]:checked');
        let score = 0;
        answers.forEach(answer => {
            if(tasks.find(task => task.choices.includes(answer.value)).correctAnswer === answer.value) {
                score++;
            }
        });
        const essay = document.getElementById('essayContent').value;
        const wordCount = essay.trim().split(/\s+/).length;
        const essayValid = wordCount >= 300 && wordCount <= 400;

        document.getElementById('result').innerHTML = `Your score: ${score}/10<br>${essayValid ? 'Essay word count is valid.' : 'Essay word count is invalid.'}`;
    }

    function updateWordCount() {
        const count = document.getElementById('essayContent').value.split(/\s+/).filter(word => word.length > 0).length;
        document.getElementById('wordCount').textContent = `Word Count: ${count}`;
    }
});