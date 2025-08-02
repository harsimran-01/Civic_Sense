import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  MapPin, 
  Camera, 
  Upload, 
  Mic, 
  QrCode,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { Issue, IssueCategory, IssuePriority } from '../../types';

interface ReportIssueFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (issue: Omit<Issue, 'id' | 'reportedAt' | 'updatedAt' | 'supportCount' | 'supportedBy' | 'comments' | 'timeline'>) => void;
  currentUser: any;
}

const categories: { value: IssueCategory; label: string; icon: string; description: string }[] = [
  { value: 'pothole', label: 'Pothole', icon: '🕳️', description: 'Road damage or holes' },
  { value: 'garbage', label: 'Garbage', icon: '🗑️', description: 'Waste management issues' },
  { value: 'water-leak', label: 'Water Leak', icon: '💧', description: 'Plumbing or water supply issues' },
  { value: 'street-light', label: 'Street Light', icon: '💡', description: 'Public lighting problems' },
  { value: 'drainage', label: 'Drainage', icon: '🌊', description: 'Water drainage and flooding' },
  { value: 'road-damage', label: 'Road Damage', icon: '🛣️', description: 'General road surface issues' },
  { value: 'noise', label: 'Noise Pollution', icon: '🔊', description: 'Excessive noise complaints' },
  { value: 'illegal-parking', label: 'Illegal Parking', icon: '🚗', description: 'Vehicle parking violations' },
  { value: 'other', label: 'Other', icon: '❓', description: 'Other civic issues' }
];

const priorities: { value: IssuePriority; label: string; color: string; description: string }[] = [
  { value: 'low', label: 'Low', color: 'text-green-600 bg-green-100', description: 'Non-urgent issue' },
  { value: 'medium', label: 'Medium', color: 'text-yellow-600 bg-yellow-100', description: 'Moderate concern' },
  { value: 'high', label: 'High', color: 'text-orange-600 bg-orange-100', description: 'Needs attention soon' },
  { value: 'critical', label: 'Critical', color: 'text-red-600 bg-red-100', description: 'Immediate action required' }
];

export const ReportIssueForm: React.FC<ReportIssueFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentUser
}) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'other' as IssueCategory,
    priority: 'medium' as IssuePriority,
    images: [] as string[],
    voiceNote: '',
    location: {
      lat: 40.7128,
      lng: -74.0060,
      address: 'Current Location'
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    // Simulate image upload - in reality, you'd upload to a service
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, e.target!.result as string]
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files) {
      Array.from(files).forEach((file) => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target?.result) {
              setFormData(prev => ({
                ...prev,
                images: [...prev.images, e.target!.result as string]
              }));
            }
          };
          reader.readAsDataURL(file);
        }
      });
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              address: `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`
            }
          }));
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const issue = {
        ...formData,
        status: 'reported' as const,
        reportedBy: currentUser,
        assignedTo: undefined
      };
      
      onSubmit(issue);
      onClose();
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'other',
        priority: 'medium',
        images: [],
        voiceNote: '',
        location: {
          lat: 40.7128,
          lng: -74.0060,
          address: 'Current Location'
        }
      });
      setStep(1);
    } catch (error) {
      console.error('Error submitting issue:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  return (
    <AnimatePresence>
      {isOpen && (
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
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Report Issue</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Help improve your community</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Progress Steps */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center space-x-4">
                {[1, 2, 3].map((stepNumber) => (
                  <div key={stepNumber} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step >= stepNumber 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      {step > stepNumber ? <CheckCircle className="w-4 h-4" /> : stepNumber}
                    </div>
                    {stepNumber < 3 && (
                      <div className={`w-12 h-1 mx-2 ${
                        step > stepNumber ? 'bg-blue-600' : 'bg-gray-300'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Step {step} of 3: {
                  step === 1 ? 'Issue Details' :
                  step === 2 ? 'Category & Location' :
                  'Review & Submit'
                }
              </div>
            </div>

            {/* Form Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <AnimatePresence mode="wait">
                {/* Step 1: Issue Details */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Issue Title *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Brief description of the issue"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Detailed Description *
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Provide more details about the issue, when you noticed it, and how it affects the community"
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Priority Level
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {priorities.map((priority) => (
                          <motion.button
                            key={priority.value}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, priority: priority.value }))}
                            className={`p-3 rounded-lg border text-left transition-colors ${
                              formData.priority === priority.value
                                ? `${priority.color} border-current`
                                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                            }`}
                          >
                            <div className="font-medium">{priority.label}</div>
                            <div className="text-xs opacity-75 mt-1">{priority.description}</div>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Category & Location */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Issue Category *
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {categories.map((category) => (
                          <motion.button
                            key={category.value}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, category: category.value }))}
                            className={`p-3 rounded-lg border text-left transition-colors ${
                              formData.category === category.value
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                            }`}
                          >
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-lg">{category.icon}</span>
                              <span className="font-medium">{category.label}</span>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {category.description}
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Location
                      </label>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                          <MapPin className="w-4 h-4" />
                          <span>{formData.location.address}</span>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="button"
                          onClick={getCurrentLocation}
                          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                          <MapPin className="w-4 h-4" />
                          <span>Use Current Location</span>
                        </motion.button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Photos (Optional but recommended)
                      </label>
                      
                      {/* Drag & Drop Area */}
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                          isDragOver 
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                        }`}
                      >
                        <Camera className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          Drag photos here or click to upload
                        </p>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <motion.label
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          htmlFor="image-upload"
                          className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg cursor-pointer transition-colors"
                        >
                          <Upload className="w-4 h-4" />
                          <span>Choose Files</span>
                        </motion.label>
                      </div>

                      {/* Image Previews */}
                      {formData.images.length > 0 && (
                        <div className="grid grid-cols-3 gap-3 mt-3">
                          {formData.images.map((image, index) => (
                            <div key={index} className="relative">
                              <img
                                src={image}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-20 object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => setFormData(prev => ({
                                  ...prev,
                                  images: prev.images.filter((_, i) => i !== index)
                                }))}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Additional Options */}
                    <div className="flex space-x-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <Mic className="w-4 h-4" />
                        <span>Voice Note</span>
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <QrCode className="w-4 h-4" />
                        <span>QR Code</span>
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Review & Submit */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Review Your Report</h3>
                      
                      <div className="space-y-3 text-sm">
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">Title:</span>
                          <span className="ml-2 text-gray-600 dark:text-gray-400">{formData.title}</span>
                        </div>
                        
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">Category:</span>
                          <span className="ml-2 text-gray-600 dark:text-gray-400 capitalize">
                            {categories.find(c => c.value === formData.category)?.label}
                          </span>
                        </div>
                        
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">Priority:</span>
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                            priorities.find(p => p.value === formData.priority)?.color
                          }`}>
                            {priorities.find(p => p.value === formData.priority)?.label}
                          </span>
                        </div>
                        
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">Description:</span>
                          <p className="ml-2 text-gray-600 dark:text-gray-400 mt-1">{formData.description}</p>
                        </div>
                        
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">Images:</span>
                          <span className="ml-2 text-gray-600 dark:text-gray-400">
                            {formData.images.length} photo(s) attached
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <div className="flex items-start space-x-2">
                        <AlertTriangle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-800 dark:text-blue-200">
                          <p className="font-medium mb-1">Before submitting:</p>
                          <ul className="list-disc list-inside space-y-1">
                            <li>Ensure all information is accurate</li>
                            <li>Check that images clearly show the issue</li>
                            <li>Your report will be publicly visible</li>
                            <li>You'll receive updates on the resolution progress</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center p-6 border-t border-gray-200 dark:border-gray-700">
              <div>
                {step > 1 && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={prevStep}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                  >
                    Previous
                  </motion.button>
                )}
              </div>
              
              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </motion.button>
                
                {step < 3 ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={nextStep}
                    disabled={
                      (step === 1 && (!formData.title || !formData.description)) ||
                      (step === 2 && !formData.category)
                    }
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors"
                  >
                    Next
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Submit Report</span>
                      </>
                    )}
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

