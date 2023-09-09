import React from "react";

import { addPoint, calculateVanishingPoints, 
    correctBoxPoints, backBoxConnections } from "../Utils/pointsOfBox.js";

export default function Canvas(props) {
    const canvasRef = React.useRef(null);

    const {width, height, showDrawnBox, showCorrectBox} = props;
    const initBox = [[Math.floor(width / 2), Math.floor(height / 2)], ...Array.from(7)];
    const [boxPoints, setBoxPoints] = React.useState(initBox);
    const [correctBP, setCorrectBP] = React.useState(initBox);
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

    const draw = (ctx) => {
        ctx.fillStyle = '#EEEEEE';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = "#000000";
        console.log(boxPoints);
        console.log(correctBP);
        if (showDrawnBox) drawBox(ctx, boxPoints, "black");
        if (showCorrectBox) drawBox(ctx, correctBP, "red");
        // drawBox(ctx, correctBP, "red");
        // drawBox(ctx, boxPoints, "black");
    }

    const handleCanvasClick = (event) => {
        const currentCoord = { x: event.clientX, y: event.clientY };
        const boundingRect = event.currentTarget.getBoundingClientRect();

        const relativeCoord = { x: currentCoord["x"] - boundingRect.left,
            y: currentCoord["y"] - boundingRect.top};

        setBoxPoints(addPoint(boxPoints, [relativeCoord.x, relativeCoord.y]));
        const cbp = correctBoxPoints(correctBP, vanishingPoints, [relativeCoord.x, relativeCoord.y]);
        setCorrectBP(cbp);
        setVanishingPoints(calculateVanishingPoints(cbp, vanishingPoints));
    }

    React.useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        
        draw(context)
    }, [boxPoints, correctBP, showDrawnBox, showCorrectBox]);

    return (
        <div>
            <canvas
                ref={canvasRef}
                width={width}
                height={height}
                onClick={handleCanvasClick}
            />
        </div>
    )
}