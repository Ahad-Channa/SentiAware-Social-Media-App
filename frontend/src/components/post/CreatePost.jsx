import React, { useState } from 'react';

const CreatePost = () => {
  const [postContent, setPostContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Post content:', postContent);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-4">
  <div className="w-full max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-start space-x-4">
            <div className="h-12 w-12 rounded-full bg-purple-400 flex items-center justify-center text-white font-bold">
              ME
            </div>

            <div className="flex-grow">
              <textarea
                className="w-full min-h-[120px] p-4 text-gray-600 placeholder-gray-400 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-transparent resize-none"
                placeholder="Share something positive with the community..."
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
              />

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-purple-500 px-3 py-2 rounded-lg hover:bg-purple-50">
                    <span className="text-xl">🖼️</span>
                    <span>Image</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-purple-500 px-3 py-2 rounded-lg hover:bg-purple-50">
                    <span className="text-xl">😊</span>
                    <span>Emoji</span>
                  </button>
                </div>
                <button 
                  className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 flex items-center space-x-2"
                  onClick={handleSubmit}
                >
                  <span className="text-lg">📤</span>
                  <span>Post</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-2 text-blue-600 mb-4">
            <span className="text-xl">💡</span>
            <h2 className="text-lg font-medium">Tips for Positive Posting</h2>
          </div>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-center space-x-2">
              <span className="text-blue-500">•</span>
              <span>Use encouraging and supportive language</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-blue-500">•</span>
              <span>Focus on solutions rather than problems</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-blue-500">•</span>
              <span>Be respectful of different perspectives</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-blue-500">•</span>
              <span>Our AI helps rewrite content to maintain a safe space</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;