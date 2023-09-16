import React from "react";
import Canvas from "./canvas";

export default function FreeDraw(props) {
    const [width, height] = [400, 400]; 

    const [boxType, setBoxType] = React.useState("DrawnBox");

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

    return (
        <div>
            <Canvas
                width={400}
                height={400}
                showDrawnBox={(boxType === "DrawnBox" || boxType === "BothBox")}
                showCorrectBox={(boxType === "CorrectBox" || boxType === "BothBox")}
                boxState={boxState}
                updateBoxState={updateBoxState}
            />
            <div onChange={onChangeEvent}>
                <input type="radio" value="DrawnBox" name="box" checked={boxType === "DrawnBox"} />
                <p>Show Drawn Box</p>
                <input type="radio" value="CorrectBox" name="box" checked={boxType === "CorrectBox"} />
                <p>Show Correct Box</p>
                <input type="radio" value="BothBox" name="box" checked={boxType === "BothBox"} />
                <p>Show Both Boxes</p>
            </div>
            <button onClick={resetBox}>Reset</button>
        </div>
    )
}