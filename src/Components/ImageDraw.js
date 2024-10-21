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

    const [settings, setSettings] = React.useState(true);
  
    const onChangeEvent = (evt) => {
        setBoxType(evt.target.value);
        // console.log(evt.target.value);
    }
    
    const [boxesState, setBoxesState] = React.useState([]);
    const [currentBoxIndexState, setCurrentBoxIndexState] = React.useState(0);
    const [boxState, setBoxState] = React.useState(null)

    const setInfoHeader = (length) => {
        if (length === 0) {
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
        } else if (length === 7) {
            return "Draw the final point in the back corner of the box."
        } else {
            return "Mean Squared Error: " + (boxMSE(boxState.actualBox, boxState.correctBox) * 100000).toFixed(2) +
                " (lower is better)";
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

    const capImageWidth = (image, scale) => {
        const originalWidth = image.width;
        const originalHeight = image.height;
        const aspectRatio = originalWidth / originalHeight;

        let newWidth;
        let newHeight;

        if (width > height) {
            newWidth = scale;
            newHeight = newWidth / aspectRatio;
        } else {
            newHeight = scale;
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

    const scaleStyle = () => {
        if (imageFile && image) {
            const [w, h] = capImageWidth(image, scale);
            console.log(w, h);
            const width = (rotation % Math.PI === 0) ? w : h;
            if (width > window.innerWidth){
                return {
                    alignSelf: "flex-start",
                }
            } else {
                return {}
            }
        } else if (scale > window.innerWidth) {
            return {
                alignSelf: "flex-start",
            }
        } else {
            return {}
        }
    }

    // React.useEffect(() => {
    //     console.log(boxState);
    // }, [boxState])

    // React.useEffect(() => {
    //     console.log(extendedLines);
    // }, [extendedLines]);

    return (
        <div className="imageDrawPage">
            <div className="settings">
                <svg width="32" height="32" viewBox="0 0 1024 1024" onClick={() => setSettings(prev => !prev)}>
                    <path d="M933.79 610.25c-53.726-93.054-21.416-212.304 72.152-266.488l-100.626-174.292c-28.75 16.854-62.176 26.518-97.846 26.518-107.536 0-194.708-87.746-194.708-195.99h-201.258c0.266 33.41-8.074 67.282-25.958 98.252-53.724 93.056-173.156 124.702-266.862 70.758l-100.624 174.292c28.97 16.472 54.050 40.588 71.886 71.478 53.638 92.908 21.512 211.92-71.708 266.224l100.626 174.292c28.65-16.696 61.916-26.254 97.4-26.254 107.196 0 194.144 87.192 194.7 194.958h201.254c-0.086-33.074 8.272-66.57 25.966-97.218 53.636-92.906 172.776-124.594 266.414-71.012l100.626-174.29c-28.78-16.466-53.692-40.498-71.434-71.228zM512 719.332c-114.508 0-207.336-92.824-207.336-207.334 0-114.508 92.826-207.334 207.336-207.334 114.508 0 207.332 92.826 207.332 207.334-0.002 114.51-92.824 207.334-207.332 207.334z"></path>
                </svg>
                {settings && <div className="settingsMenu"> 
                    <button className="resetButton" onClick={resetBox}>Reset Box</button>
                    <button className="newBoxButton" onClick={clearBoxes}>Clear All Boxes</button>
                    <button className="addBoxButton" onClick={addBox}>New Box</button>
                    <div> 
                        <button 
                            className="prevBoxButton" 
                            onClick={()=>changeBoxIndex(currentBoxIndexState-1)}
                            disabled={currentBoxIndexState === 0}>{"<"}</button>
                        <button 
                            className="nextBoxButton" 
                            onClick={()=>changeBoxIndex(currentBoxIndexState+1)}
                            disabled={currentBoxIndexState === boxesState.length - 1}>{">"}</button>
                    </div>
                    <hr/>
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
                    <hr/>
                    <div className="canvasMenu">
                        <h5>Canvas Options</h5>
                        <div className="scaleMenu">
                            <h5>Scale:</h5>
                            <input 
                                type="range" 
                                min={400} 
                                max={2000} 
                                name="scale"
                                value={scale}
                                onChange={onScaleChangeEvent}
                            />
                        </div>
                        <div className="rotateButtons">
                            <button
                                className="rotateButton"
                                onClick={() => updateRotation(-1)}
                            >
                                <svg width="24" height="24" viewBox="0 0 1024 1024">
                                    <path d="M512 64c-141.384 0-269.376 57.32-362.032 149.978l-149.968-149.978v384h384l-143.532-143.522c69.496-69.492 165.492-112.478 271.532-112.478 212.068 0 384 171.924 384 384 0 114.696-50.292 217.636-130.018 288l84.666 96c106.302-93.816 173.352-231.076 173.352-384 0-282.77-229.23-512-512-512z"></path>
                                </svg>
                            </button>
                            <button
                                className="rotateButton"
                                onClick={() => updateRotation(1)}
                                >
                                <svg width="24" height="24" viewBox="0 0 1024 1024">
                                    <path d="M0 576c0 152.924 67.048 290.184 173.35 384l84.666-96c-79.726-70.364-130.016-173.304-130.016-288 0-212.076 171.93-384 384-384 106.042 0 202.038 42.986 271.53 112.478l-143.53 143.522h384v-384l-149.97 149.978c-92.654-92.658-220.644-149.978-362.030-149.978-282.77 0-512 229.23-512 512z"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <hr />
                    <div className="imageOptions">
                        <h5>Image Options</h5>
                        <div className="imageUpload">
                            <h5>Upload an image</h5>
                            <input type="file" onChange={onImageUpdate}/>
                        </div>
                        <button className="clearButton" onClick={clearImage}>Clear Image</button>
                    </div>
                </div>
                }
            </div>
            <div className="imageDraw">
                <h3>{setInfoHeader(boxState ? lengthDefined(boxState.actualBox) : 0)}</h3>
                <div className="drawCanvas" style={scaleStyle()}>
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
                </div>
                {/* {lengthDefined(boxState.boxPoints) === 8 && <p>{boxMSE(boxState.boxPoints, boxState.correctBP)}</p>} */}
            </div>
        </div>
    )
}