import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { createPost } from '../../api/api';

const CreatePost = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const [postContent, setPostContent] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!postContent.trim() && !selectedImage) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('content', postContent);
      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      await createPost(formData);
      navigate('/feed');
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl overflow-hidden relative">

        {/* Close Button (Absolute) */}
        <button
          onClick={() => navigate('/feed')}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100 z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <div className="p-8">

          {/* Header Area */}
          <div className="flex flex-col items-center mb-6">
            <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 p-[3px] mb-3 shadow-sm">
              <div className="h-full w-full rounded-full bg-white overflow-hidden">
                {user?.profilePic ? (
                  <img src={user.profilePic} alt="User" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gray-50 text-purple-600 font-bold text-xl">
                    {user?.name?.[0]?.toUpperCase()}
                  </div>
                )}
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Create a Post</h2>
            <p className="text-gray-500 text-sm">Share your positive vibes!</p>
          </div>

          {/* Input Area */}
          <div className="mb-6">
            <textarea
              className="w-full min-h-[120px] text-lg text-center text-gray-700 placeholder-gray-400 border-none focus:ring-0 resize-none bg-transparent"
              placeholder="What's on your mind?"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              autoFocus
            />
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div className="relative mb-6 group">
              <img src={imagePreview} alt="Preview" className="w-full h-64 object-cover rounded-2xl shadow-sm" />
              <button
                onClick={removeImage}
                className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1.5 hover:bg-black/70 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between mt-8">

            {/* Image Upload Button (Minimal) */}
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelect}
                accept="image/*"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current.click()}
                className="p-3 rounded-full bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors"
                title="Add Photo"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              </button>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || (!postContent.trim() && !selectedImage)}
              className={`px-8 py-3 rounded-xl text-white font-semibold transition-all shadow-md flex items-center space-x-2
                    ${isSubmitting || (!postContent.trim() && !selectedImage)
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 hover:shadow-lg transform active:scale-95'
                }`}
            >
              <span>{isSubmitting ? 'Posting...' : 'Post'}</span>
              {!isSubmitting && (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CreatePost;