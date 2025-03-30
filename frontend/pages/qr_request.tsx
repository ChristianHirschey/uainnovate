"use client"
import "../app/globals.css";
import React, { useState } from 'react';

// Type for the response from Gemini
interface GeminiResponse {
  items: Array<{
    name: string;
    [key: string]: any;
  }>;
}

const ImageRequestForm: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedImage = e.target.files[0];
      setImage(selectedImage);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedImage);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!image) {
      setError('Please capture an image first.');
      return;
    }

    setLoading(true);

    try {
        const formData = new FormData();
        formData.append('file', image); // 'file' must match the parameter name in your FastAPI endpoint

      // Process the image with Gemini
      const geminiResult = await fetch('http://localhost:8000/api/qr', {
        method: 'POST',
        body: formData,
      });

      console.log(geminiResult);
      
    //   // Send structured data to your API
    //   const response = await fetch('http://localhost:8000/api/requests', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(geminiResult),
    //   });

    //   if (!response.ok) {
    //     const errorText = await response.text();
    //     throw new Error(`Failed to submit request: ${errorText}`);
    //   }

      setSuccess('Request submitted successfully!');
      // Clear the form
      setImage(null);
      setPreview(null);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Submit a Request via Image</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <p>{success}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Take a photo of the item you need
          </label>
          
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageCapture}
            className="hidden"
            id="image-input"
          />
          
          <label 
            htmlFor="image-input"
            className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600"
          >
            {preview ? 'Change Image' : 'Take Photo'}
          </label>
          
          {preview && (
            <div className="mt-4">
              <img 
                src={preview} 
                alt="Preview" 
                className="mx-auto max-h-64 rounded-md shadow-sm" 
              />
            </div>
          )}
        </div>
        
        <button
          type="submit"
          disabled={loading || !image}
          className={`w-full py-2 px-4 rounded-md shadow-sm ${
            loading || !image 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {loading ? 'Processing...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default ImageRequestForm;