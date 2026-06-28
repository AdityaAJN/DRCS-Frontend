import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { helpRequestService } from '../../services/helpRequestService';
import { AlertTriangle, Send, ArrowLeft } from 'lucide-react';

export default function LodgeHelpRequest() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    category: 'RESCUE',
    description: '',
    familyMembersCount: 1,
    latitude: 20.5937,
    longitude: 78.9629,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await helpRequestService.createHelpRequest(formData);
      if (res.success) {
        navigate('/citizen/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to lodge request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 flex justify-center items-center">
      <div className="glass-panel w-full max-w-2xl p-8 rounded-2xl shadow-2xl space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center space-x-3">
          <div className="p-3 bg-red-600/20 rounded-xl border border-red-500/30 text-red-400">
            <AlertTriangle size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Lodge Emergency Help Request</h1>
            <p className="text-xs text-slate-400">Provide accurate coordinates and family size for instant dispatch triage</p>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Emergency Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/60 rounded-xl text-white focus:outline-none focus:border-red-500"
              >
                <option value="RESCUE">RESCUE OPERATION</option>
                <option value="EMERGENCY">CRITICAL EMERGENCY</option>
                <option value="MEDICINE">MEDICAL ATTENTION</option>
                <option value="FOOD">FOOD & SUPPLIES</option>
                <option value="WATER">CLEAN DRINKING WATER</option>
                <option value="SHELTER">TEMPORARY SHELTER</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Family Members Count</label>
              <input
                type="number"
                min="1"
                required
                value={formData.familyMembersCount}
                onChange={(e) => setFormData({ ...formData, familyMembersCount: parseInt(e.target.value) })}
                className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/60 rounded-xl text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Situation Description</label>
            <textarea
              rows="3"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/60 rounded-xl text-white focus:outline-none focus:border-red-500"
              placeholder="Describe immediate danger, landmark details, or medical needs..."
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-900/40 border border-slate-800 rounded-xl">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">GPS Latitude</label>
              <input
                type="number"
                step="any"
                required
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">GPS Longitude</label>
              <input
                type="number"
                step="any"
                required
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-all flex items-center justify-center space-x-2 shadow-xl shadow-red-600/30 disabled:opacity-50"
          >
            <Send size={20} />
            <span>{loading ? 'Transmitting Emergency Request...' : 'Submit Emergency Request'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}