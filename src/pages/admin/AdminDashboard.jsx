import React, { useEffect, useState } from 'react';
import { dashboardService } from '../../services/dashboardService';
import { disasterService } from '../../services/disasterService';
import IncidentMap from '../../components/map/IncidentMap';
import { Shield, AlertTriangle, Plus } from 'lucide-react';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [disasters, setDisasters] = useState([]);

  const [newDisaster, setNewDisaster] = useState({
    title: '',
    description: '',
    severityLevel: 'HIGH',
    latitude: 20.5937,
    longitude: 78.9629,
    radiusKm: 25,
  });

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [anRes, disRes] = await Promise.all([
        dashboardService.getAnalytics(),
        disasterService.getAllDisasters(),
      ]);
      if (anRes.success) setAnalytics(anRes.data);
      if (disRes.success) setDisasters(disRes.data);
    } catch (err) {
      console.error('Error fetching admin dashboard analytics', err);
    }
  };

  const handleCreateDisaster = async (e) => {
    e.preventDefault();
    try {
      const res = await disasterService.createDisaster(newDisaster);
      if (res.success) {
        setDisasters([...disasters, res.data]);
        setNewDisaster({ title: '', description: '', severityLevel: 'HIGH', latitude: 20.5937, longitude: 78.9629, radiusKm: 25 });
        alert('New Disaster Incident Declared!');
      }
    } catch (err) {
      alert('Failed to declare disaster incident.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 space-y-6">
      <div className="glass-panel p-6 rounded-2xl flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Shield className="text-red-500" size={28} />
            Government & Admin Command Operations Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">Real-time emergency telemetry, shelter occupancy ratios, and disaster declaration dispatch</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Disasters</span>
          <p className="text-2xl font-extrabold text-red-400">{analytics?.activeDisastersCount || 0}</p>
        </div>
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Emergency Requests</span>
          <p className="text-2xl font-extrabold text-amber-400">{analytics?.totalHelpRequestsCount || 0}</p>
        </div>
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Volunteers</span>
          <p className="text-2xl font-extrabold text-green-400">{analytics?.totalVolunteers || 0}</p>
        </div>
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Shelter Occupancy Rate</span>
          <p className="text-2xl font-extrabold text-blue-400">{analytics?.shelterOccupancyRatePercentage || 0}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-[500px]">
          <IncidentMap disasters={disasters} zoom={5} />
        </div>

        <div className="glass-panel p-6 rounded-2xl space-y-4 flex flex-col">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <AlertTriangle className="text-red-500" size={20} />
            Declare Disaster Event
          </h2>

          <form onSubmit={handleCreateDisaster} className="space-y-3">
            <input
              type="text"
              placeholder="Disaster Title (e.g. Cyclone Relief Zone)"
              required
              value={newDisaster.title}
              onChange={(e) => setNewDisaster({ ...newDisaster, title: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
            />
            <textarea
              placeholder="Description & Impact Details"
              rows="2"
              value={newDisaster.description}
              onChange={(e) => setNewDisaster({ ...newDisaster, description: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
            ></textarea>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={newDisaster.severityLevel}
                onChange={(e) => setNewDisaster({ ...newDisaster, severityLevel: e.target.value })}
                className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>
              <input
                type="number"
                placeholder="Radius (KM)"
                required
                value={newDisaster.radiusKm}
                onChange={(e) => setNewDisaster({ ...newDisaster, radiusKm: parseFloat(e.target.value) })}
                className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1 shadow-lg shadow-red-600/30 transition-all"
            >
              <Plus size={16} />
              <span>Broadcast Disaster Alert</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}