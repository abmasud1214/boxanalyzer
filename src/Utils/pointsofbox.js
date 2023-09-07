

function intersectSegments(a1, a2, b1, b2) {
    if (!doesIntersect(a1, a2, b1, b2)) {
        return [NaN, NaN];
    }

    let v1 = [a2[0] - a1[0], a2[1] - a1[1]];
    let v2 = [b2[0] - b1[0], b2[1] - b1[1]];

    let xd = b1[0] - a1[0];
    let yd = b1[1] - a1[1];

    // Vector of second segment times s + base point (b1) is intersecting point.
    // S equation just from algebra 
    let s = (v1[1]*xd - v1[0]*yd) / (v1[0]*v2[1] - v2[0]*v1[1]);
    
    let xi = v2[0] * s + b1[0];
    let yi = v2[1] * s + b1[1];

    return [xi, yi];
}

function doesIntersect(a1, a2, b1, b2) {
    let v1 = [a2[0] - a1[0], a2[1] - a1[1]];
    let v2 = [b2[0] - b1[0], b2[1] - b1[1]];

    return !(Math.abs((v1[1] / v1[0]) - (v2[1] / v2[0])) < 0.0000000001);
}

// box points described by array. index 0 is y center. 1-3 are offshoots from y. 
// 4-6 are connected to offshoots. 7 is back corner of box.
// need 5 points to figure out every point of box. 1-4 establish two of the 
// vanishing points (cardinal points). 5 establishes final vanishing point
// fifth point must align with other 2 vanishing points.

function angleBetweenVectors(v1, v2) {
    magV1 = Math.sqrt(v1.reduce((prev, curr) => prev + curr ** 2, 0));
    magV2 = Math.sqrt(v2.reduce((prev, curr) => prev + curr ** 2, 0));
    dot = v1[0]*v2[0] + v1[1]*v2[1];
    console.log(dot, magV1, magV2);
    console.log(dot / (magV1*magV2));
    theta = Math.acos(dot / (magV1 * magV2));
    return theta;
}

// 0 : center
// 1 - 3 : first through third segment going counterclockwise
// 4 : point between first and second segment
// 5 : point between second and third
// 6 : point between third and fourth
// 7 : back corner

function angleFromXAxis(v1) {
    angle = Math.atan2(v1[1], v1[0]);
    return angle;
}

// console.log(doesIntersect([0, 0], [4, 4], [1, 1], [3, 3]))
export {intersectSegments, doesIntersect, angleBetweenVectors, angleFromXAxis};