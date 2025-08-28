(() => {
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    const scoreDisplay = document.getElementById('score');

    const CANVAS_WIDTH = canvas.width;
    const CANVAS_HEIGHT = canvas.height;

    const GRID_SIZE = 20;
    const CELL_SIZE = CANVAS_WIDTH / GRID_SIZE;

    let snake, direction, lastDirection, score, gameInterval, speed, food;

    function init() {
        snake = [{ x: 10, y: 10 }];
        direction = { x: 0, y: 0 };
        lastDirection = { x: 0, y: 0 };
        score = 0;
        speed = 120;
        placeFood();
        updateScore();

        if (gameInterval) clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, speed);
        draw();
    }

    function placeFood() {
        let valid = false;
        while (!valid) {
            food = {
                x: Math.floor(Math.random() * GRID_SIZE),
                y: Math.floor(Math.random() * GRID_SIZE)
            };
            valid = !snake.some(s => s.x === food.x && s.y === food.y);
        }
    }

    function draw() {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);


        ctx.fillStyle = '#ffdd57';
        ctx.beginPath();
        const foodSize = CELL_SIZE * 0.8;
        ctx.arc(food.x * CELL_SIZE + CELL_SIZE / 2, food.y * CELL_SIZE + CELL_SIZE / 2, foodSize / 2, 0, Math.PI * 2);
        ctx.fill();


        snake.forEach((segment, index) => {
            const gradient = ctx.createLinearGradient(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            gradient.addColorStop(0, "#3a86ff");
            gradient.addColorStop(0.5, "#ff006e");
            gradient.addColorStop(1, "#8338ec");

            ctx.fillStyle = index === 0 ? "#1db954" : gradient; // head green, body colorful
            ctx.fillRect(segment.x * CELL_SIZE, segment.y * CELL_SIZE, CELL_SIZE - 1, CELL_SIZE - 1);
        });
    }

    function gameLoop() {
        if (direction.x === 0 && direction.y === 0) return;

        const head = {...snake[0] };
        head.x += direction.x;
        head.y += direction.y;

        if (head.x < 0) head.x = GRID_SIZE - 1;
        else if (head.x >= GRID_SIZE) head.x = 0;
        if (head.y < 0) head.y = GRID_SIZE - 1;
        else if (head.y >= GRID_SIZE) head.y = 0;

        if (snake.some(seg => seg.x === head.x && seg.y === head.y)) {
            alertGameOver();
            return;
        }

        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            score++;
            if (score % 5 === 0 && speed > 50) {
                speed -= 10;
                clearInterval(gameInterval);
                gameInterval = setInterval(gameLoop, speed);
            }
            placeFood();
            updateScore();
        } else {
            snake.pop();
        }

        lastDirection = direction;
        draw();
    }

    function updateScore() {
        scoreDisplay.textContent = `Score: ${score}`;
    }

    function alertGameOver() {
        alert(`💀 Game Over! Your score was ${score}. Restarting...`);
        init();
    }

    function handleKey(e) {
        const key = e.key;
        if ((key === 'ArrowUp' || key === 'w') && !(lastDirection.x === 0 && lastDirection.y === 1)) {
            direction = { x: 0, y: -1 };
        } else if ((key === 'ArrowDown' || key === 's') && !(lastDirection.x === 0 && lastDirection.y === -1)) {
            direction = { x: 0, y: 1 };
        } else if ((key === 'ArrowLeft' || key === 'a') && !(lastDirection.x === 1 && lastDirection.y === 0)) {
            direction = { x: -1, y: 0 };
        } else if ((key === 'ArrowRight' || key === 'd') && !(lastDirection.x === -1 && lastDirection.y === 0)) {
            direction = { x: 1, y: 0 };
        }
    }

    function setupTouchControls() {
        document.getElementById('btn-up').addEventListener('click', () => {
            if (!(lastDirection.x === 0 && lastDirection.y === 1)) direction = { x: 0, y: -1 };
        });
        document.getElementById('btn-down').addEventListener('click', () => {
            if (!(lastDirection.x === 0 && lastDirection.y === -1)) direction = { x: 0, y: 1 };
        });
        document.getElementById('btn-left').addEventListener('click', () => {
            if (!(lastDirection.x === 1 && lastDirection.y === 0)) direction = { x: -1, y: 0 };
        });
        document.getElementById('btn-right').addEventListener('click', () => {
            if (!(lastDirection.x === -1 && lastDirection.y === 0)) direction = { x: 1, y: 0 };
        });
    }

    window.addEventListener('keydown', handleKey);
    setupTouchControls();
    init();
})();