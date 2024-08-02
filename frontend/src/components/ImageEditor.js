import React from 'react';

const ImageEditor = ({ images, onDescriptionChange, onSubmit }) => {
    return (
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Edit Image Descriptions</h2>
        {images.map((image, index) => (
          <div key={index} className="mb-6 p-4 border rounded">
            <p>Slide: {image.slide_number}, Shape: {image.shape_number}</p>
            <img 
              src={`/api/images/${image.image_path}`} 
              alt={`Slide ${image.slide_number}, Shape ${image.shape_number}`}
              className="mb-2 max-w-full h-auto"
            />
            <textarea
              value={image.description}
              onChange={(e) => onDescriptionChange(index, e.target.value)}
              className="w-full p-2 border rounded"
              rows="3"
            />
          </div>
        ))}
        <button
          onClick={onSubmit}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Save Descriptions and Process
        </button>
      </div>
    );
  };
  
  export default ImageEditor;