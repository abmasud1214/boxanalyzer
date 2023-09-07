import { addPoint } from "../pointsofbox";

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