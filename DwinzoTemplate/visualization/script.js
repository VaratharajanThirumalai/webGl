const canvas = document.getElementById('canvas')
const gl = canvas.getContext('2d');
let colorPickers = document.getElementsByClassName('colorPicker');
let clrDisplays = document.getElementsByClassName('clrdisplay');
const template = document.querySelector('.rem');
const container = document.querySelector('.container');
const treeView = document.getElementById('ul');
let treeViewItem;
const shapes = [];
class Drag {
    resetOpacity() {
        const draggableItems = document.querySelectorAll("li");
        draggableItems.forEach(item => {
            item.style.opacity = 1;
            item.style.border = "";
        });
    }
    isElementInDiv(element) {
        const divContainer = document.getElementById("div");
        return divContainer.contains(element);
    }
    createTreeViewItem(id, type) {
        const li = document.createElement("li");
        li.draggable = true;
        li.id = id;
        const text = document.createTextNode(type.toUpperCase());
        li.appendChild(text);
        treeView.appendChild(li);
        return li;
    }
    createTree(shapes, parentUl, depth = 0, maxDepth = 10) {
        shapes.forEach(shape => {
            const li = document.createElement("li");
            li.draggable = true;
            li.id = shape.id;
            const text = document.createTextNode(shape.type.toUpperCase());
            li.appendChild(text);
            if (depth < maxDepth && shape.children && shape.children.length > 0) {
                const nestedUl = document.createElement("ul");
                li.appendChild(nestedUl);
                if (parentUl !== nestedUl) {
                    this.createTree(shape.children, nestedUl, depth + 1, maxDepth);
                }
            }
            parentUl.appendChild(li);
        });
    }

    rectangle() {
        let rectX = 500;
        let rectY = 600;
        let rectWidth = 200;
        let rectHeight = 100;
        gl.fillRect(rectX, rectY, rectWidth, rectHeight);
        gl.fill()
    }
}
const Drop = new Drag();
for (let i = 0; i < colorPickers.length; i++) {
    colorPickers[i].addEventListener("input", function () {
        const selectedColor = colorPickers[i].value;
        clrDisplays[i].innerHTML = selectedColor;
    });
}
let shapesData = [
    {
        id: 1,
        type: 'rectangle',
        children: [
            {
                id: 2,
                type: 'circle',
                children: []
            },
            {
                id: 3,
                type: 'triangle',
                children: []
            }
        ]
    },
    {
        id: 4,
        type: 'triangle',
        children: [
            {
                id: 5,
                type: 'circle',
                children: []
            },
            {
                id: 6,
                type: 'rectangle',
                children: []
            }
        ]
    }
];

Drop.createTree(shapesData, template);
treeView.addEventListener("click", function (event) {
    if (event.target.tagName.toLowerCase() === "li") {
        const clickedLi = event.target;
        const nestedUl = clickedLi.querySelectorAll(`"#ul li"`);
        if (nestedUl) {
            nestedUl.style.display = (nestedUl.style.display === "none") ? "block" : "none";
        }
        const nestedLi = clickedLi.querySelector(`"#li ul"`);
        if (nestedLi) {
            nestedLi.style.display = (nestedLi.style.display === "none") ? "block" : "none";
        }
    }
});

document.addEventListener("dragstart", function (event) {
    if (event.target.tagName.toLowerCase() === "li") {
        event.target.style.opacity = 1;
        event.dataTransfer.setData("text", event.target.id);
    }
});

document.addEventListener("dragover", function (event) {
    event.preventDefault();
    if (event.target.tagName.toLowerCase() === "li") {
        event.target.style.border = "1px dashed #000000";
    }
});

document.addEventListener("drop", function (event) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    const draggedLi = document.getElementById(data);
    const targetLi = event.target;
    const isDropTargetInDiv = Drop.isElementInDiv(targetLi);
    const isDropTargetParent = targetLi.tagName.toLowerCase() === "li" && targetLi.childElementCount > 0;
    if (isDropTargetInDiv) {
        const parentShapeId = parseInt(targetLi.id);
        const parentShape = shapes.find(shape => shape.id === parentShapeId);
        const isChildElement = targetLi.parentNode !== draggedLi.parentNode;
        if (isChildElement && isDropTargetParent) {
            parentShape.children = [];
        } else {
            if (parentShape) {
                const childShapeId = shapes.find(shape => shape.id === parseInt(data)).id;
                const childShape = shapes.find(shape => shape.id === childShapeId);
                if (childShape) {
                    parentShape.children.push(childShape);
                }
            }
        }
        targetLi.appendChild(draggedLi);
    }
    Drop.resetOpacity();
});
document.addEventListener("dragend", function () {
    Drop.resetOpacity();
});
