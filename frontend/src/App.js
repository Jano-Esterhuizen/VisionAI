import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertCircle, Upload, Download, HelpCircle } from 'lucide-react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import ImageEditor from './components/ImageEditor';

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

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setError(null);
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
    <div className="min-h-screen bg-background font-sans">
      <header className="bg-primary text-white py-4 shadow-md">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center">
          <img src="/Visionary-Logo.png" alt="Visionary.AI Icon" className="h-10 md:hidden" />
          <img src="/Visionary-Full.png" alt="Visionary.AI Logo" className="hidden md:block h-12" />
        </div>
        <nav className="hidden md:block">
          {/* Add navigation items here if needed */}
        </nav>
      </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {!isEditing && (
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-heading font-semibold mb-6 flex items-center">
              Upload PowerPoint
              <Tippy content="Upload a PowerPoint file to process">
                <HelpCircle className="ml-2 text-gray-400 cursor-pointer" size={20} />
              </Tippy>
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="promptType" className="block text-sm font-medium text-gray-700 mb-1">Description Type</label>
                <select
                  id="promptType"
                  value={promptType}
                  onChange={(e) => setPromptType(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="general">General</option>
                  <option value="exam">Exam</option>
                  <option value="dataStructures">Data Structures</option>
                </select>
              </div>
              <div>
                <label htmlFor="fileUpload" className="block text-sm font-medium text-gray-700 mb-1">Select PowerPoint File</label>
                <input
                  id="fileUpload"
                  type="file"
                  onChange={handleFileChange}
                  accept=".pptx"
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-light file:text-white hover:file:bg-primary"
                />
              </div>
              <button
                onClick={handleUpload}
                disabled={isUploading || !file}
                className={`w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-md transition duration-300 ease-in-out flex items-center justify-center ${
                  (!file || isUploading) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isUploading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2" />
                    Upload and Process
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {isUploading && (
          <div className="mt-4">
            <div className="bg-gray-200 rounded-full h-2.5 mb-2">
              <div 
                className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-in-out" 
                style={{width: `${uploadProgress}%`}}
              ></div>
            </div>
            <p className="text-center text-sm text-gray-600">{uploadProgress}% Uploaded</p>
          </div>
        )}

        {isEditing && (
          <ImageEditor
            images={images}
            onDescriptionChange={handleDescriptionChange}
            onSubmit={handleSubmit}
          />
        )}

        {downloadLink && (
          <div className="mt-6 text-center">
            <button
              onClick={handleDownload}
              className="bg-secondary hover:bg-secondary-dark text-white font-bold py-3 px-6 rounded-md transition duration-300 ease-in-out inline-flex items-center"
            >
              <Download className="mr-2" />
              Download Processed File
            </button>
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