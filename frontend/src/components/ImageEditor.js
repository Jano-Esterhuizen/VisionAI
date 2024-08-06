import React from 'react';

const ImageEditor = ({ images, onDescriptionChange, onSubmit }) => {
  return (
    <div className="bg-opacity-20 bg-black shadow-2xl rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-heading font-semibold mb-6">Edit Image Descriptions</h2>
      <div className="space-y-6">
        {images.map((image, index) => (
          <div key={index} className="bg-white border-4 border-black rounded-lg p-5">
            <p className="text-sm text-black mb-2">Slide: {image.slide_number}, Shape: {image.shape_number}</p>
            <div className="flex flex-col lg:flex-row lg:space-x-4">
              <img 
                src={`/api/images/${image.image_path}`} 
                alt={`Slide ${image.slide_number}, Shape ${image.shape_number}`}
                className="mb-4 lg:mb-0 max-w-full h-auto lg:max-w-[200px] rounded-lg"
              />
              <div className="flex-grow">
                <label htmlFor={`description-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id={`description-${index}`}
                  value={image.description}
                  onChange={(e) => onDescriptionChange(index, e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-black" // Add `text-black` to change text color to black
                  rows="4"
                />

              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={onSubmit}
        className="mt-6 bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-md transition duration-300 ease-in-out w-full"
      >
        Save Descriptions and Process
      </button>
    </div>
  );
};

export default ImageEditor;