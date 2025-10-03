let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let truck = new THREE.Mesh(
  new THREE.BoxGeometry(1,1,2),
  new THREE.MeshBasicMaterial({color: 0xff0000})
);
scene.add(truck);
truck.position.y = 0.5;

let road = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 200),
  new THREE.MeshBasicMaterial({color: 0x444444, side: THREE.DoubleSide})
);
road.rotation.x = Math.PI/2;
scene.add(road);

camera.position.set(0, 5, 8);
camera.lookAt(0,0,0);

let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let speed = 0.1;
let gameOver = false;
let keys = {};
let obstacles = [];

document.addEventListener("keydown", (e)=> keys[e.key] = true);
document.addEventListener("keyup", (e)=> keys[e.key] = false);

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

setInterval(() => {
  if(!gameOver) createObstacle();
}, 2000);

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
    }
  }
}

function animate() {
  requestAnimationFrame(animate);
  if(gameOver) return;

  if(keys["ArrowLeft"] && truck.position.x > -4) truck.position.x -= 0.1;
  if(keys["ArrowRight"] && truck.position.x < 4) truck.position.x += 0.1;

  for(let obs of obstacles) {
    obs.position.z += speed * 5;
  }

  score += 1;
  updateHUD();
  checkCollision();
  renderer.render(scene, camera);
}
animate();
