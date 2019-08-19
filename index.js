//jshint esversion: 6

//defining global game variables
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext('2d');
let ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2.5;
let dy = -2.5;

const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

let rightPressed = false;
let leftPressed = false;

let brickRowCount = 4;
let brickColumnCount = 5;
let brickWidth = 75;
let brickHeight = 15;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;

// let colors = ["red", "blue", "black", "green", "orange"];
// let colorCount = 0;

let score = 0;
let lives = 3;

let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = {
      x: 0,
      y: 0,
      color: "#0095DD",
      status: 2
    };
  }
}


document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function mouseMoveHandler(e) {
  let relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > paddleWidth / 2 && relativeX < canvas.width - paddleWidth / 2) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

function keyDownHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = true;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = false;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
  }
}

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      let b = bricks[c][r];
        if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight && b.status > 0) {
          dy = -dy;
          if (b.status == 2) {
            b.status--;
            b.color = "red";
          } else if (b.status == 1) {
            b.status = 0;
            score++;
            if (score == brickRowCount * brickColumnCount) {
              //setTimout so that last block is cleared and score is updated
              alert("Final Score: " + score + ". You win, great shooting kid!");
              document.location.reload();
          }
        }
      }
    }
  }
}

function drawBall(color) {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD"; //colors[colorCount];
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      let brickX = (c * (brickWidth + brickPadding) + brickOffsetLeft);
      let brickY = (r * (brickHeight + brickPadding) + brickOffsetTop);
      //used to be == 1
      if (bricks[c][r].status >= 1) {
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = bricks[c][r].color;
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "0095DD";
  ctx.fillText("Score: " + score, 8, 20);
}

function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "0095DD";
  ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();

  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      (dx > 0) ? dx += dx*0.05 : dx -= dx*0.05;
      (dy > 0) ? dy += dy*0.05 : dy -= dy*0.05;
      dy = -dy;
    } else {
      lives--;
      if (!lives) {
        alert("Game Over!");
        document.location.reload();
      } else {
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 2.5;
        dy = -2.5;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }

  if (rightPressed) {
    paddleX += 7;
    if (paddleX + paddleWidth > canvas.width) {
      paddleX = canvas.width - paddleWidth;
    }
  } else if (leftPressed) {
    paddleX -= 7;
    if (paddleX < 0) {
      paddleX = 0;
    }
  }
  x += dx;
  y += dy;
  requestAnimationFrame(draw);
}


draw();
