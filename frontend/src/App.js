import React, { useState, useEffect, useCallback} from 'react';
import Login from './components/Login';
import axios from 'axios';
import { AlertCircle, Upload, Download, HelpCircle, RefreshCw } from 'lucide-react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import ImageEditor from './components/ImageEditor';
import { useDropzone } from 'react-dropzone';

function App() {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [downloadLink, setDownloadLink] = useState(null);
  const [error, setError] = useState(null);
  const [images, setImages] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [promptType, setPromptType] = useState('general');
  const [showTour, setShowTour] = useState(false);

  const resetProcess = () => {
    setFile(null);
    setIsUploading(false);
    setUploadProgress(0);
    setDownloadLink(null);
    setError(null);
    setImages([]);
    setIsEditing(false);
    setPromptType('General');  // Reset to default prompt type
  };

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    if (!hasSeenTour) {
      setShowTour(true);
    }
  }, []);

  const closeTour = () => {
    setShowTour(false);
    localStorage.setItem('hasSeenTour', 'true');
  };

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: '.pptx',
    multiple: false
  });

  

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first.');
      return;
    }
  
    setIsUploading(true);
    setUploadProgress(0);
  
    const formData = new FormData();
    formData.append('file', file);
    formData.append('promptType', promptType);
  
    console.log('Uploading file:', file.name);
    console.log('Prompt type:', promptType);
  
    try {
      const response = await axios.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });
  
      console.log('Upload response:', response.data);
      setImages(response.data.images);
      setIsEditing(true);
    } catch (err) {
      console.error('Upload error:', err.response ? err.response.data : err.message);
      setError('An error occurred during upload. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDescriptionChange = (index, newDescription) => {
    const updatedImages = [...images];
    updatedImages[index].description = newDescription;
    setImages(updatedImages);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('/process', {
        filename: file.name,
        descriptions: images.map(img => ({
          slide_number: img.slide_number,
          shape_number: img.shape_number,
          description: img.description
        }))
      });
  
      console.log('Process response:', response.data);
  
      if (response.data.filename) {
        const downloadUrl = `/download/${response.data.filename}`;
        console.log('Setting download link:', downloadUrl);
        setDownloadLink(downloadUrl);
        setIsEditing(false);
      } else {
        throw new Error('No filename in response');
      }
    } catch (err) {
      console.error('Processing error:', err.response ? err.response.data : err.message);
      setError('An error occurred while processing. Please try again.');
    }
  };

  const handleDownload = async () => {
    try {
      console.log('Initiating download for:', downloadLink);
      const response = await axios.get(downloadLink, {
        responseType: 'blob',
      });
      
      console.log('Download response:', response);
  
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'modified_presentation.pptx';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i);
        if (filenameMatch.length === 2)
          filename = filenameMatch[1];
      }
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error.response ? error.response.data : error.message);
      setError('Failed to download the file. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-custom text-white font-sans">
      <Login />
      <header className="bg-transparent py-4">
        <div className="container mx-auto px-1 flex items-center">
          <img src="/Visionary-Logo.png" alt="Visionary.AI Logo" className="h-10 filter drop-shadow-md" />
          <span className="ml-2 text-white text-xl font-bold tracking-wide filter drop-shadow-md">VISIONARY.AI</span>
        </div>
      </header>

      

      <main className="container mx-auto px-4 py-8">
        <div className="w-full flex justify-center">
          <h1 className="max-w-[600px] mx-auto text-center">
            <span className="block text-3xl sm:text-4xl leading-tight font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#44BCFF] to-[#80FFD1]">
              Give a PowerPoint and Receive Descriptions
            </span>
          </h1>
        </div>

      {error && (
        <div className="max-w-2xl mx-auto mt-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {!downloadLink ? (
        <div className="space-y-6 max-w-2xl mx-auto mt-8">
          {/* Description Type Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Description Type</label>
            <div className="flex justify-center space-x-2">
              {['General', 'Exam', 'Data Structures'].map((type) => (
                <button
                  key={type}
                  onClick={() => setPromptType(type)}
                  className={`px-4 py-2 rounded-full ${
                    promptType === type ? 'bg-primary text-white' : 'bg-opacity-20 bg-other text-white hover:bg-opacity-40'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* File Upload Area */}
          <div>
            <label className="block text-sm font-medium mb-2">Select PowerPoint File</label>
            <div 
              {...getRootProps()} 
              className={`p-20 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-primary bg-primary bg-opacity-10' : 'border-gray-300 hover:border-primary-light'
              }`}
            >
              <input {...getInputProps()} onChange={handleFileChange} />
              {isDragActive ? (
                <p className="text-primary">Drop the PowerPoint file here...</p>
              ) : (
                <div>
                  <p>Drag and drop a PowerPoint file here, or click to select</p>
                  <button className="mt-2 px-4 py-2 bg-primary text-white rounded-full hover:bg-primary-light">
                    Choose File
                  </button>
                </div>
              )}
              {file && (
                <p className="mt-2 text-sm text-gray-300">
                  Selected file: {file.name}
                </p>
              )}
            </div>
          </div>

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={isUploading || !file}
            className={`w-full bg-primary hover:bg-primary-light text-white font-bold py-3 px-4 rounded-full transition duration-300 ease-in-out flex items-center justify-center ${
              (!file || isUploading) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isUploading ? (
              'Uploading...'
            ) : (
              <>
                <Upload className="mr-2" />
                Upload and Process
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="mt-6 flex flex-col items-center">
          <p className="text-xl mb-4">Your file has been processed successfully!</p>
          <div className="flex space-x-4">
            <button
              onClick={handleDownload}
              className="bg-secondary hover:bg-secondary-dark text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out inline-flex items-center"
            >
              <Download className="mr-2" />
              Download Processed File
            </button>
            <button
              onClick={resetProcess}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out inline-flex items-center"
            >
              <RefreshCw className="mr-2" />
              Start Over
            </button>
          </div>
        </div>
      )}

      {isEditing && (
        <div className="py-6">
        <ImageEditor
          images={images}
          onDescriptionChange={handleDescriptionChange}
          onSubmit={handleSubmit}
        />
      </div>
      )}

      {isUploading && (
        <div className="mt-4 max-w-2xl mx-auto">
          <div className="bg-gray-200 rounded-full h-2.5 mb-2">
            <div 
              className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-in-out" 
              style={{width: `${uploadProgress}%`}}
            ></div>
          </div>
          <p className="text-center text-sm text-gray-300">{uploadProgress}% Uploaded</p>
        </div>
        )}
      </main>

      {showTour && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md">
            <h2 className="text-2xl font-bold mb-4">Welcome to Vision App!</h2>
            <p className="mb-4">Here's a quick guide to get you started:</p>
            <ol className="list-decimal list-inside mb-4">
              <li>Upload a PowerPoint file</li>
              <li>Choose a description type</li>
              <li>Edit the generated descriptions</li>
              <li>Download the processed file</li>
            </ol>
            <button
              onClick={closeTour}
              className="bg-primary text-white font-bold py-2 px-4 rounded"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;