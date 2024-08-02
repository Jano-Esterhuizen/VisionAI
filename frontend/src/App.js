import React, { useState } from 'react';
import axios from 'axios';
import { AlertCircle, Upload, Download } from 'lucide-react';

function App() {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [downloadLink, setDownloadLink] = useState(null);
  const [error, setError] = useState(null);

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
  
      console.log('Server response:', response.data);  // Debug log
  
      if (response.data.filename) {
        const downloadUrl = `/download/${response.data.filename}`;
        console.log('Setting download link:', downloadUrl);  // Debug log
        setDownloadLink(downloadUrl);
      } else {
        console.error('No filename in response');
        setError('Error: No filename received from server');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('An error occurred during upload. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async () => {
    try {
      console.log('Initiating download for:', downloadLink);
      const response = await axios.get(downloadLink, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'modified_presentation.pptx');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
      setError('Failed to download the file. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">PowerPoint Processor</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
      
      <div className="mb-4">
        <input
          type="file"
          onChange={handleFileChange}
          accept=".pptx"
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>
      
      <button
        onClick={handleUpload}
        disabled={isUploading}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
      >
        <Upload className="mr-2" />
        {isUploading ? 'Uploading...' : 'Upload and Process'}
      </button>
      
      {isUploading && (
        <div className="mt-4">
          <div className="bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{width: `${uploadProgress}%`}}
            ></div>
          </div>
          <p className="text-center mt-2">{uploadProgress}% Uploaded</p>
        </div>
      )}
      
      {downloadLink && (
        <button
          onClick={handleDownload}
          className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
        >
          <Download className="mr-2" />
          Download Processed File
        </button>
      )}
    </div>
  );
}

export default App;