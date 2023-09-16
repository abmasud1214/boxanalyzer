import { addPoint, calculateVanishingPoints, lengthDefined, correctBoxPoints,
    validPoint } from "../pointsofbox";

test("addPoint: insert point to empty box", () => {
    let box = Array(8);
    expect(addPoint(box, [0, 0])).toStrictEqual([[0, 0], ...Array(7)]);
})

test("addPoint: insert first segment", () => {
    let box = [[0, 0], ...Array(7)];
    expect(addPoint(box, [1, 1])).toStrictEqual([[0, 0], [1, 1], ...Array(6)]);
})

test("addPoint: insert second segment", () => {
    let box = [[0, 0], [1, 1], ...Array(6)];
    let expectedBox = [[0, 0], [1, 1], [-1, 0], ...Array(5)];
    expect(addPoint(box, [-1, 0])).toStrictEqual(expectedBox);
})

test("addPoint: insert third segment", () => {
    let box = [[0, 0], [1, 1], ...Array(6)];
    let expectedBox = [[0, 0], [1, 1], undefined, [0, -1], ...Array(4)]
    expect(addPoint(box, [0, -1])).toStrictEqual(expectedBox);
})

test("addPoint: insert second and third segment", () => {
    let box = [[0, 0], [1, 1], ...Array(6)];
    let expectedBox = [[0, 0], [1, 1], [-1, 0], [0, -1], ...Array(4)];
    expect(addPoint(addPoint(box, [-1, 0]), [0, -1])).toStrictEqual(expectedBox);
})

test("addPoint: insert fourth segment", () => {
    let box = [[0, 0], [1, 1], [-1, 0], [0, -1], ...Array(4)];
    let expectedBox = [...box]
    expectedBox[4] = [0, 1];
    expect(addPoint(box, [0, 1])).toStrictEqual(expectedBox);
})

test("addPoint: insert sixth segment", () => {
    let box = [[0, 0], [1, 1], [-1, 0], [0, -1], ...Array(4)];
    let expectedBox = [...box]
    expectedBox[6] = [1, 0];
    expect(addPoint(box, [1, 0])).toStrictEqual(expectedBox);
})

test("addPoint: insert fourth, fifth, sixth segment", () => {
    let box = [[0, 0], [1, 1], [-1, 0], [0, -1], ...Array(4)];
    let expectedBox = [...box];
    expectedBox[4] = [0, 1];
    expectedBox[5] = [-1, -1];
    expectedBox[6] = [1, 0];
    let output = addPoint(addPoint(addPoint(box, [-1, -1]), [0, 1]), [1, 0]);
    expect(output).toStrictEqual(expectedBox);
})

test("addPoint: final point", () => {
    let box = [[0, 0], [1, 1], [-1, 0], [0, -1], [0, 1], [-1, -1], [1, 0], undefined];
    let expectedBox = [...box];
    expectedBox[7] = [0.1, 0.1];
    expect(addPoint(box, [0.1, 0.1])).toStrictEqual(expectedBox);
})

/**
 * @todo Write test cases that actually validate if vanishing points are correct.
 */

test("vanishingPoints, check if two added on 5 points in box", () => {
    let box = [[0, 0], [1, 1], [-1, 0], [0.15, -1], [0.1, 0.6], ...Array(3)];
    let vp = [...Array(3)];
    // console.log(vanishingPoints(box, vp));
    expect(lengthDefined(calculateVanishingPoints(box, vp))).toBe(2);
})

test("vanishingPoints: check if two added on fifth point (pos 6)", () => {
    let box = [[0, 0], [1, 1], [-1, 0], [0.15, -1], ...Array(2), [0.4, -0.6], undefined];
    let vp = [...Array(3)];
    // console.log(vanishingPoints(box, vp));
    expect(lengthDefined(calculateVanishingPoints(box, vp))).toBe(2);   
})

test("vanishingPoints: 3 vp on 6 points", () => {
    let box = [[0, 0], [1, 1], [-1, 0], [0.15, -1], [0.1, 0.6], ...Array(3)];
    let vp = [...Array(3)];   
    vp = calculateVanishingPoints(box, vp);
    // console.log(vanishingPoints(box, vp));
    box[6] = [0.4, -0.6];
    // console.log(vanishingPoints(box, vp));
    expect(lengthDefined(calculateVanishingPoints(box, vp))).toBe(3);
})

test("correctBoxPoints: correct sixth point when added.", () => {
    let box = [[0, 0], [1, 1], [-1, 0], [0.15, -1], [0.1, 0.6], ...Array(3)];
    let vp = [...Array(3)];   
    vp = calculateVanishingPoints(box, vp);
    let newBox = correctBoxPoints(box, vp, [0.4, -0.6]);
    expect(newBox[6][0]).toBeCloseTo(0.616666666666);
    expect(newBox[6][1]).toBeCloseTo(-0.022222222222);
})

test("validPoint: true when second point and > 90deg.", () => {
    let box = [[0, 0], [0, 1], ...Array(6)];
    let point = [-1, -1];
    let valid = validPoint(box, point);
    expect(valid).toBe(true);
})

test("validPoint: false when second point and < 90deg.", () => {
    let box = [[0, 0], [0, 1], ...Array(6)];
    let point = [1, 1];
    let valid = validPoint(box, point);
    expect(valid).toBe(false);
})

test("validPoint: true when third point and > 90deg.", () => {
    let box = [[0, 0], [0, 1], [-0.1, 1], ...Array(5)];
    let point = [-1, -0.6];
    let valid = validPoint(box, point);
    expect(valid).toBe(true);
})

test("validPoint: false when third point and < 90deg.", () => {
    let box = [[0, 0], [0, 1], [-0.1, 1], ...Array(5)];
    let point = [-1, 0];
    let valid = validPoint(box, point);
    expect(valid).toBe(false);
})

/**
 * @todo Write test cases for validPoint 456 (test cases with math are hard :dead:.)
 */