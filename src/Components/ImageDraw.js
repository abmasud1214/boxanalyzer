import React from "react";
import Canvas from "./canvas";
import { lengthDefined, boxMSE } from "../Utils/pointsofbox";

import './ImageDraw.css'

export default function ImageDraw(props) {
    const [width, height] = [400, 400]; 

    const [boxType, setBoxType] = React.useState("DrawnBox");
    const [extendedLineOptions, setExtendedLineOptions] = React.useState({
        extendedDrawnLines: false, 
        extendedCorrectLines: false
    });

    const [imageFile, setImageFile] = React.useState(null);
    const [image, setImage] = React.useState(null);

    const [scale, setScale] = React.useState(400);
    const [rotation, setRotation] = React.useState(0);
  
    const onChangeEvent = (evt) => {
        setBoxType(evt.target.value);
        // console.log(evt.target.value);
    }
    
    const initBox = [...Array.from(8)]
    const [boxesState, setBoxesState] = React.useState([]);
    const [currentBoxIndexState, setCurrentBoxIndexState] = React.useState(0);
    const [boxState, setBoxState] = React.useState(null)

    const setInfoHeader = (length) => {
        if (length == 0) {
            return "Draw the first point of the box."
        }
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
    
    const updateBoxState = (newValue) => {
        setBoxState(newValue)
        setBoxesState((prev) => {
            const newstate = [...prev];
            newstate[currentBoxIndexState] = newValue;
            return newstate;
        })
    }

    const resetBox = () => {
        setBoxState(null)
        setBoxesState((prev) => {
            const newstate = [...prev];
            newstate[currentBoxIndexState] = null;
            return newstate;
        })
        setBoxType("DrawnBox")
        setExtendedLineOptions({
            extendedDrawnLines: false,
            extendedCorrectLines: false
        })
    }
    
    const clearBoxes = () => {
        setBoxesState([null]);
        setBoxState(null);
        setCurrentBoxIndexState(0);
        setBoxType("DrawnBox")
        setExtendedLineOptions({
            extendedDrawnLines: false,
            extendedCorrectLines: false
        })
    }
    
    const addBox = () => {
        setBoxState(null);
        const prevBoxesState = [...boxesState];
        setBoxesState((prev) => {
            const newstate = [...prev];
            newstate[prev.length] = null;
            return newstate;
        })
        setCurrentBoxIndexState(prevBoxesState.length);
        setBoxType("DrawnBox")
        setExtendedLineOptions({
            extendedDrawnLines: false,
            extendedCorrectLines: false
        })
    }

    const changeBoxIndex = (i) => {
        if (i >= 0 && i < boxesState.length) {
            setCurrentBoxIndexState(i); 
            setBoxState(boxesState[i]);
        }
    }

    const onImageUpdate = (event) => {
        setScale(750);
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setImageFile(file);
        } else {
            console.error("Invalid file type. Please select an image file.");
        }
    }

    const capImageWidth = (image, maxWidth) => {
        const originalWidth = image.width;
        const originalHeight = image.height;
        const aspectRatio = originalWidth / originalHeight;

        let newWidth;
        let newHeight;

        if (width > height) {
            newWidth = Math.min(originalWidth, maxWidth);
            newHeight = newWidth / aspectRatio;
        } else {
            newHeight = Math.min(originalHeight, maxWidth);
            newWidth = newHeight * aspectRatio;
        }

        return [newWidth, newHeight];
    }

    const onExtendedLinesUpdate = (e) => {
        const {name, checked} = e.target;
        setExtendedLineOptions({
            ...extendedLineOptions,
            [name]: checked,
        });
    };

    const onScaleChangeEvent = (e) => {
        const {value} = e.target;
        setScale(parseInt(value, 10))
    }

    const clearImage = (e) => {
        setImageFile(null);
        setImage(null);
        resetBox();
    }

    const updateRotation = (dir) => {
        setRotation(prev => (prev + dir * Math.PI / 2) % (2 * Math.PI));
    }

    React.useEffect(() => {
        var img = new Image();
        img.onload = () => {
            console.log("Image loaded successfully");
            setImage(img);
            console.log("Image Details: ", imageFile, ",", img.width, "px ", img.height, "px")
        };
        img.onerror = () => {
            console.log("Failed to load image");
        };
        if (imageFile) img.src = URL.createObjectURL(imageFile);
        return () => {
            if (img) {
                img.onload = null;
                img.onerror = null;
                URL.revokeObjectURL(img.src);
            }
        }
    }, [imageFile])

    // React.useEffect(() => {
    //     console.log(boxState);
    // }, [boxState])

    // React.useEffect(() => {
    //     console.log(extendedLines);
    // }, [extendedLines]);

    return (
        <div className="imageDraw">
            <h3>{setInfoHeader(boxState ? lengthDefined(boxState.actualBox) : 0)}</h3>
            {!imageFile && <Canvas
                width={scale}
                height={scale}
                rotation={rotation}
                fixed={true}
                showDrawnBox={(boxType === "DrawnBox" || boxType === "BothBox")}
                showCorrectBox={(boxType === "CorrectBox" || boxType === "BothBox")}
                boxState={boxState}
                updateBoxState={updateBoxState}
                extendedLineOptions={extendedLineOptions}
            />}
            {imageFile && image && <Canvas 
                width = {capImageWidth(image, scale)[0]}
                height = {capImageWidth(image, scale)[1]}
                rotation = {rotation}
                fixed = {false}
                showDrawnBox={(boxType === "DrawnBox" || boxType === "BothBox")}
                showCorrectBox={(boxType === "CorrectBox" || boxType === "BothBox")}
                boxState={boxState}
                updateBoxState={updateBoxState}
                extendedLineOptions={extendedLineOptions}
                image = {image}
            />}
            {/* {lengthDefined(boxState.boxPoints) === 8 && <p>{boxMSE(boxState.boxPoints, boxState.correctBP)}</p>} */}
            <button className="resetButton" onClick={resetBox}>Reset Box</button>
            <button className="newBoxButton" onClick={clearBoxes}>Clear All Boxes</button>
            <button className="addBoxButton" onClick={addBox}>New Boxes</button>
            <button 
                className="prevBoxButton" 
                onClick={()=>changeBoxIndex(currentBoxIndexState-1)}
                disabled={currentBoxIndexState === 0}>{"<"}</button>
            <button 
                className="nextBoxButton" 
                onClick={()=>changeBoxIndex(currentBoxIndexState+1)}
                disabled={currentBoxIndexState === boxesState.length - 1}>{">"}</button>
            <div className="boxDisplayMenus">
                <h5>Box Display Options</h5>
                <div>
                    <div className="showBoxMenu" onChange={onChangeEvent}>
                        <input type="radio" value="DrawnBox" name="box" checked={boxType === "DrawnBox"} />
                        <p>Show Drawn Box</p>
                        <input type="radio" value="CorrectBox" name="box" checked={boxType === "CorrectBox"} />
                        <p>Show Correct Box</p>
                        <input type="radio" value="BothBox" name="box" checked={boxType === "BothBox"} />
                        <p>Show Both Boxes</p>
                    </div>
                    <div className="extendedLinesMenu">
                        <input type="checkbox" 
                            name="extendedDrawnLines"
                            checked={extendedLineOptions.extendedDrawnLines} 
                            onChange={onExtendedLinesUpdate} />
                        <p>Show Extended Lines</p>
                        <input type="checkbox" 
                            name="extendedCorrectLines"
                            checked={extendedLineOptions.extendedCorrectLines} 
                            onChange={onExtendedLinesUpdate} />
                        <p>Show Correct Box Lines</p>
                    </div>
                </div>
            </div>
            <div>
                <div className="scaleMenu">
                    <input 
                        type="range" 
                        min={400} 
                        max={2000} 
                        name="scale"
                        value={scale}
                        onChange={onScaleChangeEvent}
                    />
                </div>
                <button
                    className="rotateButton"
                    onClick={() => updateRotation(-1)}
                >
                    rotate left
                </button>
                <button
                    className="rotateButton"
                    onClick={() => updateRotation(1)}
                    >
                    rotate right
                </button>
            </div>
            <div className="imageOptions">
                <div className="imageUpload">
                    <h5>Upload an image</h5>
                    <input type="file" onChange={onImageUpdate}/>
                </div>
                <button className="clearButton" onClick={clearImage}>Clear Image</button>
            </div>
        </div>
    )
}