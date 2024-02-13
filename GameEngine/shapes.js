//plane 
export function generateVertices(widthSegments, heightSegments) {
    let vertices = [];
    const stepX = 2 / widthSegments;
    const stepY = 2 / heightSegments;
    for (let y = -1; y < 1; y += stepY) {
        for (let x = -1; x < 1; x += stepX) {
            vertices.push(x, y);
            vertices.push(x + stepX, y);
            vertices.push(x + stepX, y + stepY);
            vertices.push(x, y + stepY);
            vertices.push(x, y);
            vertices.push(x + stepX, y);
            vertices.push(x, y + stepY);
        }
    }
    let vertexData = vertices;
    let VerticesData = [];
    let Empty = [];
    for (let i = 0; i < vertexData.length; i++) {
        if (vertexData[i] < 0) {
            VerticesData = vertexData[i] * 3.5;
        } else if (vertexData[i] > 0) {
            VerticesData = vertexData[i] * 3.5;
        } else {
            VerticesData = vertexData[i];
        }
        Empty.push(VerticesData);
    }
    return Empty;
}
export function generateIndices(widthSegments, heightSegments) {
    let indices = [];

    for (let y = 0; y < heightSegments; y++) {
        for (let x = 0; x < widthSegments; x++) {
            let topLeft = y * (widthSegments + 1) + x;
            let topRight = topLeft + 1;
            let bottomLeft = (y + 1) * (widthSegments + 1) + x;
            let bottomRight = bottomLeft + 1;

            indices.push(topLeft, topRight, bottomLeft);
            indices.push(topRight, bottomRight, bottomLeft);
        }
    }

    return indices;
}

//plane 

export const planeVertices = new Float32Array([
    -5, 0, -5,
    5, 0, -5,
    5, 0, 5,
    -5, 0, 5,
]);

export const planeIndices = new Uint16Array([
    0, 1, 2, 0, 2, 3,
]);

//cube

export const vertices = new Float32Array([
    -0.5, -0.5, -0.5,
    0.5, -0.5, -0.5,
    0.5, 0.5, -0.5,
    -0.5, 0.5, -0.5,
    -0.5, -0.5, 0.5,
    0.5, -0.5, 0.5,
    0.5, 0.5, 0.5,
    -0.5, 0.5, 0.5,
]);


export const indices = new Uint16Array([
    0, 1, 2, 0, 2, 3,
    4, 5, 6, 4, 6, 7,
    0, 3, 7, 0, 7, 4,
    1, 2, 6, 1, 6, 5,
    2, 3, 7, 2, 7, 6,
    0, 1, 5, 0, 5, 4,
]);


export function checkCollision(center1, halfSize1, center2, halfSize2) {
    const dx = Math.abs(center1[0] - center2[0]);
    const dy = Math.abs(center1[1] - center2[1]);
    const dz = Math.abs(center1[2] - center2[2]);

    const halfSizeSumX = halfSize1[0] + halfSize2[0];
    const halfSizeSumY = halfSize1[1] + halfSize2[1];
    const halfSizeSumZ = halfSize1[2] + halfSize2[2];

    return (
        dx <= halfSizeSumX &&
        dy <= halfSizeSumY &&
        dz <= halfSizeSumZ
    );
}