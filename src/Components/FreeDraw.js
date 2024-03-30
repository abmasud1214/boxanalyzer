import React from "react";
import Canvas from "./canvas";
import { lengthDefined } from "../Utils/pointsofbox";

export default function FreeDraw(props) {
    const [width, height] = [400, 400]; 

    const [boxType, setBoxType] = React.useState("DrawnBox");
    const [extendedLines, setExtendedLines] = React.useState(false);

    
    const onChangeEvent = (evt) => {
        setBoxType(evt.target.value);
        // console.log(evt.target.value);
    }
    
    const initBox = [[Math.floor(width / 2), Math.floor(height / 2)], ...Array.from(7)]
    const [boxState, setBoxState] = React.useState({
        boxPoints: initBox,
        correctBP: initBox,
        vanishingPoints: [...Array.from(3)]
    })

    const setInfoHeader = (length) => {
        if (length <= 3) {
            return "Draw the Y of the box."
        } else if (length === 4) {
            return "Draw the first corner that connects to the Y of the box. \
            (This sets two of the vanishing points.)"
        } else if (length === 5) {
            return "Draw the second corner that connects to the Y of the box. \
            (One of these lines should connect to a vanishing point set earlier.)"
        } else if (length === 6) {
            return "Draw the final outside corner. (Both of these lines should \
                connect to the vanishing points set earlier.)"
        } else {
            return "Draw the final point in the back corner of the box."
        }
    }
    
    const updateBoxState = (stateType, newValue) => {
        setBoxState((prev) => ({
            ...prev,
            [stateType]: newValue
        }))
    }

    const resetBox = () => {
        setBoxState({
            boxPoints: initBox,
            correctBP: initBox,
            vanishingPoints: [...Array.from(3)],
        })
    }

    React.useEffect(() => {
        console.log(boxState);
    }, [boxState])

    React.useEffect(() => {
        console.log(extendedLines);
    }, [extendedLines]);

    return (
        <div>
            <h3>{setInfoHeader(lengthDefined(boxState.boxPoints))}</h3>
            <Canvas
                width={400}
                height={400}
                showDrawnBox={(boxType === "DrawnBox" || boxType === "BothBox")}
                showCorrectBox={(boxType === "CorrectBox" || boxType === "BothBox")}
                boxState={boxState}
                updateBoxState={updateBoxState}
                extendedLines={extendedLines}
            />
            <div onChange={onChangeEvent}>
                <input type="radio" value="DrawnBox" name="box" checked={boxType === "DrawnBox"} />
                <p>Show Drawn Box</p>
                <input type="radio" value="CorrectBox" name="box" checked={boxType === "CorrectBox"} />
                <p>Show Correct Box</p>
                <input type="radio" value="BothBox" name="box" checked={boxType === "BothBox"} />
                <p>Show Both Boxes</p>
            </div>
            <div onChange={(evt) => {setExtendedLines((prev)=>(!prev))}}>
                <input type="checkbox" value="ShowLines" name="extendedLines" checked={extendedLines} />
                <p>Show Extended Lines</p>
            </div>
            <button onClick={resetBox}>Reset</button>
        </div>
    )
}