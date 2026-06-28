import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function IncidentMap({ disasters = [], shelters = [], helpRequests = [], center = [20.5937, 78.9629], zoom = 5 }) {
  return (
    <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-slate-800/80 relative">
      <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} className="w-full h-full z-0">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {disasters.map((disaster) => (
          <React.Fragment key={disaster.id}>
            <Circle
              center={[disaster.latitude, disaster.longitude]}
              radius={disaster.radiusKm * 1000}
              pathOptions={{
                color: disaster.severityLevel === 'CRITICAL' ? '#ef4444' : '#f59e0b',
                fillColor: disaster.severityLevel === 'CRITICAL' ? '#ef4444' : '#f59e0b',
                fillOpacity: 0.25,
              }}
            />
            <Marker position={[disaster.latitude, disaster.longitude]}>
              <Popup>
                <div className="p-1 text-slate-900">
                  <h3 className="font-bold text-sm">{disaster.title}</h3>
                  <p className="text-xs text-slate-600">{disaster.description}</p>
                </div>
              </Popup>
            </Marker>
          </React.Fragment>
        ))}

        {helpRequests.map((req) => (
          <Marker key={req.id} position={[req.latitude, req.longitude]}>
            <Popup>
              <div className="p-1 text-slate-900">
                <h3 className="font-bold text-sm">🆘 {req.category} Help Needed</h3>
                <p className="text-xs text-slate-600">{req.description}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}