import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { loginSuccess } from '../../redux/authSlice';

const EditProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const [formData, setFormData] = useState({
    fullName: '',
    bio: '',
    location: '',
  });
  const [avatarPreview, setAvatarPreview] = useState('');
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Prefill form with current user data
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.name || '',
        bio: user.bio || '',
        location: user.location || '',
      });
      setAvatarPreview(user.profilePic || '');
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePicFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Make FormData object to send file + text
      const form = new FormData();
      form.append('name', formData.fullName);
      form.append('bio', formData.bio);
      form.append('location', formData.location);
      if (profilePicFile) form.append('profilePic', profilePicFile);

      // Ensure your backend route matches
      const res = await axios.put(
        'http://localhost:5000/api/auth/update', // backend update route
        form,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      // Update Redux with new user data
      dispatch(loginSuccess(res.data));

      toast.success('Profile updated successfully!');
      navigate('/profile');
    } catch (error) {
      console.error('Update failed:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Edit Profile</h1>

        <div className="bg-white rounded-xl shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center space-x-6">
              <div className="h-24 w-24 rounded-full bg-purple-400 overflow-hidden flex items-center justify-center text-white text-3xl font-bold">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  user.name?.[0] || 'U'
                )}
              </div>
              <input type="file" accept="image/*" onChange={handleFileChange} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                className="mt-1 block w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex items-center justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={`px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 flex items-center ${
                  isLoading ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
