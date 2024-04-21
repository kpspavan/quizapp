import React from "react";
import "./image.css";

const ImageGallery = ({ images, onDelete }) => {
  const handleDelete = (index) => {
    onDelete(index);
  };

  return (
    <div className="gallery">
      {images.map((image, index) => (
        <div key={index} className="image-container">
          <button className="delete-button" onClick={() => handleDelete(index)}>
            Delete
          </button>
          <img src={image} alt={`Captured Image ${index}`} className="gallery-image" />
        </div>
      ))}
    </div>
  );
};

export default ImageGallery;
