import React from "react";
import Canvas from "./canvas";
import { lengthDefined } from "../Utils/pointsofbox";

export default function ImageDraw(props) {
    const [width, height] = [400, 400]; 

    const [boxType, setBoxType] = React.useState("DrawnBox");
    const [extendedLineOptions, setExtendedLineOptions] = React.useState({
        extendedDrawnLines: false, 
        extendedCorrectLines: false
    });

    const [imageFile, setImageFile] = React.useState(null);
    const [image, setImage] = React.useState(null);
    
    const onChangeEvent = (evt) => {
        setBoxType(evt.target.value);
        // console.log(evt.target.value);
    }
    
    const initBox = [...Array.from(8)]
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

    const onImageUpdate = (event) => {
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

    const clearImage = (e) => {
        setImageFile(null);
        setImage(null);
    }

    React.useEffect(() => {
        console.log("FIRED")
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

    React.useEffect(() => {
        console.log(boxState);
    }, [boxState])

    // React.useEffect(() => {
    //     console.log(extendedLines);
    // }, [extendedLines]);

    return (
        <div>
            <h3>{setInfoHeader(lengthDefined(boxState.boxPoints))}</h3>
            {!imageFile && <Canvas
                width={400}
                height={400}
                showDrawnBox={(boxType === "DrawnBox" || boxType === "BothBox")}
                showCorrectBox={(boxType === "CorrectBox" || boxType === "BothBox")}
                boxState={boxState}
                updateBoxState={updateBoxState}
                extendedLineOptions={extendedLineOptions}
            />}
            {imageFile && image && <Canvas 
                width = {capImageWidth(image, 750)[0]}
                height = {capImageWidth(image, 750)[1]}
                showDrawnBox={(boxType === "DrawnBox" || boxType === "BothBox")}
                showCorrectBox={(boxType === "CorrectBox" || boxType === "BothBox")}
                boxState={boxState}
                updateBoxState={updateBoxState}
                extendedLineOptions={extendedLineOptions}
                image = {image}
            />}
            <div onChange={onChangeEvent}>
                <input type="radio" value="DrawnBox" name="box" checked={boxType === "DrawnBox"} />
                <p>Show Drawn Box</p>
                <input type="radio" value="CorrectBox" name="box" checked={boxType === "CorrectBox"} />
                <p>Show Correct Box</p>
                <input type="radio" value="BothBox" name="box" checked={boxType === "BothBox"} />
                <p>Show Both Boxes</p>
            </div>
            <div>
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
            <input type="file" onChange={onImageUpdate}/>
            <button onClick={clearImage}>Clear Image</button>
            <button onClick={resetBox}>Reset</button>
        </div>
    )
}