const canvas = document.getElementById('canvas');
const gl = canvas.getContext('2d');
const drawFrame = document.getElementById('frame');
const div = document.getElementById('div');
const shapes = [];
let isDrawing;
let frameClicked = false;
let startX, startY, currentFrame;
let frames = [];
let selectedFrameIndex = -1;
let frameCounter = 1; // Counter for generating unique frame IDs

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let i = 1;
drawFrame.addEventListener('click', function () {
  i += 1;
  frame();
});

let colorPickers = document.getElementsByClassName('colorPicker');
let clrDisplays = document.getElementsByClassName('clrdisplay');
let selectedColor = colorPickers[0].value; // Set default color

function frame() {
  canvas.addEventListener('mousedown', function event(e) {
    isDrawing = true;
    startX = e.clientX - canvas.offsetLeft;
    startY = e.clientY - canvas.offsetTop;
    canvas.removeEventListener('mousedown', event);
  });
  canvas.addEventListener('mousemove', function eventHandlers(e) {
    if (!isDrawing) return;
    const x = e.clientX - canvas.offsetLeft;
    const y = e.clientY - canvas.offsetTop;
    const width = x - startX;
    const height = y - startY;
    gl.clearRect(0, 0, canvas.width, canvas.height);
    gl.strokeStyle = 'black';
    gl.fillStyle = 'transparent';
    gl.strokeRect(startX, startY, width, height);
    gl.fillRect(startX, startY, width, height);
    currentFrame = { id: `${frameCounter++}`, x: startX, y: startY, width, height };
  });
  canvas.addEventListener('mouseup', function eventHandler(e) {
    if (!isDrawing) return;
    isDrawing = false;
    if (currentFrame.width > 0 && currentFrame.height > 0) {
      for (let i = 0; i < colorPickers.length; i++) {
        colorPickers[i].addEventListener("input", function () {
          selectedColor = colorPickers[i].value;
          clrDisplays[i].innerHTML = selectedColor;
          frames.push(selectedColor);
        });
      }
      frames.push({
        id: currentFrame.id,
        x: currentFrame.x,
        y: currentFrame.y,
        width: currentFrame.width,
        height: currentFrame.height,
        color: selectedColor,
      });
    }
    canvas.removeEventListener('mouseup', eventHandler);
    drawCanvas();
  });
}

canvas.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  drawCanvas();
});

function drawCanvas() {
  gl.clearRect(0, 0, canvas.width, canvas.height);
  // Draw shapes within frames first
  frames.forEach((frame, i) => {
    gl.fillStyle = frame.color;
    gl.fillRect(frame.x, frame.y, frame.width, frame.height);
    drawFrameBorder(frame, i);// Draw frame border
    drawFrameText(frame, i);// Draw text
  });
}
function drawFrameText(frame, i) {
  gl.font = "15px Verdana";
  gl.fillStyle = 'black'; // Text color
  gl.fillText(`Frame ${i + 1}`, frame.x, frame.y - 10);
}
function drawFrameBorder(frame, i) {
  if (i === selectedFrameIndex) {
    gl.strokeStyle = 'black';
    gl.lineWidth = 5;
    gl.fillText(`${frame.width} × ${frame.height}`, frame.x + (frame.width / 2.2), frame.y + (frame.height *1.1 ));
    gl.text
  } else {
    gl.strokeStyle = frame.color;
    gl.lineWidth = 1;
  }
  gl.strokeRect(frame.x, frame.y, frame.width, frame.height);
}

function isWithinFrame(shape, frame) {
  return (
    shape.x >= frame.x &&
    shape.y >= frame.y &&
    shape.x + shape.width <= frame.x + frame.width &&
    shape.y + shape.height <= frame.y + frame.height
  );
}

canvas.addEventListener('click', function (e) {
  const x = e.clientX - canvas.offsetLeft;
  const y = e.clientY - canvas.offsetTop;
  for (let i = 0; i < frames.length; i++) {
    const frame = frames[i];
    if (
      x >= frame.x &&
      x <= frame.x + frame.width &&
      y >= frame.y &&
      y <= frame.y + frame.height
    ) {
      selectedFrameIndex = i; // Update the selected frame index
      frameClicked = true;
      gl.clearRect(0, 0, canvas.width, canvas.height);
      drawCanvas(); // Redraw canvas to reflect selection
      break; // Exit loop since frame is found
    }
  }
});

document.addEventListener('keydown', function (event) {
  if (event.key === 'Delete' && selectedFrameIndex !== -1) {
    frames.splice(selectedFrameIndex, 1);
    selectedFrameIndex = -1;
    drawCanvas();
  }
});