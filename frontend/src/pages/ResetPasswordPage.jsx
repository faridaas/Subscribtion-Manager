import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { resetPasswordService } from '../services/resetPasswordService';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const token = searchParams.get('token');

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsLoading(true);
    try {
      await resetPasswordService.requestPasswordReset(email);
      setEmailSubmitted(true);
      toast.success('If that email exists in our system, you will receive a password reset link');
    } catch (error) {
      console.error('Password reset request error:', error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    try {
      await resetPasswordService.resetPassword(token, newPassword);
      toast.success('Password has been reset successfully');
      navigate('/login');
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-sky-50 to-cyan-700 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 bg-sky-50 p-8 rounded-2xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
            Reset Password
          </h2>
          <p className="text-sm text-gray-600">
            {token ? 'Enter your new password' : 'Enter your email to reset your password'}
          </p>
        </div>

        {token ? (
          // Reset Password Form
          <form onSubmit={handlePasswordReset} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div className="flex flex-col">
                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter new password"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Confirm new password"
                  required
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>
          </form>
        ) : (
          // Email Form
          <form onSubmit={handleEmailSubmit} className="mt-8 space-y-6">
            <div className="flex flex-col">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading || emailSubmitted}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-800 hover:bg-cyan-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 cursor-pointer ${
                  (isLoading || emailSubmitted) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Sending...' : emailSubmitted ? 'Check your email' : 'Send Reset Link'}
              </button>
            </div>
          </form>
        )}

        <div className="text-center pt-4">
          <button
            onClick={() => navigate('/login')}
            className="text-sm font-small text-[16px] text-indigo-100 bg-gray-500 border rounded-xl shadow-xl px-4 py-2 duration-200 cursor-pointer hover:bg-gray-800"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;