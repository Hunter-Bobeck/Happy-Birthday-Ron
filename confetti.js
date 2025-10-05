function celebrateWithConfetti() {
  const defaults = {
    spread: 360,
    ticks: 100,
    gravity: 0.5,
    decay: 0.94,
    startVelocity: 30,
    colors: ['#FFD700', '#FF6B6B', '#90EE90', '#87CEEB']
  };

  function shoot() {
    confetti({
      ...defaults,
      particleCount: 50,
      scalar: 1.2,
      shapes: ['circle', 'square']
    });

    confetti({
      ...defaults,
      particleCount: 25,
      scalar: 0.75,
      shapes: ['circle']
    });
  }

  setTimeout(shoot, 0);
  setTimeout(shoot, 100);
  setTimeout(shoot, 200);
}

// Add golf ball particle system
function createGolfBall(x, y, angle, speed) {
  const ball = document.createElement('img');
  ball.src = 'golfball.png';
  ball.style.position = 'fixed';
  ball.style.left = x + 'px';
  ball.style.top = y + 'px';
  ball.style.width = '20px';
  ball.style.height = '20px';
  ball.style.pointerEvents = 'none';
  ball.style.zIndex = '1000';
  ball.style.transform = 'translate(-50%, -50%)';
  document.body.appendChild(ball);

  let velocityX = Math.cos(angle) * speed;
  let velocityY = Math.sin(angle) * speed;
  let posX = x;
  let posY = y;
  const gravity = 0.5;

  function checkHoleCollision() {
    // Get hole position in viewport coordinates
    const hole = document.querySelector('.golf-elements ellipse');
    const holeRect = hole.getBoundingClientRect();
    const holeX = holeRect.left + holeRect.width/2;
    const holeY = holeRect.top + holeRect.height/2;

    // Check distance between ball and hole
    const dx = posX - holeX;
    const dy = posY - holeY;
    const distance = Math.sqrt(dx*dx + dy*dy);

    if (distance < 30) { // Collision radius
      // Trigger celebration
      celebrateWithConfetti();
      
      // Make flag rainbow colored
      const flag = document.querySelector('.golf-elements path');
      flag.style.transition = 'fill 0.2s ease';
      flag.style.animation = 'flagRainbow 1s linear';
      
      // Reset flag after animation
      setTimeout(() => {
        flag.style.animation = '';
      }, 1000);

      // Remove the ball
      ball.remove();
      return true;
    }
    return false;
  }

  function animate() {
    velocityY += gravity;
    posX += velocityX;
    posY += velocityY;

    ball.style.left = posX + 'px';
    ball.style.top = posY + 'px';
    ball.style.transform = `translate(-50%, -50%) rotate(${posX}deg)`;

    // Check for hole collision before checking if off screen
    if (checkHoleCollision()) {
      return;
    }

    // Remove ball when it goes off screen
    if (posY > window.innerHeight || posX < 0 || posX > window.innerWidth) {
      ball.remove();
      return;
    }

    requestAnimationFrame(animate);
  }

  animate();
}

function launchGolfBalls(x, y) {
  // Launch single ball upward
  const angle = -Math.PI/2; // -90 degrees (straight up)
  const speed = 20; // Slightly faster for better effect
  createGolfBall(x, y, angle, speed);
}

// Update click handler to only launch golf ball
document.querySelector('.scene').addEventListener('click', function(e) {
  launchGolfBalls(e.clientX, e.clientY);
});