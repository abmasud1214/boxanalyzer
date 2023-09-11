import { intersectSegments, doesIntersect, 
    angleBetweenVectors, angleFromXAxis,
    betweenTwoAngles, ccw, vector, vectorMagnitude } from "./geometryFunctions";

// 0 : center
// 1 - 3 : first through third segment going counterclockwise
// 4 : point between first and second segment
// 5 : point between second and third
// 6 : point between third and first
// 7 : back corner

export function addPoint(boxPoints, newPoint) {
    let newBoxPoints = [...boxPoints];
    newBoxPoints[indexOfPoint(boxPoints, newPoint)] = newPoint;

    return newBoxPoints;
}

export function indexOfPoint(boxPoints, newPoint) {
    if (lengthDefined(boxPoints) === 0 || 
        lengthDefined(boxPoints) === 1 ||
        lengthDefined(boxPoints) === 7) {
        return lengthDefined(boxPoints);
    } else if (lengthDefined(boxPoints) < 4) {
        return point2or3(boxPoints, newPoint);
    } else if (lengthDefined(boxPoints) < 7) {
        return point456(boxPoints, newPoint);
    }
}

function point2or3(boxPoints, newPoint) {
    const vector1 = vector(boxPoints[0], boxPoints[1]);
    const vector2 = vector(boxPoints[0], newPoint);
    return ccw(vector1, vector2) ? 2 : 3; 
}

function point456(boxPoints, newPoint) {
    const angle1 = angleFromXAxis(vector(boxPoints[0], boxPoints[1]));
    const angle2 = angleFromXAxis(vector(boxPoints[0], boxPoints[2]));
    const angle3 = angleFromXAxis(vector(boxPoints[0], boxPoints[3]));
    const angleP = angleFromXAxis(vector(boxPoints[0], newPoint));
    if (betweenTwoAngles(angleP, angle1, angle2)) return 4;
    else if (betweenTwoAngles(angleP, angle2, angle3)) return 5;
    else return 6;
}

export function lengthDefined(arr) {
    return arr.reduce((prev, c) => prev + (c === undefined ? 0 : 1), 0);
}

function vpFromIdx(boxPoints, idx1, idx2, idx3) {
    let origin = boxPoints[0];
    let point1 = boxPoints[idx1];
    let point2 = boxPoints[idx2];
    let pointV = boxPoints[idx3];
    let vp1 = intersectSegments(origin, point1, point2, pointV);
    let vp2 = intersectSegments(origin, point2, point1, pointV);
    // console.log(origin, point1, point2, pointV, vp1, vp2);
    return [vp1, vp2];
}

const connectedPoints = {
    4: [1, 2],
    5: [2, 3],
    6: [1, 3]
}

export function calculateVanishingPoints(boxPoints, vp) {
    let newVanishingPoints = [...vp];
    // When a vanishing point is set, that is the defined vp and will never be replaced.
    // When the first "exterior" segment is added (l == 5), 
    // two of the vps are set. When the second segment is added (l == 6),
    // the third vp is set. Only the third will be set, since the other two 
    // can't be overwritten.
    if (lengthDefined(boxPoints) === 5 || lengthDefined(boxPoints) === 6) {
        for (let i = 4; i < 7; i++) {
            if (boxPoints[i] !== undefined) {
                let p = connectedPoints[i]
                let [vp1, vp2] = vpFromIdx(boxPoints, p[0], p[1], i);
                newVanishingPoints[p[0] - 1] = vp[p[0] - 1] ? vp[p[0] - 1] : vp1
                newVanishingPoints[p[1] - 1] = vp[p[1] - 1] ? vp[p[1] - 1] : vp2
            }
        }
    }
    return newVanishingPoints;
}

export function correctBoxPoints(boxPoints, vp, point) {
    let newBoxPoints = [...boxPoints];
    if (lengthDefined(boxPoints) === 5) {
        // console.log("56");
        const n = point456(boxPoints, point);
        const tempBoxPoints = [...boxPoints];
        tempBoxPoints[n] = point
        const vpNew = calculateVanishingPoints(tempBoxPoints, vp);
        const p = connectedPoints[n];
        // console.log(vpNew, p[1]-1, p[0]-1);
        const intersectPoint = intersectSegments(boxPoints[p[0]], vpNew[p[1]-1],
            boxPoints[p[1]], vpNew[p[0]-1]);
        newBoxPoints = addPoint(boxPoints, intersectPoint);
    } else if (lengthDefined(boxPoints) === 6) {
        console.log("6")
        const n = point456(boxPoints, point);
        const p = connectedPoints[n];
        const intersectPoint = intersectSegments(boxPoints[p[0]], vp[p[1]-1],
            boxPoints[p[1]], vp[p[0]-1]);
        newBoxPoints = addPoint(boxPoints, intersectPoint);
    } else if (lengthDefined(boxPoints) === 7) {
        console.log("8")
        const p1 = boxPoints[5];
        const p2 = boxPoints[6];
        const intersectPoint = intersectSegments(p1, vp[0], p2, vp[1]);
        newBoxPoints = addPoint(boxPoints, intersectPoint);
    } else {
        newBoxPoints = addPoint(boxPoints, point);
    }
    return newBoxPoints;
}

export const backBoxConnections = {
    0: [],
    1: [0],
    2: [0],
    3: [0],
    4: [1, 2],
    5: [2, 3],
    6: [1, 3],
    7: [4, 5, 6]
}

export function validPoint(box, point) {
    let valid = true;
    const idx = indexOfPoint(box, point);
    if (idx === 2 || idx === 3) {
        valid = validCardinalPoint(box, point);
    } else if (idx >= 4 && idx < 7 ) {
        valid = validBranchPoint(box, point);
    }
    return valid;
}

/**
 * "Cardinal Point" are the points that connect directly to the origin (closest
 * point to viewer of box.) They make up the "Y";
 * 
 * All cardinal points must be at least PI/2 rad from other cardinal points to
 * create a mathematically valid box in 3 point perspective.
 * 
 * @param {Array} box 
 * @param {Array} point  
 * @returns {bool} whether the point is within PI/2 rad of other 
 */
function validCardinalPoint(box, point) {
    const v1 = vector(box[1], box[0]);
    const vp = vector(point, box[0]);
    let valid = (angleBetweenVectors(v1, vp) > Math.PI / 2);
    let validP2 = box[2] !== undefined && angleBetweenVectors(vector(box[2], box[0]), vector(point, box[0])) > Math.PI / 2;
    let validP3 = box[3] !== undefined && angleBetweenVectors(vector(box[3], box[0]), vector(point, box[0])) > Math.PI / 2;
    valid = valid && (box[2] === undefined || validP2) && (box[3] === undefined || validP3); 
    return valid
}

/**
 * Branch point refers to the external points of the box, connected with two lines
 * to the cardinal points.
 * 
 * All branch points must create vanishing points that point in the same direction
 * as a cardinal point to create a mathematically valid box in 3 pt perspective.
 * 
 * @param {Array} box : Array of Arrays of integers
 * @param {Array} point : Array of integers, length 2
 * @param {Array} vanishingPoints : Array of Array of integers
 * @returns {bool} whether the point gives valid vanishing points.
 */
function validBranchPoint(box, point) {
    const idx = indexOfPoint(box, point);
    const connections = backBoxConnections[idx];
    // Constraint only cares about vanishing points from this new point.
    // Pretend as if this is the first point added.
    let tempBoxPoints = [...box]; 
    tempBoxPoints[4] = undefined;
    tempBoxPoints[5] = undefined;
    tempBoxPoints[6] = undefined;
    tempBoxPoints = addPoint(tempBoxPoints, point);
    const vp = calculateVanishingPoints(tempBoxPoints, Array.from(3));
    let valid = true;
    console.log(connections, vp);    
    for (const connection of connections) {
        const cPoint = box[connection];
        const vectorConn = vector(cPoint, box[0]);
        const vectorVP = vector(vp[connection - 1], box[0]);
        const vectorSum = [vectorVP[0] + vectorConn[0], vectorVP[1] + vectorConn[1]];
        console.log(vectorMagnitude(vectorVP), vectorMagnitude(vectorSum));
        // If the sum of the vectors from origin to vanishing point + vector 
        // from origin to cardinal point has a smaller magnitude then the magnitude
        // from origin to vp, the two vectors are in opposite directions
        valid = valid && (vectorMagnitude(vectorVP) < vectorMagnitude(vectorSum));
    } 

    return valid;
}