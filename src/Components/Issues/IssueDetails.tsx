import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Clock, Users, MessageCircle, ThumbsUp, Share2, Flag, ChevronLeft, ChevronRight, Send, CheckCircle, AlertTriangle, Eye, PenTool as Tool } from 'lucide-react';
import { Issue, Comment } from '../../types';
import { formatDistanceToNow, format } from 'date-fns';

interface IssueDetailsProps {
  issue: Issue | null;
  onClose: () => void;
  onSupportClick: (issueId: string) => void;
  onAddComment: (issueId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => void;
  currentUser?: any;
}

export const IssueDetails: React.FC<IssueDetailsProps> = ({
  issue,
  onClose,
  onSupportClick,
  onAddComment,
  currentUser
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [showProgressImages, setShowProgressImages] = useState<'before' | 'after' | null>(null);

  if (!issue) return null;

  const getStatusConfig = (status: string) => {
    const configs = {
      reported: { 
        color: 'text-red-600 bg-red-100 border-red-200',
        icon: AlertTriangle,
        label: 'Reported',
        description: 'Issue has been reported and is pending verification'
      },
      verified: { 
        color: 'text-yellow-600 bg-yellow-100 border-yellow-200',
        icon: Eye,
        label: 'Verified',
        description: 'Issue has been verified by authorities'
      },
      'in-progress': { 
        color: 'text-blue-600 bg-blue-100 border-blue-200',
        icon: Tool,
        label: 'In Progress',
        description: 'Work is currently in progress to resolve this issue'
      },
      resolved: { 
        color: 'text-green-600 bg-green-100 border-green-200',
        icon: CheckCircle,
        label: 'Resolved',
        description: 'Issue has been successfully resolved'
      },
      closed: { 
        color: 'text-gray-600 bg-gray-100 border-gray-200',
        icon: CheckCircle,
        label: 'Closed',
        description: 'Issue has been closed'
      }
    };
    return configs[status as keyof typeof configs] || configs.reported;
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
  const StatusIcon = statusConfig.icon;
  const isSupported = currentUser && issue.supportedBy.includes(currentUser.id);

  const handleAddComment = () => {
    if (commentText.trim() && currentUser) {
      onAddComment(issue.id, {
        userId: currentUser.id,
        userName: currentUser.name,
        userAvatar: currentUser.avatar,
        content: commentText.trim()
      });
      setCommentText('');
    }
  };

  const nextImage = () => {
    if (issue.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % issue.images.length);
    }
  };

  const prevImage = () => {
    if (issue.images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + issue.images.length) % issue.images.length);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex justify-between items-start p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-start space-x-4">
              <span className="text-3xl">{getCategoryIcon(issue.category)}</span>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {issue.title}
                </h2>
                <div className="flex items-center space-x-3">
                  <div className={`flex items-center px-3 py-1 rounded-full border ${statusConfig.color} text-sm font-medium`}>
                    <StatusIcon className="w-4 h-4 mr-1" />
                    {statusConfig.label}
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                    {issue.category.replace('-', ' ')} • {issue.priority} priority
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Share2 className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Flag className="w-5 h-5" />
              </motion.button>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col lg:flex-row max-h-[calc(95vh-120px)]">
            {/* Left Panel - Images and Details */}
            <div className="lg:w-1/2 p-6 space-y-6 overflow-y-auto">
              {/* Image Gallery */}
              {issue.images.length > 0 && (
                <div className="relative">
                  <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden">
                    <img
                      src={issue.images[currentImageIndex]}
                      alt={`${issue.title} - Image ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover"
                    />
                    
                    {issue.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                        
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-sm">
                          {currentImageIndex + 1} / {issue.images.length}
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Thumbnail Strip */}
                  {issue.images.length > 1 && (
                    <div className="flex space-x-2 mt-2 overflow-x-auto">
                      {issue.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                            currentImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                          }`}
                        >
                          <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Progress Images */}
              {issue.progressImages && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Progress Images</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Before</h4>
                      <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                        <img
                          src={issue.progressImages.before[0]}
                          alt="Before"
                          className="w-full h-full object-cover cursor-pointer"
                          onClick={() => setShowProgressImages('before')}
                        />
                      </div>
                    </div>
                    {issue.progressImages.after.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">After</h4>
                        <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                          <img
                            src={issue.progressImages.after[0]}
                            alt="After"
                            className="w-full h-full object-cover cursor-pointer"
                            onClick={() => setShowProgressImages('after')}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{issue.description}</p>
              </div>

              {/* Location */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Location</h3>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{issue.location.address}</span>
                </div>
              </div>

              {/* Reporter Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Reported By</h3>
                <div className="flex items-center space-x-3">
                  <img
                    src={issue.reportedBy.avatar || `https://ui-avatars.com/api/?name=${issue.reportedBy.name}&size=40`}
                    alt={issue.reportedBy.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{issue.reportedBy.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {format(issue.reportedAt, 'MMM dd, yyyy • h:mm a')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Timeline and Comments */}
            <div className="lg:w-1/2 border-l border-gray-200 dark:border-gray-700 p-6 space-y-6 overflow-y-auto">
              {/* Actions */}
              <div className="flex items-center space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onSupportClick(issue.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    isSupported
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-700 border border-gray-200 hover:border-blue-200'
                  }`}
                >
                  <ThumbsUp className={`w-4 h-4 ${isSupported ? 'fill-current' : ''}`} />
                  <span>{isSupported ? 'Supported' : 'Support'} ({issue.supportCount})</span>
                </motion.button>
              </div>

              {/* Status Info */}
              <div className={`p-4 rounded-lg border ${statusConfig.color}`}>
                <div className="flex items-center space-x-2 mb-2">
                  <StatusIcon className="w-5 h-5" />
                  <span className="font-semibold">{statusConfig.label}</span>
                </div>
                <p className="text-sm opacity-80">{statusConfig.description}</p>
                {issue.assignedTo && (
                  <p className="text-sm mt-2">
                    <span className="font-medium">Assigned to:</span> {issue.assignedTo}
                  </p>
                )}
              </div>

              {/* Timeline */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Timeline</h3>
                <div className="space-y-4">
                  {issue.timeline.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start space-x-3"
                    >
                      <div className={`w-3 h-3 rounded-full mt-2 ${
                        event.type === 'resolved' ? 'bg-green-500' :
                        event.type === 'assigned' ? 'bg-blue-500' :
                        event.type === 'verified' ? 'bg-yellow-500' :
                        'bg-gray-400'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {event.description}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {format(event.date, 'MMM dd, yyyy • h:mm a')}
                          {event.by && ` • by ${event.by}`}
                        </p>
                        {event.images && event.images.length > 0 && (
                          <div className="mt-2">
                            <img
                              src={event.images[0]}
                              alt="Timeline update"
                              className="w-24 h-24 object-cover rounded-lg"
                            />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Comments */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Comments ({issue.comments.length})
                </h3>
                
                {/* Add Comment */}
                {currentUser && (
                  <div className="mb-4">
                    <div className="flex space-x-3">
                      <img
                        src={currentUser.avatar || `https://ui-avatars.com/api/?name=${currentUser.name}&size=32`}
                        alt={currentUser.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <textarea
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder="Add a comment..."
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          rows={3}
                        />
                        <div className="flex justify-end mt-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleAddComment}
                            disabled={!commentText.trim()}
                            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                          >
                            <Send className="w-4 h-4" />
                            <span>Comment</span>
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Comments List */}
                <div className="space-y-4">
                  {issue.comments.map((comment) => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex space-x-3"
                    >
                      <img
                        src={comment.userAvatar || `https://ui-avatars.com/api/?name=${comment.userName}&size=32`}
                        alt={comment.userName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-gray-900 dark:text-white text-sm">
                            {comment.userName}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">{comment.content}</p>
                      </div>
                    </motion.div>
                  ))}
                  
                  {issue.comments.length === 0 && (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                      No comments yet. Be the first to comment!
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};