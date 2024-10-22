import React from "react";

import { backBoxConnections, validPoint,
    indexOfPoint, 
    snapPoint, lengthDefined} from "../Utils/pointsofbox.js";
import { extendLinePoint, rotateVector} from "../Utils/geometryFunctions.js"
import { initializeBox, addPoint as box_AddPoint, renderBox } from "../Utils/box.js";


export default function Canvas(props) {
    const canvasRef = React.useRef(null);

    const {width, height, rotation, fixed,
        opacity, boxOpacity, showDrawnBox, showCorrectBox, 
        boxState, updateBoxState, extendedLineOptions, image} = props;

    const [canvasWidth, canvasHeight] = rotateVector([width, height], rotation).map(Math.abs);
    
    const renderedBox = boxState === null ? null : renderBox(boxState, [width, height], rotation);
    
    const boxPoints = boxState === null ? [...Array.from(8)] : renderedBox["actualBox"] 
    const correctBP = boxState === null ? null : renderedBox["correctBox"]
    // const vanishingPoints = boxState["vanishingPoints"]
    const [currentPoint, setCurrentPoint] = React.useState(null)

    const drawBox = (ctx, box, style) => {
        ctx.fillStyle = style;
        for (const point of box) {
            if (point !== undefined) {
                ctx.beginPath();
                ctx.arc(point[0], point[1], 3, 0, 2 * Math.PI);
                ctx.fill();
            }
        }

        for (let i = 0; i < box.length; i++) {
            if (box[i] !== undefined) {
                const order = boxState.orderAdd[i];
                let strokeStyle = "red";
                if (order === 6) {
                    strokeStyle = "#e89f00";
                } else if (order > 6) {
                    strokeStyle = "#722f91";
                }
                for (const connection of backBoxConnections[i]) {
                    const connectionPoint = box[connection];
                    ctx.beginPath();
                    ctx.moveTo(box[i][0], box[i][1]);
                    ctx.lineTo(connectionPoint[0], connectionPoint[1]);
                    ctx.lineWidth = style === "boxPointStyle" ? 3 : 1;
                    ctx.strokeStyle = style === "boxPointStyle" ? strokeStyle : style;
                    ctx.globalAlpha = style === "boxPointStyle" ? boxOpacity / 100 : 1; 
                    ctx.stroke();
                    ctx.globalAlpha = 1; 
                }
            }
        }
    }
    
    const drawCurrentLine = (ctx, box, style) => {
        const idx = indexOfPoint(box, currentPoint);
        for (const connection of backBoxConnections[idx]) {
            const connectionPoint = box[connection];
            ctx.beginPath();
            ctx.moveTo(currentPoint[0], currentPoint[1]);
            ctx.lineTo(connectionPoint[0], connectionPoint[1]);
            ctx.strokeStyle = style;
            ctx.stroke();
        }
    }
    
    const drawExtendedLines = (ctx, box, style) => {
        for (let i = 0; i < box.length; i++) {
            if (box[i] !== undefined) {
                for (const connection of backBoxConnections[i]) {
                    const connectionPoint = box[connection];
                    const p2 = extendLinePoint(connectionPoint, box[i]);
                    ctx.beginPath();
                    ctx.moveTo(box[i][0], box[i][1])
                    ctx.lineTo(p2[0], p2[1]);
                    ctx.lineWidth = 1;
                    ctx.setLineDash([5, 5]);
                    ctx.strokeStyle = style;
                    ctx.stroke();
                    ctx.setLineDash([]);
                }
            }
        }
    }

    const draw = (ctx) => {
        ctx.fillStyle = '#EEEEEE';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.fillStyle = "#000000";

        if (image) {
            ctx.translate(canvasWidth / 2, canvasHeight / 2);
            ctx.rotate(rotation);
            ctx.globalAlpha = opacity / 100;
            ctx.drawImage(image, -width / 2, -height / 2, width, height);
            ctx.globalAlpha = 1;
            ctx.rotate(-1 * rotation);
            ctx.translate(-canvasWidth / 2, -canvasHeight / 2)

        }
        if (boxState !== null) {
            const cardinalStyle = "red";
            const semiDefinedStyle = "#e89f00";
            const fixedStyle = "#722f91";
            let boxStyle = cardinalStyle;
            if (lengthDefined(boxPoints) <= 4) {
                boxStyle = cardinalStyle;
            } else if (lengthDefined(boxPoints) === 5) {
                boxStyle = semiDefinedStyle;
            } else {
                boxStyle = fixedStyle;
            }
            if (showDrawnBox) {
                drawBox(ctx, boxPoints, "boxPointStyle");
                currentPoint !== null && lengthDefined(boxPoints) < 8 && drawCurrentLine(ctx, boxPoints, boxStyle);
            }
            if (showCorrectBox) drawBox(ctx, correctBP, "red");
            if (extendedLineOptions.extendedDrawnLines) drawExtendedLines(ctx, boxPoints, "green");
            if (extendedLineOptions.extendedCorrectLines) drawExtendedLines(ctx, correctBP, "red");
        }

        // drawBox(ctx, correctBP, "red");
        // drawBox(ctx, boxPoints, "black");
    }

    const calcCurrentPoint = (event) => {
        let current = null;
        const currentCoord = { x: event.clientX, y: event.clientY };
        const boundingRect = event.currentTarget.getBoundingClientRect();
    
        const relativeCoord = { x: currentCoord["x"] - boundingRect.left,
            y: currentCoord["y"] - boundingRect.top}; 
        
        const relativePoint = [relativeCoord.x, relativeCoord.y];
        
        const valid = validPoint(boxPoints, relativePoint);
    
        const idx = indexOfPoint(boxPoints, relativePoint);
        if (valid) {
            return relativePoint;
        } else if (boxPoints[idx] === undefined && idx >= 4 && idx < 7) {
            const snap = snapPoint(boxPoints, relativePoint);
            return snap; 
        } else {
            return null;
        }
    }

    const handlePointerMove = (event) => {
        setCurrentPoint(calcCurrentPoint(event));
    }

    const handlePointerLeave = (event) => {
        setCurrentPoint(null);
    }

    const handleCanvasClick = (event) => {
        const clickPoint = calcCurrentPoint(event);
        if (clickPoint){
            if (boxState === null) {
                const initBoxState = initializeBox(clickPoint, 
                    [width, height], fixed, rotation);
                updateBoxState(initBoxState);
            } else {
                const newBoxState = box_AddPoint(boxState, 
                    clickPoint, [width, height], rotation);
                updateBoxState(newBoxState);
            }
        }

        setCurrentPoint(null);
    }

    React.useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        
        draw(context)
    }, [boxPoints, correctBP, showDrawnBox, showCorrectBox, currentPoint,
            extendedLineOptions, opacity, boxOpacity]);
    
    return (
        <div>
            <canvas
                ref={canvasRef}
                width={canvasWidth}
                height={canvasHeight}
                onClick={handleCanvasClick}
                onPointerMove={handlePointerMove}
                onPointerLeave={handlePointerLeave}
            />
        </div>
    )
}