import { intersectSegments, doesIntersect, 
    angleBetweenVectors, angleFromXAxis } from "../pointsofbox";

test('intersect_segments segments end at same point', () => {
    expect(intersectSegments([0, 3], [3, 6], [2, 4], [3, 6])).toStrictEqual([3, 6]);
})

test('intersect_segments start at same point', () => {
    expect(intersectSegments([0, 3], [3, 6], [0, 3], [7, 2])).toStrictEqual([0, 3]);
})

test('intersect_segments intersect at some other point', () => {
    expect(intersectSegments([0, 0], [4, 4], [1, 2], [3, 3.5])).toStrictEqual([5, 5]);
})

test('intersect_segments return [NaN, NaN] if parallel', () => {
    expect(intersectSegments([0, 0], [4, 4], [1, 2], [4, 5])).toStrictEqual([NaN, NaN]);
})

test('intersect_segments return [NaN, NaN] if overlapping lines', () => {
    expect(intersectSegments([0, 0], [4, 4], [1, 1], [3, 3])).toStrictEqual([NaN, NaN]);
})

test('doesIntersect return false if parallel', () => {
    expect(doesIntersect([0, 0], [4, 4], [1, 2], [4, 5])).toBe(false);
})

test('doesIntersect return false if overlapping', () => {
    expect(doesIntersect([0, 0], [4, 4], [1, 1], [3, 3])).toBe(false);
})

test('doesIntersect return true if intersect', () => {
    expect(doesIntersect([0, 0], [4, 4], [1, 5], [3, 3])).toBe(true);
})