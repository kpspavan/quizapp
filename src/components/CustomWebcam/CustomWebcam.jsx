import React, { useRef, useState } from "react";
import Webcam from "react-webcam";

const CustomWebcam = ({ onCapture }) => {
  const webcamRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [aspectRatio, setAspectRatio] = useState({ x: 16, y: 9 });
  const [facingMode, setFacingMode] = useState("user");

  const handleCapture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    onCapture(imageSrc);
  };

  const handleZoom = (e) => {
    const newZoom = parseFloat(e.target.value);
    setZoom(newZoom);
    webcamRef.current.video.width = 200 * newZoom;
    webcamRef.current.video.height = 200 * newZoom;
  };

  const handleAspectRatioChange = (e) => {
    const [x, y] = e.target.value.split(":").map(Number);
    setAspectRatio({ x: x, y: y });
  };

  const handleFacingModeToggle = () => {
    setFacingMode((prevFacingMode) =>
      prevFacingMode === "user" ? "environment" : "user"
    );
  };

  const videoWidth = 640;
  const videoHeight = (videoWidth * aspectRatio.y) / aspectRatio.x;

  const videoConstraints = {
    facingMode: facingMode,
    width: videoWidth,
    height: videoHeight,
  };

  return (
    <div className="webcam-container">
      <Webcam
        height={videoHeight}
        width={videoWidth}
        ref={webcamRef}
        mirrored={true}
        videoConstraints={videoConstraints}
        zoom={zoom}
      />
      <div className="controls">
        <button onClick={handleCapture}>Capture</button>
        <input
          type="range"
          min="1"
          max="5"
          step="0.1"
          value={zoom}
          onChange={handleZoom}
        />
        <select
          value={`${aspectRatio.x}:${aspectRatio.y}`}
          onChange={handleAspectRatioChange}
        >
          <option value="16:9">16:9</option>
          <option value="4:3">4:3</option>
          <option value="1:1">1:1</option>
        </select>
        <button onClick={handleFacingModeToggle}>Toggle Camera</button>
      </div>
    </div>
  );
};

export default CustomWebcam;
