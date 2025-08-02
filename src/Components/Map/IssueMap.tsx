import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { Icon } from 'leaflet';
import { motion } from 'framer-motion';
import { Issue } from '../../types';
import { formatDistanceToNow } from 'date-fns';
import { MapPin, Users, Clock, AlertCircle } from 'lucide-react';

// Fix for default markers
import 'leaflet/dist/leaflet.css';

// Custom marker icons
const createMarkerIcon = (status: string, category: string) => {
  const colors = {
    reported: '#ef4444',
    verified: '#f59e0b',
    'in-progress': '#3b82f6',
    resolved: '#10b981',
    closed: '#6b7280'
  };

  const color = colors[status as keyof typeof colors] || '#6b7280';
  
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="25" height="25" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12.5" cy="12.5" r="10" fill="${color}" stroke="white" stroke-width="2"/>
        <circle cx="12.5" cy="12.5" r="6" fill="white"/>
        <circle cx="12.5" cy="12.5" r="3" fill="${color}"/>
      </svg>
    `)}`,
    iconSize: [25, 25],
    iconAnchor: [12.5, 12.5],
    popupAnchor: [0, -12]
  });
};

interface IssueMapProps {
  issues: Issue[];
  onIssueClick: (issue: Issue) => void;
  userLocation?: { lat: number; lng: number };
  geofenceRadius?: number;
}

export const IssueMap: React.FC<IssueMapProps> = ({ 
  issues, 
  onIssueClick, 
  userLocation = { lat: 40.7128, lng: -74.0060 },
  geofenceRadius = 5000
}) => {
  const mapRef = useRef<any>(null);

  const getStatusColor = (status: string) => {
    const colors = {
      reported: 'text-red-600 bg-red-100',
      verified: 'text-yellow-600 bg-yellow-100',
      'in-progress': 'text-blue-600 bg-blue-100',
      resolved: 'text-green-600 bg-green-100',
      closed: 'text-gray-600 bg-gray-100'
    };
    return colors[status as keyof typeof colors] || 'text-gray-600 bg-gray-100';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'border-green-400',
      medium: 'border-yellow-400',
      high: 'border-orange-400',
      critical: 'border-red-400'
    };
    return colors[priority as keyof typeof colors] || 'border-gray-400';
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      pothole: '🕳️',
      garbage: '🗑️',
      'water-leak': '💧',
      'street-light': '💡',
      drainage: '🌊',
      'road-damage': '🛣️',
      noise: '🔊',
      'illegal-parking': '🚗',
      other: '❓'
    };
    return icons[category as keyof typeof icons] || '❓';
  };

  useEffect(() => {
    if (mapRef.current && issues.length > 0) {
      const bounds = issues.map(issue => [issue.location.lat, issue.location.lng]);
      if (bounds.length > 0) {
        mapRef.current.fitBounds(bounds, { padding: [20, 20] });
      }
    }
  }, [issues]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="h-full w-full rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700"
    >
      <MapContainer
        ref={mapRef}
        center={[userLocation.lat, userLocation.lng]}
        zoom={13}
        className="h-full w-full"
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Geofence Circle */}
        <Circle
          center={[userLocation.lat, userLocation.lng]}
          radius={geofenceRadius}
          pathOptions={{
            color: '#3b82f6',
            fillColor: '#3b82f6',
            fillOpacity: 0.1,
            weight: 2,
            dashArray: '5, 5'
          }}
        />

        {/* Issue Markers */}
        {issues.map((issue) => (
          <Marker
            key={issue.id}
            position={[issue.location.lat, issue.location.lng]}
            icon={createMarkerIcon(issue.status, issue.category)}
          >
            <Popup className="issue-popup" maxWidth={300}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-2"
              >
                <div className={`border-l-4 ${getPriorityColor(issue.priority)} pl-3 mb-3`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 text-sm">{issue.title}</h3>
                    <span className="text-xl">{getCategoryIcon(issue.category)}</span>
                  </div>
                  
                  <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
                    {issue.status.replace('-', ' ').toUpperCase()}
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{issue.description}</p>

                <div className="space-y-2 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{issue.location.address}</span>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Users className="w-3 h-3" />
                      <span>{issue.supportCount} supporters</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatDistanceToNow(issue.reportedAt, { addSuffix: true })}</span>
                    </div>
                  </div>

                  {issue.priority === 'critical' && (
                    <div className="flex items-center space-x-1 text-red-600">
                      <AlertCircle className="w-3 h-3" />
                      <span className="font-medium">Critical Priority</span>
                    </div>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onIssueClick(issue)}
                  className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                >
                  View Details
                </motion.button>
              </motion.div>
            </Popup>
          </Marker>
        ))}

        {/* User Location Marker */}
        <Marker
          position={[userLocation.lat, userLocation.lng]}
          icon={new Icon({
            iconUrl: `data:image/svg+xml;base64,${btoa(`
              <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <circle cx="10" cy="10" r="8" fill="#3b82f6" stroke="white" stroke-width="2"/>
                <circle cx="10" cy="10" r="3" fill="white"/>
              </svg>
            `)}`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
          })}
        >
          <Popup>
            <div className="text-center">
              <p className="font-semibold text-blue-600">Your Location</p>
              <p className="text-xs text-gray-500">Showing issues within {geofenceRadius/1000}km radius</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </motion.div>
  );
};
