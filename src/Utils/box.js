import { addPoint as pob_AddPoint, 
    correctBoxPoints as pob_CorrectBoxPoints,
    calculateVanishingPoints as pob_VanishingPoints } from "./pointsofbox";

import { rotateVector } from "./geometryFunctions";

const initializeBox = (originPoint, scale, fixed, rotation) => {
    const initBox = [...Array.from({length: 8})];

    // normalized origin from center of frame
    // width and height flipped if rotated 90 degrees
    const [width, height] = (rotation % Math.PI === 0) ? scale : [scale[1], scale[0]];
    const [x, y] = originPoint;

    const scaledX = (x / width) - 0.5;
    const scaledY = (y / height) - 0.5;

    // point set where rotation = 0
    const pointNoRotation = rotateVector([scaledX, scaledY], -1 * rotation);
    
    return {
        actualBox: pob_AddPoint(initBox, pointNoRotation),
        correctBox: pob_AddPoint(initBox, pointNoRotation),
        vanishingPoints: [...Array.from(3)],
        fixed: fixed,
        originalScale: scale
    }
}

const addPoint = (box, newPoint, scale, rotation) => {
    
    const [x, y] = newPoint;
    const [width, height] = (rotation % Math.PI === 0) ? scale : [scale[1], scale[0]];
    const [initW, initH] = box.fixed ? box.originalScale : [width, height];
    
    // new point to correct position:
    const newPointNormalized = [(x - width / 2) / initW, (y - height / 2) / initH];
    const npNoRotation = rotateVector(newPointNormalized, -rotation);    
    const newBP = pob_AddPoint(box.actualBox, npNoRotation);
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

    const center = rotateVector([width / 2, height / 2], rotation).map(Math.abs);

    const scaledBP = box.actualBox.map((p) => p ? [p[0] * sW, p[1] * sH] : undefined);
    const scaledCBP = box.correctBox.map((p) => p ? [p[0] * sW, p[1] * sH] : undefined);  

    const rotatedBP = scaledBP.map((p) => p ? rotateVector(p, rotation) : undefined);
    const rotatedCBP = scaledCBP.map((p) => p ? rotateVector(p, rotation) : undefined);
    
    // translate points relative to top left coordinate
    const translatedBP = rotatedBP.map((p) => p ? [p[0] + center[0], p[1] + center[1]] : undefined);
    const translatedCBP = rotatedCBP.map((p) => p ? [p[0] + center[0], p[1] + center[1]] : undefined);
    
    return {
        ...box,
        actualBox: translatedBP,
        correctBox: translatedCBP,
    }    
}

export {initializeBox, addPoint, renderBox};