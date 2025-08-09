import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { FiSearch, FiPlus, FiX, FiUser, FiMail, FiPhone, FiCreditCard, FiEdit2, FiTrash2 } from 'react-icons/fi';

// Configuration
const API_BASE_URL = 'https://hotel-db-server.onrender.com';

const GuestsPage = () => {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    idType: 'passport',
    idNumber: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchGuests();
  }, [searchTerm]);

  const fetchGuests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/guests?search=${searchTerm}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGuests(response.data.guests);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load guests');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      if (editingId) {
        // Update existing guest
        const response = await axios.put(
          `${API_BASE_URL}/guests/${editingId}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setGuests(guests.map(g => g._id === editingId ? response.data : g));
      } else {
        // Create new guest
        const response = await axios.post(
          `${API_BASE_URL}/guests`, 
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setGuests([...guests, response.data]);
      }
      
      resetForm();
    } catch (err) {
      setError(err.response?.data?.error || (editingId ? 'Failed to update guest' : 'Failed to add guest'));
    }
  };

  const handleEdit = (guest) => {
    setFormData({
      firstName: guest.firstName,
      lastName: guest.lastName,
      email: guest.email,
      phone: guest.phone,
      idType: guest.idType,
      idNumber: guest.idNumber
    });
    setEditingId(guest._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/guests/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGuests(guests.filter(g => g._id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete guest');
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      idType: 'passport',
      idNumber: ''
    });
    setEditingId(null);
    setShowForm(false);
    setError('');
  };

  const getIdTypeDisplay = (idType) => {
    const types = {
      passport: 'Passport',
      driving_license: 'Driving License',
      national_id: 'National ID'
    };
    return types[idType] || idType;
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error && !showForm) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md w-full">
        {error}
        <button 
          onClick={() => setError('')}
          className="mt-2 text-sm text-red-700 underline"
        >
          Try again
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      
      <div className="flex-1 min-w-0 transition-all duration-300">
        {/* Main Content Container */}
        <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Guests Management</h1>
              <p className="text-gray-600 mt-1">Manage your hotel guests and their information</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 lg:items-center">
              {/* Search Bar */}
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
                <input
                  type="text"
                  placeholder="Search guests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              
              {/* Add Guest Button */}
              <button
                onClick={() => {
                  resetForm();
                  setShowForm(!showForm);
                }}
                className={`flex items-center justify-center px-4 py-2.5 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                  showForm 
                    ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                }`}
              >
                {showForm ? (
                  <>
                    <FiX className="mr-2" /> Cancel
                  </>
                ) : (
                  <>
                    <FiPlus className="mr-2" /> Add Guest
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Add/Edit Guest Form */}
          {showForm && (
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 border border-gray-200">
              <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
                <FiPlus className="mr-2 text-blue-600" />
                {editingId ? 'Edit Guest' : 'Add New Guest'}
              </h2>
              
              {error && (
                <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  
                  {/* First Name */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
                      <input
                        name="firstName"
                        placeholder="e.g., John"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  {/* Last Name */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
                      <input
                        name="lastName"
                        placeholder="e.g., Smith"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Email Address</label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
                      <input
                        name="email"
                        type="email"
                        placeholder="john.smith@email.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <div className="relative">
                      <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
                      <input
                        name="phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  {/* ID Type */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">ID Type</label>
                    <div className="relative">
                      <FiCreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
                      <select
                        name="idType"
                        value={formData.idType}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white"
                        required
                      >
                        <option value="passport">Passport</option>
                        <option value="driving_license">Driving License</option>
                        <option value="national_id">National ID</option>
                      </select>
                    </div>
                  </div>

                  {/* ID Number */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">ID Number</label>
                    <div className="relative">
                      <FiCreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
                      <input
                        name="idNumber"
                        placeholder="ID Number"
                        value={formData.idNumber}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg"
                  >
                    {editingId ? 'Update Guest' : 'Save Guest'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Guests Table/Cards */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            
            {/* Results Count */}
            {guests.length > 0 && (
              <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50">
                <p className="text-sm text-gray-600">
                  Showing {guests.length} guest{guests.length !== 1 ? 's' : ''}
                  {searchTerm && ` matching "${searchTerm}"`}
                </p>
              </div>
            )}

            {/* Desktop Table View */}
            <div className="hidden lg:block">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Information</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Identification</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {guests.length > 0 ? (
                      guests.map(guest => (
                        <tr key={guest._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                                <FiUser className="text-blue-600 text-lg" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-bold text-gray-900">
                                  {guest.firstName} {guest.lastName}
                                </div>
                                <div className="text-xs text-gray-500">
                                  Guest ID: #{guest._id.slice(-6).toUpperCase()}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="space-y-1">
                              <div className="flex items-center text-sm text-gray-900">
                                <FiMail className="text-gray-400 mr-2" />
                                {guest.email}
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <FiPhone className="text-gray-400 mr-2" />
                                {guest.phone}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="space-y-1">
                              <div className="flex items-center">
                                <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                                  {getIdTypeDisplay(guest.idType)}
                                </span>
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <FiCreditCard className="text-gray-400 mr-2" />
                                {guest.idNumber}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => handleEdit(guest)}
                                className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                              >
                                <FiEdit2 />
                              </button>
                              <button 
                                onClick={() => setDeleteConfirm(guest._id)}
                                className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                              >
                                <FiTrash2 />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-6 py-8 text-center text-sm text-gray-500">
                          <div className="flex flex-col items-center">
                            <FiUser className="text-4xl text-gray-400 mb-2" />
                            <p>No guests found</p>
                            <p className="text-xs">
                              {searchTerm ? `No results for "${searchTerm}"` : 'Add your first guest to get started'}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile/Tablet Card View */}
            <div className="lg:hidden">
              {guests.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {guests.map(guest => (
                    <div key={guest._id} className="p-4 hover:bg-gray-50 transition-colors">
                      
                      {/* Guest Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <FiUser className="text-blue-600" />
                          </div>
                          <div className="ml-3">
                            <div className="text-lg font-bold text-gray-900">
                              {guest.firstName} {guest.lastName}
                            </div>
                            <div className="text-xs text-gray-500">
                              ID: #{guest._id.slice(-6).toUpperCase()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleEdit(guest)}
                            className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50"
                          >
                            <FiEdit2 />
                          </button>
                          <button 
                            onClick={() => setDeleteConfirm(guest._id)}
                            className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </div>
                      
                      {/* Contact Information */}
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center text-sm text-gray-900">
                          <FiMail className="text-gray-400 mr-2 flex-shrink-0" />
                          <span className="break-all">{guest.email}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <FiPhone className="text-gray-400 mr-2 flex-shrink-0" />
                          <span>{guest.phone}</span>
                        </div>
                      </div>
                      
                      {/* Identification */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Identification</span>
                          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                            {getIdTypeDisplay(guest.idType)}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <FiCreditCard className="text-gray-400 mr-2 flex-shrink-0" />
                          <span className="font-mono">{guest.idNumber}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <FiUser className="text-6xl text-gray-400 mx-auto mb-4" />
                  <p className="text-lg mb-2">No guests found</p>
                  <p className="text-sm">
                    {searchTerm ? `No results for "${searchTerm}"` : 'Add your first guest to get started'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this guest? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuestsPage;
