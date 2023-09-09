import React from "react";

// import { addPoint, correctBoxPoints } from "../Utils/pointsOfBox.js";

export default function Canvas(props) {
    const canvasRef = React.useRef(null);

    const {width, height} = props;
    const initBox = [[Math.floor(width / 2), Math.floor(height / 2)], ...Array.from(7)];
    const [boxPoints, setBoxPoints] = React.useState(initBox);
    const [correctBP, setCorrectBP] = React.useState(initBox);

    const draw = (ctx) => {
        ctx.fillStyle = '#EEEEEE';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = "#000000";
        for (const point of boxPoints) {
            if (point !== undefined) {
                ctx.beginPath();
                ctx.arc(point[0], point[1], 3, 0, 2 * Math.PI);
                ctx.fill();
            }
        }
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
            />
        </div>
    )
}