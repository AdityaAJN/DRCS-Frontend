import React, { useEffect, useState } from 'react';
import { volunteerService } from '../../services/volunteerService';
import { helpRequestService } from '../../services/helpRequestService';
import IncidentMap from '../../components/map/IncidentMap';
import { Users, Navigation, MapPin, CheckCircle, Power } from 'lucide-react';

export default function VolunteerDashboard() {
  const [profile, setProfile] = useState(null);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVolunteerData();
  }, []);

  const fetchVolunteerData = async () => {
    try {
      const [profRes, reqRes] = await Promise.all([
        volunteerService.getMyProfile(),
        helpRequestService.getAllHelpRequests(),
      ]);
      if (profRes.success) setProfile(profRes.data);
      if (reqRes.success) {
        const myTasks = reqRes.data.filter(t => t.assignedVolunteerId === profRes.data?.userId);
        setAssignedTasks(myTasks);
      }
    } catch (err) {
      console.error('Error fetching volunteer data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async () => {
    if (!profile) return;
    try {
      const res = await volunteerService.updateAvailability(!profile.isAvailable);
      if (res.success) setProfile(res.data);
    } catch (err) {
      console.error('Failed to toggle availability', err);
    }
  };

  const handlePingLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
          const res = await volunteerService.updateLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
          if (res.success) alert('GPS Location Updated Successfully!');
        } catch (err) {
          alert('Failed to update GPS location.');
        }
      });
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="text-green-500" size={28} />
            Volunteer Operations Command
          </h1>
          <p className="text-xs text-slate-400 mt-1">Manage duty availability and navigate to assigned rescue coordinates</p>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={handlePingLocation}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center space-x-2 border border-slate-700 transition-all"
          >
            <MapPin size={16} className="text-blue-400" />
            <span>Ping Live GPS</span>
          </button>

          <button
            onClick={handleToggleAvailability}
            className={`px-5 py-2.5 rounded-xl font-semibold text-xs flex items-center space-x-2 shadow-lg transition-all ${
              profile?.isAvailable
                ? 'bg-green-600 hover:bg-green-500 text-white shadow-green-600/30'
                : 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/30'
            }`}
          >
            <Power size={16} />
            <span>{profile?.isAvailable ? 'Status: ON DUTY' : 'Status: OFF DUTY'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-[500px]">
          <IncidentMap helpRequests={assignedTasks} zoom={8} />
        </div>

        <div className="glass-panel p-6 rounded-2xl flex flex-col h-[500px]">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Navigation className="text-blue-400" size={20} />
            Assigned Rescue Tasks ({assignedTasks.length})
          </h2>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {loading ? (
              <div className="text-center py-12 text-slate-500">Loading assigned dispatch tasks...</div>
            ) : assignedTasks.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <CheckCircle size={40} className="mx-auto mb-2 text-slate-600" />
                <p>No pending tasks assigned to you right now.</p>
              </div>
            ) : (
              assignedTasks.map((task) => (
                <div key={task.id} className="glass-card p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2.5 py-1 bg-red-500/20 text-red-400 rounded-full">
                      {task.category}
                    </span>
                    <span className="text-[11px] text-amber-400 font-bold">Priority: {task.priorityScore}/10</span>
                  </div>
                  <p className="text-xs text-slate-300">{task.description || 'Emergency rescue requested'}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}