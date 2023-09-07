import { intersectSegments, doesIntersect, 
    angleBetweenVectors, angleFromXAxis,
    betweenTwoAngles, ccw, vector } from "./geometryFunctions";

// 0 : center
// 1 - 3 : first through third segment going counterclockwise
// 4 : point between first and second segment
// 5 : point between second and third
// 6 : point between third and first
// 7 : back corner

export function addPoint(boxPoints, newPoint) {
    let newBoxPoints = [...boxPoints];
    if (lengthDefined(boxPoints) === 0) {
        newBoxPoints[0] = newPoint;
    } else if (lengthDefined(boxPoints) === 1) {
        newBoxPoints[1] = newPoint;
    } else if (lengthDefined(boxPoints) < 4) {
        newBoxPoints[point2or3(boxPoints, newPoint)] = newPoint;
    } else if (lengthDefined(boxPoints) < 7) {
        newBoxPoints[point456(boxPoints, newPoint)] = newPoint;
    } else {
        newBoxPoints[7] = newPoint;
    }

    return newBoxPoints;
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

function lengthDefined(arr) {
    return arr.reduce((prev, c) => prev + (c === undefined ? 0 : 1), 0);
}

function vpFromIdx(boxPoints, idx1, idx2, idx3) {
    let origin = boxPoints[0];
    let point1 = boxPoints[idx1];
    let point2 = boxPoints[idx2];
    let pointV = boxPoints[idx3];
    let vp1 = intersectSegments(origin, point1, point2, pointV);
    let vp2 = intersectSegments(origin, point2, point1, pointV);
    return [vp1, vp2];
}

export function vanishingPoints(boxPoints, vp) {
    let newVanishingPoints = [...vp];
    // When a vanishing point is set, that is the defined vp and will never be replaced.
    // When the first "exterior" segment is added (l == 5), 
    // two of the vps are set. When the second segment is added (l == 6),
    // the third vp is set. Only the third will be set, since the other two 
    // can't be overwritten.
    if (lengthDefined(boxPoints) === 5 || lengthDefined(boxPoints) === 6) {
        if (boxPoints[4] !== undefined) {
            let vp1, vp2 = vpFromIdx(boxPoints, 1, 2, 4);
            newVanishingPoints[0] = vp[0] ? vp[0] : vp1;
            newVanishingPoints[1] = vp[1] ? vp[1] : vp2;
        }
        if (boxPoints[5] !== undefined) {
            let vp1, vp2 = vpFromIdx(boxPoints, 2, 3, 5);
            newVanishingPoints[1] = vp[1] ? vp[1] : vp1;
            newVanishingPoints[2] = vp[2] ? vp[2] : vp2;
        } 
        if (boxPoints[6] !== undefined) {
            let vp1, vp2 = vpFromIdx(boxPoints, 1, 3, 6);
            newVanishingPoints[0] = vp[0] ? vp[0] : vp1;
            newVanishingPoints[2] = vp[0] ? vp[0] : vp2;
        }
    }
    return newVanishingPoints;
}