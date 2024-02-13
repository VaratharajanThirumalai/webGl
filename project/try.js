const canvas = document.getElementById('gridline');
const image = document.getElementById('logo');
const imageangry = document.getElementById('logo1');
const imagelogo = document.getElementById('logo2');
const imagelog = document.getElementById('logo3');
const gl = canvas.getContext('2d');
const div = document.getElementById('my-div');
div.style.display = 'none';
const imagesOnCanvas = [];
const objectWidth = image.width;
const objectHeight = image.height;
let selectedImage = null;
let isDragging = false;
let offsetX = 0;
let offsetY = 0;
function imageInfo(img) {
    img.addEventListener('click', () => {
        selectedImage = img;
    });
}
imageInfo(image);
imageInfo(imageangry);
imageInfo(imagelogo);
imageInfo(imagelog);
canvas.addEventListener('click', (e) => {
    let x = e.clientX - canvas.getBoundingClientRect().left;
    let y = e.clientY - canvas.getBoundingClientRect().top;
    if (e.ctrlKey) {
        div.style.left = x + 'px';
        div.style.top = y + 'px';
        div.style.display = '';
    }
});
const startButton = document.getElementById('start-button');
startButton.addEventListener('click', (e) => {
    if (selectedImage) {
        let x = e.clientX - canvas.getBoundingClientRect().left;
        let y = e.clientY - canvas.getBoundingClientRect().top;
        const minX = 0;
        const minY = 0;
        const maxX = canvas.width - (objectWidth + 2 * 10 + 2 * 5);
        const maxY = canvas.height - (objectHeight + 2 * 10 + 2 * 5);
        x = Math.min(Math.max(x, minX), maxX);
        y = Math.min(Math.max(y, minY), maxY);
        imagesOnCanvas.push({
            img: selectedImage, x, y, width: objectWidth,
            height: objectHeight, id: Date.now().toString(),padding:5, margin: 3
        });
        drawImages();
        div.style.display = 'none';
    }
});
const deleteButton = document.getElementById('delete-button');
let closestIndex = -1;
deleteButton.addEventListener('click', (e) => {
    const x = e.clientX - canvas.getBoundingClientRect().left;
    const y = e.clientY - canvas.getBoundingClientRect().top;
    let closestDistance = Number.MAX_SAFE_INTEGER;
    imagesOnCanvas.forEach((image1, index) => {
        const distance = Math.sqrt((x - image1.x) ** 2 + (y - image1.y) ** 2);
        if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
        }
    });
    if (closestIndex !== -1) {
        imagesOnCanvas.splice(closestIndex, 1);
        drawImages();
    }
    div.style.display = 'none';
});
const copyButton = document.getElementById('Copy-button');
copyButton.addEventListener('click', (e) => {
    if (selectedImage) {
        let x = e.clientX - canvas.getBoundingClientRect().left;
        let y = e.clientY - canvas.getBoundingClientRect().top;
        const copyImage = selectedImage.img;
        const copyWidth = objectWidth;
        const copyHeight = objectHeight;
        const minX = 0;
        const minY = 0;
        const maxX = canvas.width - (objectWidth + 2 * 10 + 2 * 5);
        const maxY = canvas.height - (objectHeight + 2 * 10 + 2 * 5);
        x = Math.min(Math.max(x, minX), maxX);
        y = Math.min(Math.max(y, minY), maxY);
        imagesOnCanvas.push({
            img: copyImage, x, y, width: copyWidth, height: copyHeight,
            id: Date.now().toString(), padding:5, margin: 3,
        });
        drawImages();
        div.style.display = 'none';
    }
});
canvas.addEventListener('mousedown', (e) => {
    const x = e.clientX - canvas.getBoundingClientRect().left;
    const y = e.clientY - canvas.getBoundingClientRect().top;
    imagesOnCanvas.forEach((image) => {
        if (x >= image.x && x <= image.x + objectWidth && y >= image.y && y <= image.y + objectHeight) {
            selectedImage = image;
            offsetX = x - image.x;
            offsetY = y - image.y;
            isDragging = true;
           
        }
    });
    document.onmouseup = function () {
        isDragging = false;
        document.onmousemove = null;
        document.onmouseup = null;
    };
});
canvas.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const x = e.clientX - canvas.getBoundingClientRect().left;
        const y = e.clientY - canvas.getBoundingClientRect().top;
        const minX = 0;
        const minY = 0;
        const maxX = canvas.width - objectWidth;
        const maxY = canvas.height - objectHeight;
        selectedImage.x = Math.min(Math.max(x - offsetX, minX), maxX);
        selectedImage.y = Math.min(Math.max(y - offsetY, minY), maxY);
        drawImages();
        overlap()
    }
    
});
function drawImages() {
    gl.clearRect(0, 0, canvas.width, canvas.height);
    imagesOnCanvas.forEach((image) => {
        const padding = image.padding;
        const margin = image.margin;
        const x = image.x;
        const y = image.y;
        const width = objectWidth + 2 * (padding + margin);
        const height = objectHeight + 2 * (padding + margin);
        gl.fillStyle = 'white';
        gl.fillRect(x - margin, y - margin, width, height);
        gl.drawImage(image.img, x + padding, y + padding, objectWidth, objectHeight);
    });
}
function overlap() {
    if (selectedImage) {
        const padding = selectedImage.padding;
        const margin = selectedImage.margin;
        x = selectedImage.x;
        y = selectedImage.y;
        const width = objectWidth + 2 * (padding + margin);
        const height = objectHeight + 2 * (padding + margin);
        gl.fillStyle = 'white';
        gl.fillRect(x - margin, y - margin, width, height);
        gl.drawImage(selectedImage.img, x + padding, y + padding, objectWidth, objectHeight);
    }
}

