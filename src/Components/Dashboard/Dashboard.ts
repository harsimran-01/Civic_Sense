

import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  MapPin,
  Award
} from 'lucide-react';
import { Issue } from '../../types';
import { formatDistanceToNow } from 'date-fns';

interface DashboardProps {
  issues: Issue[];
  user: any;
  // onNavigate: (view: string) => void;
  onNavigate: (view: 'dashboard' | 'report' | 'map') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ issues, user, onNavigate }) => {
  const stats = {
    totalReports: issues.length,
    myReports: issues.filter(issue => issue.reportedBy.id === user?.id).length,
    resolvedReports: issues.filter(issue => issue.status === 'resolved').length,
    inProgressReports: issues.filter(issue => issue.status === 'in-progress').length,
    supportGiven: issues.reduce((sum, issue) => sum + (issue.supportedBy.includes(user?.id || '') ? 1 : 0), 0)
  };

  const recentIssues = issues.slice(0, 5);
  const myRecentIssues = issues.filter(issue => issue.reportedBy.id === user?.id).slice(0, 3);

  const StatCard = ({ icon: Icon, title, value, subtitle, color }: any) => (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-2xl"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-blue-100 text-lg">
              Thank you for making your community better. You have {user?.points} points!
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{user?.reportsCount}</div>
              <div className="text-sm text-blue-200">Reports Made</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{user?.badges?.length || 0}</div>
              <div className="text-sm text-blue-200">Badges Earned</div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mt-6">
{/*           <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate('report')}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Report New Issue
          </motion.button> */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate('map')}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            View Map
          </motion.button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={TrendingUp} title="Total Reports" value={stats.totalReports} subtitle="Community-wide" color="bg-blue-500" />
        <StatCard icon={CheckCircle} title="Resolved" value={stats.resolvedReports} subtitle={`${Math.round((stats.resolvedReports / stats.totalReports) * 100)}% success rate`} color="bg-green-500" />
        <StatCard icon={Clock} title="In Progress" value={stats.inProgressReports} subtitle="Being worked on" color="bg-yellow-500" />
        <StatCard icon={Users} title="My Support" value={stats.supportGiven} subtitle="Issues supported" color="bg-purple-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Community Issues</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</button>
          </div>
          <div className="space-y-4">
            {recentIssues.map((issue) => (
              <motion.div key={issue.id} whileHover={{ x: 4 }} className="flex items-start space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer">
                <div className={`w-3 h-3 rounded-full mt-2 ${issue.status === 'resolved' ? 'bg-green-500' : issue.status === 'in-progress' ? 'bg-blue-500' : issue.status === 'verified' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white truncate">{issue.title}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500 dark:text-gray-400 truncate">{issue.location.address}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">{formatDistanceToNow(issue.reportedAt, { addSuffix: true })}</span>
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Users className="w-3 h-3" />
                      <span>{issue.supportCount}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">My Recent Reports</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</button>
          </div>
          {myRecentIssues.length > 0 ? (
            <div className="space-y-4">
              {myRecentIssues.map((issue) => (
                <motion.div key={issue.id} whileHover={{ x: 4 }} className="flex items-start space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer">
                  <div className={`w-3 h-3 rounded-full mt-2 ${issue.status === 'resolved' ? 'bg-green-500' : issue.status === 'in-progress' ? 'bg-blue-500' : issue.status === 'verified' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">{issue.title}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${issue.status === 'resolved' ? 'bg-green-100 text-green-700' : issue.status === 'in-progress' ? 'bg-blue-100 text-blue-700' : issue.status === 'verified' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{issue.status.replace('-', ' ').toUpperCase()}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{formatDistanceToNow(issue.reportedAt, { addSuffix: true })}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">You haven't reported any issues yet.</p>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Report Your First Issue
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
            <Award className="w-6 h-6 text-yellow-500" />
            <span>Your Achievements</span>
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">{user?.points} points earned</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {user?.badges && user.badges.length > 0 ? (
            user.badges.map((badge: any) => (
              <motion.div key={badge.id} whileHover={{ scale: 1.05 }} className="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div className="text-center">
                  <div className="text-2xl mb-2">{badge.icon}</div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{badge.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{badge.description}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Earned {formatDistanceToNow(badge.earnedAt, { addSuffix: true })}</p>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-3 text-center py-8">
              <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">Start reporting issues to earn your first badge!</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
// import React, { useEffect, useState } from 'react';
// import { motion } from 'framer-motion';
// import {
//   TrendingUp,
//   Users,
//   CheckCircle,
//   Clock,
//   AlertTriangle,
//   MapPin,
//   Award,
// } from 'lucide-react';
// import { Issue } from '../../types';
// import { formatDistanceToNow } from 'date-fns';

// interface DashboardProps {
//   user: any;
//   onNavigate: (view: 'dashboard' | 'report' | 'map') => void;
// }

// export const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate }) => {
//   const [issues, setIssues] = useState<Issue[]>(() => {
//     const stored = localStorage.getItem('issues');
//     return stored ? JSON.parse(stored) : [];
//   });

//   // Save to localStorage whenever issues change
//   useEffect(() => {
//     localStorage.setItem('issues', JSON.stringify(issues));
//   }, [issues]);

//   // Optional: Expose a way to add new issue from Report form
//   const handleAddIssue = (newIssue: Issue) => {
//     setIssues((prev) => [newIssue, ...prev]);
//   };

//   const stats = {
//     totalReports: issues.length,
//     myReports: issues.filter((issue) => issue.reportedBy.id === user?.id).length,
//     resolvedReports: issues.filter((issue) => issue.status === 'resolved').length,
//     inProgressReports: issues.filter((issue) => issue.status === 'in-progress').length,
//     supportGiven: issues.reduce(
//       (sum, issue) => sum + (issue.supportedBy.includes(user?.id || '') ? 1 : 0),
//       0
//     ),
//   };

//   const recentIssues = issues.slice(0, 5);
//   const myRecentIssues = issues
//     .filter((issue) => issue.reportedBy.id === user?.id)
//     .slice(0, 3);

//   const StatCard = ({ icon: Icon, title, value, subtitle, color }: any) => (
//     <motion.div
//       whileHover={{ scale: 1.02, y: -2 }}
//       className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
//     >
//       <div className="flex items-center space-x-4">
//         <div className={`p-3 rounded-xl ${color}`}>
//           <Icon className="w-6 h-6 text-white" />
//         </div>
//         <div>
//           <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
//           <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</p>
//           {subtitle && (
//             <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
//           )}
//         </div>
//       </div>
//     </motion.div>
//   );

//   return (
//     <div className="space-y-8">
//       {/* Welcome Banner */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-2xl"
//       >
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-3xl font-bold mb-2">
//               Welcome back, {user?.name?.split(' ')[0]}! 👋
//             </h1>
//             <p className="text-blue-100 text-lg">
//               Thank you for making your community better. You have {user?.points} points!
//             </p>
//           </div>
//           <div className="hidden md:flex items-center space-x-4">
//             <div className="text-center">
//               <div className="text-2xl font-bold">{user?.reportsCount}</div>
//               <div className="text-sm text-blue-200">Reports Made</div>
//             </div>
//             <div className="text-center">
//               <div className="text-2xl font-bold">{user?.badges?.length || 0}</div>
//               <div className="text-sm text-blue-200">Badges Earned</div>
//             </div>
//           </div>
//         </div>

//         <div className="flex flex-wrap gap-4 mt-6">
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => onNavigate('map')}
//             className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg font-medium transition-colors"
//           >
//             View Map
//           </motion.button>
//         </div>
//       </motion.div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <StatCard
//           icon={TrendingUp}
//           title="Total Reports"
//           value={stats.totalReports}
//           subtitle="Community-wide"
//           color="bg-blue-500"
//         />
//         <StatCard
//           icon={CheckCircle}
//           title="Resolved"
//           value={stats.resolvedReports}
//           subtitle={`${Math.round(
//             (stats.resolvedReports / (stats.totalReports || 1)) * 100
//           )}% success rate`}
//           color="bg-green-500"
//         />
//         <StatCard
//           icon={Clock}
//           title="In Progress"
//           value={stats.inProgressReports}
//           subtitle="Being worked on"
//           color="bg-yellow-500"
//         />
//         <StatCard
//           icon={Users}
//           title="My Support"
//           value={stats.supportGiven}
//           subtitle="Issues supported"
//           color="bg-purple-500"
//         />
//       </div>

//       {/* Recent Issues */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         <motion.div
//           initial={{ opacity: 0, x: -20 }}
//           animate={{ opacity: 1, x: 0 }}
//           className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
//         >
//           <div className="flex items-center justify-between mb-6">
//             <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
//               Recent Community Issues
//             </h3>
//             <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
//               View All
//             </button>
//           </div>
//           <div className="space-y-4">
//             {recentIssues.map((issue) => (
//               <motion.div
//                 key={issue.id}
//                 whileHover={{ x: 4 }}
//                 className="flex items-start space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
//               >
//                 <div
//                   className={`w-3 h-3 rounded-full mt-2 ${
//                     issue.status === 'resolved'
//                       ? 'bg-green-500'
//                       : issue.status === 'in-progress'
//                       ? 'bg-blue-500'
//                       : issue.status === 'verified'
//                       ? 'bg-yellow-500'
//                       : 'bg-red-500'
//                   }`}
//                 />
//                 <div className="flex-1 min-w-0">
//                   <p className="font-medium text-gray-900 dark:text-white truncate">
//                     {issue.title}
//                   </p>
//                   <div className="flex items-center space-x-2 mt-1">
//                     <MapPin className="w-3 h-3 text-gray-400" />
//                     <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
//                       {issue.location.address}
//                     </span>
//                   </div>
//                   <div className="flex items-center justify-between mt-2">
//                     <span className="text-xs text-gray-500 dark:text-gray-400">
//                       {formatDistanceToNow(issue.reportedAt, { addSuffix: true })}
//                     </span>
//                     <div className="flex items-center space-x-1 text-xs text-gray-500">
//                       <Users className="w-3 h-3" />
//                       <span>{issue.supportCount}</span>
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </motion.div>

//         {/* My Recent Issues */}
//         <motion.div
//           initial={{ opacity: 0, x: 20 }}
//           animate={{ opacity: 1, x: 0 }}
//           className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
//         >
//           <div className="flex items-center justify-between mb-6">
//             <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
//               My Recent Reports
//             </h3>
//             <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
//               View All
//             </button>
//           </div>
//           {myRecentIssues.length > 0 ? (
//             <div className="space-y-4">
//               {myRecentIssues.map((issue) => (
//                 <motion.div
//                   key={issue.id}
//                   whileHover={{ x: 4 }}
//                   className="flex items-start space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
//                 >
//                   <div
//                     className={`w-3 h-3 rounded-full mt-2 ${
//                       issue.status === 'resolved'
//                         ? 'bg-green-500'
//                         : issue.status === 'in-progress'
//                         ? 'bg-blue-500'
//                         : issue.status === 'verified'
//                         ? 'bg-yellow-500'
//                         : 'bg-red-500'
//                     }`}
//                   />
//                   <div className="flex-1">
//                     <p className="font-medium text-gray-900 dark:text-white">{issue.title}</p>
//                     <div className="flex items-center justify-between mt-2">
//                       <span
//                         className={`text-xs px-2 py-1 rounded-full ${
//                           issue.status === 'resolved'
//                             ? 'bg-green-100 text-green-700'
//                             : issue.status === 'in-progress'
//                             ? 'bg-blue-100 text-blue-700'
//                             : issue.status === 'verified'
//                             ? 'bg-yellow-100 text-yellow-700'
//                             : 'bg-red-100 text-red-700'
//                         }`}
//                       >
//                         {issue.status.replace('-', ' ').toUpperCase()}
//                       </span>
//                       <span className="text-xs text-gray-500 dark:text-gray-400">
//                         {formatDistanceToNow(issue.reportedAt, { addSuffix: true })}
//                       </span>
//                     </div>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-8">
//               <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//               <p className="text-gray-500 dark:text-gray-400">
//                 You haven't reported any issues yet.
//               </p>
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
//                 onClick={() => onNavigate('report')}
//               >
//                 Report Your First Issue
//               </motion.button>
//             </div>
//           )}
//         </motion.div>
//       </div>

//       {/* Achievements */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
//       >
//         <div className="flex items-center justify-between mb-6">
//           <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
//             <Award className="w-6 h-6 text-yellow-500" />
//             <span>Your Achievements</span>
//           </h3>
//           <span className="text-sm text-gray-500 dark:text-gray-400">
//             {user?.points} points earned
//           </span>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           {user?.badges && user.badges.length > 0 ? (
//             user.badges.map((badge: any) => (
//               <motion.div
//                 key={badge.id}
//                 whileHover={{ scale: 1.05 }}
//                 className="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800"
//               >
//                 <div className="text-center">
//                   <div className="text-2xl mb-2">{badge.icon}</div>
//                   <h4 className="font-semibold text-gray-900 dark:text-white">{badge.name}</h4>
//                   <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
//                     {badge.description}
//                   </p>
//                   <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
//                     Earned {formatDistanceToNow(badge.earnedAt, { addSuffix: true })}
//                   </p>
//                 </div>
//               </motion.div>
//             ))
//           ) : (
//             <div className="col-span-3 text-center py-8">
//               <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//               <p className="text-gray-500 dark:text-gray-400">
//                 Start reporting issues to earn your first badge!
//               </p>
//             </div>
//           )}
//         </div>
//       </motion.div>
//     </div>
//   );
// };
