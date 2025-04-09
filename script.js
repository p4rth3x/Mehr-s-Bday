const bag = document.getElementById("bag");
const game = document.getElementById("game");
const collage = document.getElementById("collage");
const collageGrid = document.getElementById("collageGrid");
const counter = document.getElementById("counter");
const nextButton = document.getElementById("nextButton");

const photoSources = [
  "photo1.JPG", "photo2.JPG", "photo3.JPG", "photo4.JPG",
  "photo5.JPG", "photo6.JPG", "photo7.JPG", 
];

let usedPhotos = [...photoSources];
let collectedPhotos = [];
let lastTwoPhotos = [];

// ✅ Load sound effect
const collectSound = new Audio('collect.mp3');

function updateCounter() {
  counter.textContent = `Photos Collected: ${collectedPhotos.length} / 5`;
}

function createPhoto() {
  if (usedPhotos.length === 0) usedPhotos = [...photoSources];

  let availablePhotos = usedPhotos.filter(p => !lastTwoPhotos.includes(p));

  if (availablePhotos.length === 0) {
    lastTwoPhotos = [];
    availablePhotos = [...photoSources];
  }

  const idx = Math.floor(Math.random() * availablePhotos.length);
  const src = availablePhotos[idx];

  lastTwoPhotos.push(src);
  if (lastTwoPhotos.length > 2) lastTwoPhotos.shift();

  const photo = document.createElement("img");
  photo.src = src;
  photo.className = "photo";
  photo.style.left = `${Math.random() * (window.innerWidth - 100)}px`;
  game.appendChild(photo);
  fall(photo);
}

function fall(photo) {
  let top = -100;
  const interval = setInterval(() => {
    if (top > window.innerHeight - 160) {
      const photoRect = photo.getBoundingClientRect();
      const bagRect = bag.getBoundingClientRect();

      if (
        photoRect.left < bagRect.right &&
        photoRect.right > bagRect.left &&
        photoRect.bottom > bagRect.top
      ) {
        collectedPhotos.push(photo.src);
        updateCounter();
        collectSound.play(); // 🔊 play sound when collected
        photo.remove();

        if (collectedPhotos.length === 5) {
          setTimeout(() => {
            showCollage();
            dropConfetti();
          }, 1000);
        }
      } else {
        photo.remove();
      }

      clearInterval(interval);
    } else {
      top += 5;
      photo.style.top = `${top}px`;
    }
  }, 30);
}

function showCollage() {
  game.classList.add("hidden");
  collage.classList.remove("hidden");

  collectedPhotos.forEach(src => {
    const img = document.createElement("img");
    img.src = src;
    collageGrid.appendChild(img);
  });

  nextButton.classList.remove("hidden");
  nextButton.onclick = () => {
    window.location.href = "page2.html";
  };
}

function spawnLoop() {
  if (collectedPhotos.length >= 5) return;
  createPhoto();
  setTimeout(spawnLoop, 2000);
}

document.addEventListener("keydown", (e) => {
  const bagRect = bag.getBoundingClientRect();
  const step = 40;

  if (e.key === "ArrowLeft" && bagRect.left > 0) {
    bag.style.left = `${bag.offsetLeft - step}px`;
  } else if (e.key === "ArrowRight" && bagRect.right < window.innerWidth) {
    bag.style.left = `${bag.offsetLeft + step}px`;
  }
});

function dropConfetti() {
  const duration = 3 * 1000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 6,
      angle: 60,
      spread: 55,
      origin: { x: 0 }
    });
    confetti({
      particleCount: 6,
      angle: 120,
      spread: 55,
      origin: { x: 1 }
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
  const gameMusic = document.getElementById("gameMusic");

  // Start music after any key press (user interaction)
  document.addEventListener("keydown", () => {
    if (gameMusic && gameMusic.paused) {
      gameMusic.play().catch(e => console.log("Autoplay blocked:", e));
    }
  });

  
}

updateCounter();
spawnLoop();
