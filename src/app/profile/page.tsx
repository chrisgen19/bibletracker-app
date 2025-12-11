'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { LogOut, User, Mail, Phone, MapPin, Calendar } from 'lucide-react';

export default function ProfilePage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBackToHome}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Back to Calendar
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {user?.firstName} {user?.lastName}
          </h2>
          <p className="text-gray-600">
            Manage your profile information and account settings.
          </p>
        </div>

        {/* User Profile Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-6">
            <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center">
              <User size={40} className="text-blue-600" />
            </div>
            <div className="ml-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {user?.firstName} {user?.lastName}
              </h3>
              <p className="text-gray-500">{user?.status}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Mail size={20} className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-900">{user?.email}</p>
              </div>
            </div>

            {/* Phone */}
            {user?.phoneNumber && (
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Phone size={20} className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-gray-900">{user.phoneNumber}</p>
                </div>
              </div>
            )}

            {/* Gender */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <User size={20} className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Gender</p>
                <p className="text-gray-900">{user?.gender}</p>
              </div>
            </div>

            {/* Date of Birth */}
            {user?.dateOfBirth && (
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Calendar size={20} className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Date of Birth</p>
                  <p className="text-gray-900">
                    {new Date(user.dateOfBirth).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}

            {/* Location */}
            {(user?.city || user?.country) && (
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <MapPin size={20} className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="text-gray-900">
                    {[user?.city, user?.country].filter(Boolean).join(', ')}
                  </p>
                </div>
              </div>
            )}

            {/* Address */}
            {user?.address && (
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg col-span-full">
                <MapPin size={20} className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="text-gray-900">{user.address}</p>
                  {user?.postalCode && (
                    <p className="text-gray-600 text-sm">Postal Code: {user.postalCode}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Account Status */}
          <div className="mt-6 pt-6 border-t">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Email Verified</p>
                <p className={user?.emailVerified ? 'text-green-600' : 'text-red-600'}>
                  {user?.emailVerified ? 'Yes' : 'No'}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Phone Verified</p>
                <p className={user?.phoneVerified ? 'text-green-600' : 'text-red-600'}>
                  {user?.phoneVerified ? 'Yes' : 'No'}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Member Since</p>
                <p className="text-gray-900">
                  {user?.createdAt && new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Last Login</p>
                <p className="text-gray-900">
                  {user?.lastLoginAt && new Date(user.lastLoginAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
