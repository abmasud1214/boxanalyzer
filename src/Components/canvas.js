import React from "react";

import { addPoint, calculateVanishingPoints, 
    correctBoxPoints, backBoxConnections, validPoint,
    indexOfPoint, 
    snapPoint, lengthDefined} from "../Utils/pointsOfBox.js";

export default function Canvas(props) {
    const canvasRef = React.useRef(null);

    const {width, height, showDrawnBox, showCorrectBox} = props;
    const initBox = [[Math.floor(width / 2), Math.floor(height / 2)], ...Array.from(7)];
    const [boxPoints, setBoxPoints] = React.useState(initBox);
    const [correctBP, setCorrectBP] = React.useState(initBox);
    const [currentPoint, setCurrentPoint] = React.useState(null);
    const [vanishingPoints, setVanishingPoints] = React.useState(Array.from(3));

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
                    ctx.strokeStyle = style
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
        if (showDrawnBox) {
            drawBox(ctx, boxPoints, "black");
            currentPoint !== null && lengthDefined(boxPoints) < 8 && drawCurrentLine(ctx, boxPoints, "blue");
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
        
        const relativePoint = [relativeCoord.x, relativeCoord.y]
        
        const valid = validPoint(boxPoints, relativePoint);
        if (valid) {
            setCurrentPoint(relativePoint);
        } else if (indexOfPoint(boxPoints, relativePoint) >= 4 
            && indexOfPoint(boxPoints, relativePoint) < 7) {
            const snap = snapPoint(boxPoints, relativePoint);
            setCurrentPoint(snap); 
        }
    }

    const handleCanvasClick = (event) => {
        setBoxPoints(addPoint(boxPoints, currentPoint));
        const cbp = correctBoxPoints(correctBP, vanishingPoints, currentPoint);
        setCorrectBP(cbp);
        setVanishingPoints(calculateVanishingPoints(cbp, vanishingPoints));
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
        </div>
    )
}