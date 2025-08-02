import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Users, MessageCircle, ThumbsUp, AlertTriangle, CheckCircle, Eye, PenTool as Tool } from 'lucide-react';
import { Issue } from '../../types';
import { formatDistanceToNow } from 'date-fns';

interface IssueCardProps {
  issue: Issue;
  onSupportClick: (issueId: string) => void;
  onViewClick: (issue: Issue) => void;
  currentUserId?: string;
}

export const IssueCard: React.FC<IssueCardProps> = ({
  issue,
  onSupportClick,
  onViewClick,
  currentUserId
}) => {
  const getStatusConfig = (status: string) => {
    const configs = {
      reported: { 
        color: 'text-red-600 bg-red-100 border-red-200',
        icon: AlertTriangle,
        label: 'Reported'
      },
      verified: { 
        color: 'text-yellow-600 bg-yellow-100 border-yellow-200',
        icon: Eye,
        label: 'Verified'
      },
      'in-progress': { 
        color: 'text-blue-600 bg-blue-100 border-blue-200',
        icon: Tool,
        label: 'In Progress'
      },
      resolved: { 
        color: 'text-green-600 bg-green-100 border-green-200',
        icon: CheckCircle,
        label: 'Resolved'
      },
      closed: { 
        color: 'text-gray-600 bg-gray-100 border-gray-200',
        icon: CheckCircle,
        label: 'Closed'
      }
    };
    return configs[status as keyof typeof configs] || configs.reported;
  };

  const getPriorityConfig = (priority: string) => {
    const configs = {
      low: { color: 'border-green-400', label: 'Low', bg: 'bg-green-50' },
      medium: { color: 'border-yellow-400', label: 'Medium', bg: 'bg-yellow-50' },
      high: { color: 'border-orange-400', label: 'High', bg: 'bg-orange-50' },
      critical: { color: 'border-red-400', label: 'Critical', bg: 'bg-red-50' }
    };
    return configs[priority as keyof typeof configs] || configs.low;
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

  const statusConfig = getStatusConfig(issue.status);
  const priorityConfig = getPriorityConfig(issue.priority);
  const StatusIcon = statusConfig.icon;
  const isSupported = currentUserId && issue.supportedBy.includes(currentUserId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, boxShadow: "0 8px 25px rgba(0,0,0,0.1)" }}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-md border-l-4 ${priorityConfig.color} overflow-hidden cursor-pointer transition-all duration-200`}
      onClick={() => onViewClick(issue)}
    >
      {/* Header */}
      <div className="p-4 pb-2">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{getCategoryIcon(issue.category)}</span>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg leading-tight">
                {issue.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                {issue.category.replace('-', ' ')}
              </p>
            </div>
          </div>
          
          <div className={`flex items-center px-2 py-1 rounded-full border ${statusConfig.color} text-xs font-medium`}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {statusConfig.label}
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-3">
          {issue.description}
        </p>

        {/* Image */}
        {issue.images.length > 0 && (
          <div className="mb-3">
            <img
              src={issue.images[0]}
              alt={issue.title}
              className="w-full h-32 object-cover rounded-lg"
            />
            {issue.images.length > 1 && (
              <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs">
                +{issue.images.length - 1} more
              </div>
            )}
          </div>
        )}

        {/* Location */}
        <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="truncate">{issue.location.address}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-100 dark:border-gray-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{formatDistanceToNow(issue.reportedAt, { addSuffix: true })}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <MessageCircle className="w-4 h-4" />
              <span>{issue.comments.length}</span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onSupportClick(issue.id);
            }}
            className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              isSupported
                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                : 'bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-700 border border-gray-200 hover:border-blue-200'
            }`}
          >
            <ThumbsUp className={`w-4 h-4 ${isSupported ? 'fill-current' : ''}`} />
            <span>{issue.supportCount}</span>
          </motion.button>
        </div>

        {/* Reporter Info */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-center space-x-2">
            <img
              src={issue.reportedBy.avatar || `https://ui-avatars.com/api/?name=${issue.reportedBy.name}&size=24`}
              alt={issue.reportedBy.name}
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {issue.reportedBy.name}
            </span>
          </div>

          {issue.priority === 'critical' && (
            <span className="text-xs text-red-600 dark:text-red-400 font-medium bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded-full">
              Critical
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
