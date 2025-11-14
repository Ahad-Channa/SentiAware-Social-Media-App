import React from 'react';
import { Link } from 'react-router-dom';

const Feed = () => {
  const posts = [
    {
      id: 1,
      user: {
        name: 'Alex Rivera',
        username: '@alexr',
        avatar: 'AR',
        isVerified: true
      },
      content: 'Just finished a great meditation session! Starting the day with positivity and mindfulness. 🧘‍♂️✨ Remember to take care of your mental health everyone!',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      timestamp: '2 hours ago',
      likes: 234,
      comments: 45,
      shares: 12,
      isLiked: true
    },
    {
      id: 2,
      user: {
        name: 'Sarah Chen',
        username: '@sarahc',
        avatar: 'SC'
      },
      content: 'Had an amazing therapy session today. It\'s okay to ask for help when you need it. You\'re never alone in this journey. 💕 #MentalHealthMatters',
      timestamp: '4 hours ago',
      likes: 156,
      comments: 28,
      shares: 8,
      isLiked: false
    },
    {
      id: 3,
      user: {
        name: 'Michael Brown',
        username: '@mikeb',
        avatar: 'MB'
      },
      content: 'Gratitude check! 🙏 3 things I\'m grateful for today:\n1. Supportive friends\n2. Morning coffee ☕\n3. This amazing community\n\nWhat are you grateful for?',
      image: 'https://images.unsplash.com/photo-1518655048521-f130df041f66?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      timestamp: '6 hours ago',
      likes: 342,
      comments: 89,
      shares: 24,
      isLiked: false
    }
  ];

  const suggestions = [
    { id: 1, name: 'Lina Gomez', avatar: 'LG', mutuals: 4 },
    { id: 2, name: 'Omar Khan', avatar: 'OK', mutuals: 2 },
    { id: 3, name: 'Priya Singh', avatar: 'PS', mutuals: 5 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-6 items-start">
          <main className="flex-1">
            <div className="w-full max-w-3xl">
              <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-full bg-purple-400 flex items-center justify-center text-white font-bold">
                    ME
                  </div>
                  <Link
                    to="/create-post"
                    className="flex-grow px-4 py-3 bg-gray-50 text-gray-500 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors"
                  >
                    Share something positive with the community...
                  </Link>
                </div>
              </div>

              <div className="space-y-6">
                {posts.map(post => (
                  <div key={post.id} className="bg-white rounded-xl shadow-sm">
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-purple-400 flex items-center justify-center text-white font-bold">
                            {post.user.avatar}
                          </div>
                          <div>
                            <div className="flex items-center">
                              <span className="font-semibold text-gray-900">
                                {post.user.name}
                              </span>
                              {post.user.isVerified && (
                                <svg className="w-4 h-4 ml-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm3.707 6.707l-4 4a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L9 10.586l3.293-3.293a1 1 0 011.414 1.414z"/>
                                </svg>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-500">{post.user.username}</span>
                              <span className="text-sm text-gray-500">·</span>
                              <span className="text-sm text-gray-500">{post.timestamp}</span>
                            </div>
                          </div>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600">
                          •••
                        </button>
                      </div>
                      
                      <p className="mt-3 text-gray-800 whitespace-pre-line">{post.content}</p>
                    </div>
                    {post.image && (
                      <div className="aspect-w-16 aspect-h-9 mt-2">
                        <img 
                          src={post.image} 
                          alt="Post content" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div className="p-4 border-t border-gray-100">
                      <div className="flex items-center space-x-6">
                        <button 
                          className={`flex items-center space-x-2 ${
                            post.isLiked ? 'text-purple-500' : 'text-gray-500'
                          } hover:text-purple-500`}
                        >
                          <svg 
                            className="w-6 h-6" 
                            fill={post.isLiked ? 'currentColor' : 'none'} 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth="2" 
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                          <span>{post.likes}</span>
                        </button>
                        <button className="flex items-center space-x-2 text-gray-500 hover:text-purple-500">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                          </svg>
                          <span>{post.comments}</span>
                        </button>
                        <button className="flex items-center space-x-2 text-gray-500 hover:text-purple-500">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                          </svg>
                          <span>{post.shares}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>

          <aside className="hidden lg:block w-80 sticky top-16 h-[calc(100vh-4rem)] overflow-auto">
            <div className="space-y-4 p-2">
              <div className="bg-white rounded-xl shadow-sm p-4">
                <h3 className="text-lg font-semibold">People you may know</h3>
                <p className="text-sm text-gray-500 mt-1">Suggestions to add as friends</p>
              </div>

              {suggestions.map(s => (
                <div key={s.id} className="bg-white rounded-xl shadow-sm p-4 flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-purple-400 flex items-center justify-center text-white font-bold">{s.avatar}</div>
                  <div className="flex-1">
                    <div className="font-medium">{s.name}</div>
                    <div className="text-sm text-gray-500">{s.mutuals} mutual friends</div>
                  </div>
                  <button className="px-3 py-1 rounded-md bg-purple-500 text-white text-sm hover:bg-purple-600">Add</button>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Feed;
