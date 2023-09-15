import logo from './logo.svg';
import './App.css';
import React from "react";

import Canvas from './Components/canvas';
import FreeDraw from './Components/FreeDraw';

function App() {

    // const [boxType, setBoxType] = React.useState("DrawnBox");

    // const onChangeEvent = (evt) => {
    //     setBoxType(evt.target.value);
    //     // console.log(evt.target.value);
    // }

    return (
        <div className="App">
            <FreeDraw />
            {/* <Canvas
                width={400}
                height={400}
                showDrawnBox={(boxType === "DrawnBox" || boxType === "BothBox")}
                showCorrectBox={(boxType === "CorrectBox" || boxType === "BothBox")}
            />
            <div onChange={onChangeEvent}>
                <input type="radio" value="DrawnBox" name="box" checked={boxType === "DrawnBox"} />
                <p>Show Drawn Box</p>
                <input type="radio" value="CorrectBox" name="box" checked={boxType === "CorrectBox"} />
                <p>Show Correct Box</p>
                <input type="radio" value="BothBox" name="box" checked={boxType === "BothBox"} />
                <p>Show Both Boxes</p>
            </div> */}
        </div>
    );
}

export default App;
