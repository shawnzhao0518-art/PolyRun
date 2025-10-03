let scene, camera, renderer, truck, road;
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let speed = 0.1;
let gameOver = false;
let paused = false;
let keys = {};
let obstacles = [];

init();
animate();

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // 卡车
  truck = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,2),
    new THREE.MeshBasicMaterial({color: 0xff0000})
  );
  scene.add(truck);
  truck.position.y = 0.5;

  // 道路
  road = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 200),
    new THREE.MeshBasicMaterial({color: 0x444444, side: THREE.DoubleSide})
  );
  road.rotation.x = Math.PI/2;
  scene.add(road);

  // 摄像机
  camera.position.set(0, 5, 8);
  camera.lookAt(0,0,0);

  // 键盘控制
  document.addEventListener("keydown", (e)=> keys[e.key] = true);
  document.addEventListener("keyup", (e)=> keys[e.key] = false);

  // UI按钮
  document.getElementById("pauseBtn").onclick = togglePause;
  document.getElementById("restartBtn").onclick = restartGame;

  // 定时生成障碍物
  setInterval(() => { if(!gameOver && !paused) createObstacle(); }, 2000);
}

function updateHUD() {
  document.getElementById("hud").textContent =
    "Score: " + score + " | High Score: " + highScore;
}

function createObstacle() {
  let obstacle = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({color: 0x00ff00})
  );
  obstacle.position.set((Math.random()-0.5)*6, 0.5, -50);
  scene.add(obstacle);
  obstacles.push(obstacle);
}

function checkCollision() {
  for(let obs of obstacles) {
    let dx = truck.position.x - obs.position.x;
    let dz = truck.position.z - obs.position.z;
    let distance = Math.sqrt(dx*dx + dz*dz);
    if(distance < 1.2) {
      gameOver = true;
      if(score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
      }
      document.getElementById("hud").textContent =
        "Game Over! Final Score: " + score + " | High Score: " + highScore;
      document.getElementById("restartBtn").style.display = "block";
    }
  }
}

function togglePause() {
  paused = !paused;
  document.getElementById("pauseBtn").textContent = paused ? "Resume" : "Pause";
}

function restartGame() {
  // 清理状态
  obstacles.forEach(o => scene.remove(o));
  obstacles = [];
  score = 0;
  gameOver = false;
  paused = false;
  truck.position.x = 0;

  document.getElementById("restartBtn").style.display = "none";
  document.getElementById("pauseBtn").textContent = "Pause";
  updateHUD();
}

function animate() {
  requestAnimationFrame(animate);
  if(gameOver || paused) return;

  // 卡车左右移动
  if(keys["ArrowLeft"] && truck.position.x > -4) truck.position.x -= 0.1;
  if(keys["ArrowRight"] && truck.position.x < 4) truck.position.x += 0.1;

  // 障碍物前进
  for(let obs of obstacles) {
    obs.position.z += speed * 5;
  }

  score += 1;
  updateHUD();
  checkCollision();

  renderer.render(scene, camera);
}
