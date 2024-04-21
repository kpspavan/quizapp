import React, { useState } from "react";

import CustomWebcam from "./components/CustomWebcam/CustomWebcam"
import ImageGallery from "./components/CustomWebcam/Imagegallery"
import "./App.css";


function App() {
  const [capturedImages, setCapturedImages] = useState([]);
  const handleDelete = (index) => {
    setCapturedImages((prevCapturedImages) => prevCapturedImages.filter((_, i) => i !== index));
  };

  const handleCapture = (imageSrc) => {
    setCapturedImages([...capturedImages, imageSrc]);
  };

  return (
    <div className="App">
      <CustomWebcam onCapture={handleCapture} />
      <ImageGallery onDelete={handleDelete} images={capturedImages} />
    </div>
  );
}



export default App;
