import React from "react";

import { addPoint, calculateVanishingPoints, 
    correctBoxPoints } from "../Utils/pointsOfBox.js";

export default function Canvas(props) {
    const canvasRef = React.useRef(null);

    const {width, height} = props;
    const initBox = [[Math.floor(width / 2), Math.floor(height / 2)], ...Array.from(7)];
    const [boxPoints, setBoxPoints] = React.useState(initBox);
    const [correctBP, setCorrectBP] = React.useState(initBox);
    const [vanishingPoints, setVanishingPoints] = React.useState(Array.from(3));

    const draw = (ctx) => {
        ctx.fillStyle = '#EEEEEE';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = "#000000";
        console.log(boxPoints);
        console.log(correctBP);
        for (const point of boxPoints) {
            if (point !== undefined) {
                ctx.beginPath();
                ctx.arc(point[0], point[1], 3, 0, 2 * Math.PI);
                ctx.fill();
            }
        }
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
    }, [boxPoints, correctBP]);

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