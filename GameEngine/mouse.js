let scalervalue = 10;
let Move = false;
let LastmoveXaxis = 1;
let LastmoveYaxis = 1;
let valueX = 0;
let valueY = 0;
let prevMouseX = 0;
let prevMouseY = 0;
let sensitivity = 10;
let rotationY = 0;

canvas.addEventListener('mousedown', (e) => {
    if (e.button === 0) {
        Move = true;
        LastmoveXaxis = LastmoveXaxis;
        LastmoveYaxis = LastmoveYaxis;
    }
});

canvas.addEventListener('mouseup', (e) => {
    if (e.button === 0) {
        Move = false;
        LastmoveXaxis = LastmoveXaxis;
        LastmoveYaxis = LastmoveYaxis;
    }
});


canvas.addEventListener('mousemove', (e) => {
    if (e.button === 0) {
        if (Move) {
            const newX = e.clientX;
            const newY = -e.clientY;
            if (Move && newX > prevMouseX) {
                valueX++;
            } else if (Move && newX < prevMouseX) {
                valueX--;
            }
            if (Move && newY > prevMouseY) {
                valueY++;
            } else if (Move && newY < prevMouseY) {
                valueY--;
            }
            rotationY += (e.movementY / 100) * 5;
            prevMouseX = newX;
            prevMouseY = newY;
            LastmoveXaxis = newX;
            LastmoveYaxis = newY;
        }
    }
});
canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    scalervalue += e.deltaY * 0.01;
    scalervalue = Math.min(Math.max(-Math.pow(10, 6), scalervalue), Math.pow(10, 6));
});
let cameraAngleX = -((valueX *sensitivity * Math.PI) / 180);
let cameraAngleY = ((rotationY *sensitivity * Math.PI) / 180);

let cameraX = scalervalue * Math.cos(cameraAngleY) * Math.sin(cameraAngleX);
let cameraY = scalervalue * Math.sin(cameraAngleY);
let cameraZ = scalervalue * Math.cos(cameraAngleY) * Math.cos(cameraAngleX);