import React from "react";

import { addPoint, calculateVanishingPoints, 
    correctBoxPoints, backBoxConnections, validPoint,
    indexOfPoint, 
    snapPoint, lengthDefined, boxMSE} from "../Utils/pointsofbox.js";

export default function Canvas(props) {
    const canvasRef = React.useRef(null);

    const {width, height, 
        showDrawnBox, showCorrectBox, 
        boxState, updateBoxState} = props;
    const initBox = [[Math.floor(width / 2), Math.floor(height / 2)], ...Array.from(7)];
    const boxPoints = boxState["boxPoints"]
    const correctBP = boxState["correctBP"]
    const vanishingPoints = boxState["vanishingPoints"]
    const [currentPoint, setCurrentPoint] = React.useState(null)
    const [boxPointStyle, setBoxPointStyle] = React.useState(Array.from(8));

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
                for (const connection of backBoxConnections[i]) {
                    const connectionPoint = box[connection];
                    ctx.beginPath();
                    ctx.moveTo(box[i][0], box[i][1]);
                    ctx.lineTo(connectionPoint[0], connectionPoint[1]);
                    ctx.lineWidth = style === "boxPointStyle" ? 3 : 1;
                    ctx.strokeStyle = style === "boxPointStyle" ? boxPointStyle[i] : style; 
                    ctx.stroke();
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

    const draw = (ctx) => {
        ctx.fillStyle = '#EEEEEE';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = "#000000";
        // console.log(boxPoints);
        // console.log(correctBP);
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

        // drawBox(ctx, correctBP, "red");
        // drawBox(ctx, boxPoints, "black");
    }

    const handlePointerMove = (event) => {
        const currentCoord = { x: event.clientX, y: event.clientY };
        const boundingRect = event.currentTarget.getBoundingClientRect();

        const relativeCoord = { x: currentCoord["x"] - boundingRect.left,
            y: currentCoord["y"] - boundingRect.top}; 
        
        const relativePoint = [relativeCoord.x, relativeCoord.y];
        
        const valid = validPoint(boxPoints, relativePoint);

        const idx = indexOfPoint(boxPoints, relativePoint);
        if (valid) {
            setCurrentPoint(relativePoint);
        } else if (boxPoints[idx] === undefined && idx >= 4 && idx < 7) {
            const snap = snapPoint(boxPoints, relativePoint);
            setCurrentPoint(snap); 
        }
    }

    const handleCanvasClick = (event) => {
        const newBP = addPoint(boxPoints, currentPoint)
        setBoxPointStyle((prev) => {
            const ld = lengthDefined(newBP);
            const newStyles = [...prev]
            let idx = indexOfPoint(boxPoints, currentPoint)
            let style = "red"
            if (ld <= 5) {
                style = "red"
            } else if (ld === 6) {
                style = "#e89f00"
            } else {
                style = "#722f91"
            }
            newStyles[idx] = style 
            return newStyles;
        })
        updateBoxState("boxPoints", newBP);
        console.log(newBP);
        // setBoxPoints(newBP);
        const cbp = correctBoxPoints(correctBP, vanishingPoints, currentPoint);
        updateBoxState("correctBP", cbp);
        updateBoxState("vanishingPoints", calculateVanishingPoints(cbp, vanishingPoints));
        // setCorrectBP(cbp);
        // setVanishingPoints(calculateVanishingPoints(cbp, vanishingPoints));
        setCurrentPoint(null);
    }

    React.useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        
        draw(context)
    }, [boxPoints, correctBP, showDrawnBox, showCorrectBox, currentPoint]);
    
    return (
        <div>
            <canvas
                ref={canvasRef}
                width={width}
                height={height}
                onClick={handleCanvasClick}
                onPointerMove={handlePointerMove}
            />
            {lengthDefined(boxPoints) === 8 && <p>{boxMSE(boxPoints, correctBP)}</p>}
        </div>
    )
}