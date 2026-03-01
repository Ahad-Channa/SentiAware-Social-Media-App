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
    <div className="min-h-screen bg-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full bg-slate-800 rounded-2xl border border-slate-700 shadow-sm overflow-hidden relative">

        {/* Close Button (Absolute) */}
        <button
          onClick={() => navigate('/feed')}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 transition-colors p-2 rounded-full hover:bg-slate-700 z-10"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <div className="p-6 md:p-8">

          {/* Header Area */}
          <div className="flex items-center gap-4 mb-6">
            <div className="h-12 w-12 rounded-full bg-slate-700 flex-shrink-0 overflow-hidden">
              {user?.profilePic ? (
                <img src={user.profilePic} alt="User" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-slate-400 font-bold text-lg">
                  {user?.name?.[0]?.toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">Create Post</h2>
              <div className="flex items-center gap-1 text-sm text-slate-400">
                <span>Visible to</span>
                <span className="font-semibold text-slate-300">Everyone</span>
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div className="mb-6">
            <textarea
              className="w-full min-h-[150px] text-lg text-slate-100 placeholder-slate-500 border-none focus:ring-0 resize-none bg-transparent p-0 leading-relaxed"
              placeholder="What's happening?"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              autoFocus
            />
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div className="relative mb-6 group rounded-xl overflow-hidden border border-slate-700">
              <img src={imagePreview} alt="Preview" className="w-full max-h-[400px] object-cover" />
              <button
                onClick={removeImage}
                className="absolute top-3 right-3 bg-black/60 text-white rounded-full p-1.5 hover:bg-black/80 transition-colors backdrop-blur-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
          )}

          {/* Actions Bar */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-700">

            {/* Media Actions */}
            <div className="flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelect}
                accept="image/*"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current.click()}
                className="p-2.5 rounded-full text-slate-400 hover:bg-slate-700 hover:text-slate-100 transition-colors"
                title="Add Photo"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              </button>
              {/* Future: Add more icons like Emoji, Location etc. here */}
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || (!postContent.trim() && !selectedImage)}
              className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-sm flex items-center gap-2
                    ${isSubmitting || (!postContent.trim() && !selectedImage)
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  : 'bg-white text-slate-900 hover:bg-slate-200 hover:shadow-md'
                }`}
            >
              <span>{isSubmitting ? 'Publishing...' : 'Post'}</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CreatePost;