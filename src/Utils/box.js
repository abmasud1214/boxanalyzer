import { addPoint as pob_AddPoint, 
    correctBoxPoints as pob_CorrectBoxPoints,
    calculateVanishingPoints as pob_VanishingPoints } from "./pointsofbox";

import { rotateVector } from "./geometryFunctions";


const initializeBox = (originPoint, scale, fixed, rotation) => {
    const initBox = [...Array.from(8)];

    // normalized origin from center of frame
    // console.log("initBox");
    const [width, height] = scale;
    const [x, y] = originPoint;

    const scaledX = (x / width) - 0.5;
    const scaledY = (y / height) - 0.5;

    // console.log("initBox original", x, " ", y)
    // console.log("width height", scale);
    
    const pointNoRotation = rotateVector([scaledX, scaledY], -1 * rotation);
    // console.log("initBox transformed", pointNoRotation);
    
    return {
        actualBox: pob_AddPoint(initBox, pointNoRotation),
        correctBox: pob_AddPoint(initBox, pointNoRotation),
        vanishingPoints: [...Array.from(3)],
        fixed: fixed,
        originalScale: scale
    }
}

const addPoint = (box, newPoint, scale, rotation) => {
    
    // new point to correct position:
    const [x, y] = newPoint;
    const [width, height] = scale;
    const [initW, initH] = box.fixed ? box.originalScale : scale;
    const newPointNormalized = [(x - width / 2) / initW, (y - height / 2) / initH];
    const npNoRotation = rotateVector(newPointNormalized, -1 * rotation);    
    const newBP = pob_AddPoint(box.actualBox, npNoRotation);
    // console.log(box.vanishingPoints);
    const newCBP = pob_CorrectBoxPoints(box.correctBox, 
        box.vanishingPoints, npNoRotation);
    const newVP = pob_VanishingPoints(newCBP, box.vanishingPoints);

    return {
        ...box,
        actualBox: newBP,
        correctBox: newCBP,
        vanishingPoints: newVP
    }
}

const renderBox = (box, scale, rotation) => {

    const [width, height] = scale;
    const [sW, sH] = box.fixed ? box.originalScale : scale;    
    const scaledBP = box.actualBox.map((p) => [p[0] * sW, p[1] * sH]);
    const scaledCBP = box.correctBox.map((p) => [p[0] * sW, p[1] * sH]);  
    const rotatedBP = scaledBP.map((p) => rotateVector(p, rotation));
    const rotatedCBP = scaledCBP.map((p) => rotateVector(p, rotation));
    const center = rotateVector([width / 2, height / 2], rotation).map(Math.abs);
    
    const translatedBP = rotatedBP.map((p) => [p[0] + center[0], p[1] + center[1]]);
    const translatedCBP = rotatedCBP.map((p) => [p[0] + center[0], p[1] + center[1]]);
    
    return {
        ...box,
        actualBox: translatedBP,
        correctBox: translatedCBP,
    }    
}

export {initializeBox, addPoint, renderBox};