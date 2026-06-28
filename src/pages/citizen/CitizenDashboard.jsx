import React, { useEffect, useState } from 'react';
import { helpRequestService } from '../../services/helpRequestService';
import { disasterService } from '../../services/disasterService';
import IncidentMap from '../../components/map/IncidentMap';
import { ShieldAlert, PlusCircle, Clock, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CitizenDashboard() {
  const [myRequests, setMyRequests] = useState([]);
  const [activeDisasters, setActiveDisasters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [reqRes, disRes] = await Promise.all([
        helpRequestService.getMyHelpRequests(),
        disasterService.getActiveDisasters(),
      ]);
      if (reqRes.success) setMyRequests(reqRes.data);
      if (disRes.success) setActiveDisasters(disRes.data);
    } catch (err) {
      console.error('Error loading citizen dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShieldAlert className="text-blue-500" size={28} />
            Citizen Emergency Response Hub
          </h1>
          <p className="text-xs text-slate-400 mt-1">Lodge emergency requests and monitor real-time rescue operations</p>
        </div>
        <Link
          to="/citizen/lodge-request"
          className="px-5 py-3 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-red-600/30 transition-all"
        >
          <PlusCircle size={20} />
          <span>Lodge Emergency Help Request</span>
        </Link>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Incident Map */}
        <div className="lg:col-span-2 h-[500px]">
          <IncidentMap disasters={activeDisasters} helpRequests={myRequests} zoom={6} />
        </div>

        {/* Right 1 Col: My Emergency Requests Track Panel */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col h-[500px]">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Clock className="text-amber-500" size={20} />
            My Lodged Requests ({myRequests.length})
          </h2>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {loading ? (
              <div className="text-center py-12 text-slate-500">Loading request status...</div>
            ) : myRequests.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <CheckCircle2 size={40} className="mx-auto mb-2 text-slate-600" />
                <p>No active help requests lodged.</p>
              </div>
            ) : (
              myRequests.map((req) => (
                <div key={req.id} className="glass-card p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2.5 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full">
                      {req.category}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      req.status === 'RESOLVED' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {req.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-2">{req.description || 'No additional details'}</p>
                  <div className="text-[11px] text-slate-400 flex justify-between items-center pt-2 border-t border-slate-800">
                    <span>Family: {req.familyMembersCount}</span>
                    <span className="text-amber-400 font-semibold">Priority Score: {req.priorityScore}/10</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}