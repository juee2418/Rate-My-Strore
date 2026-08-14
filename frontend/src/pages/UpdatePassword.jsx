import { useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/axios';
import { KeyRound } from 'lucide-react';

export default function UpdatePassword() {
  const [form, setForm] = useState({ oldPassword: '', newPassword: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const { data } = await api.put('/auth/update-password', form);
      setMessage(data.message);
      setForm({ oldPassword: '', newPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-md mx-auto px-6 py-12">
        <div className="card">
          <div className="flex items-center gap-2 mb-6">
            <KeyRound className="w-5 h-5 text-brand-600" />
            <h1 className="text-xl font-bold text-gray-800">Update Password</h1>
          </div>

          {message && <div className="bg-green-50 text-green-700 text-sm rounded-lg px-4 py-2.5 mb-4">{message}</div>}
          {error && <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-2.5 mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <input
                type="password"
                required
                className="input-field"
                value={form.oldPassword}
                onChange={(e) => setForm({ ...form, oldPassword: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                required
                className="input-field"
                value={form.newPassword}
                onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                placeholder="8-16 chars, 1 uppercase, 1 special char"
              />
            </div>
            <button disabled={loading} className="btn-primary w-full">
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
