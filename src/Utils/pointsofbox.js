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
    if (boxPoints[0] === undefined) {
        newBoxPoints[0] = newPoint;
    } else if (boxPoints[1] === undefined) {
        newBoxPoints[1] = newPoint;
    } else if (boxPoints[2] === undefined || boxPoints[3] === undefined) {
        newBoxPoints[point2or3(boxPoints, newPoint)] = newPoint;
    } else if (boxPoints[4] === undefined || 
        boxPoints[5] === undefined || 
        boxPoints[6] === undefined) {
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