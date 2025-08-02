// import React from 'react';
// import { 
//   Home, 
//   Map, 
//   Plus, 
//   List, 
//   BarChart3, 
//   Settings, 
//   HelpCircle, 
//   Award,
//   Users,
//   Shield,
//   X
// } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';

// interface SidebarProps {
//   isOpen: boolean;
//   onClose: () => void;
//   currentView: string;
//   onViewChange: (view: string) => void;
//   user: any;
//   onNewReport: () => void;
// }

// const menuItems = [
//   { id: 'dashboard', label: 'Dashboard', icon: Home },
//   { id: 'map', label: 'Issue Map', icon: Map },
//   { id: 'report', label: 'Report Issue', icon: Plus },
//   { id: 'issues', label: 'All Issues', icon: List },
//   { id: 'leaderboard', label: 'Leaderboard', icon: Award },
//   { id: 'community', label: 'Community', icon: Users },
// ];

// const adminItems = [
//   { id: 'admin', label: 'Admin Panel', icon: Shield },
//   { id: 'analytics', label: 'Analytics', icon: BarChart3 },
// ];

// const bottomItems = [
//   { id: 'settings', label: 'Settings', icon: Settings },
//   { id: 'help', label: 'Help & Support', icon: HelpCircle },
// ];

// export const Sidebar: React.FC<SidebarProps> = ({
//   isOpen,
//   onClose,
//   currentView,
//   onViewChange,
//   user
// }) => {
//   const isAdmin = user?.email === 'admin@civictrack.com'; // Simple admin check

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <>
//           <>
//   {/* Overlay (only on small screens, when open) */}
//   <AnimatePresence>
//     {isOpen && (
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         onClick={onClose}
//         className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
//       />
//     )}
//   </AnimatePresence>

//   {/* Sidebar (always shown on large screens, toggled on small screens) */}
//   <motion.aside
//     initial={{ x: -300 }}
//     animate={{ x: isOpen || window.innerWidth >= 1024 ? 0 : -300 }}
//     exit={{ x: -300 }}
//     transition={{ type: "spring", damping: 20 }}
//     className={`fixed left-0 top-0 h-full w-72 bg-white dark:bg-gray-900 shadow-xl z-50 flex flex-col border-r border-gray-200 dark:border-gray-700
//       ${isOpen ? '' : 'hidden'} 
//       lg:flex`} // 👈 Always show on large screen
//   >
//     {/* ... rest of your content ... */}
//   </motion.aside>
// </>

// {/*           {/* Overlay */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             onClick={onClose}
//             className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
//           /> */}

//           {/* Sidebar */}
// {/*           <motion.aside
//             initial={{ x: -300 }}
//             animate={{ x: 0 }}
//             exit={{ x: -300 }}
//             transition={{ type: "spring", damping: 20 }}
//             className="fixed left-0 top-0 h-full w-72 bg-white dark:bg-gray-900 shadow-xl z-50 flex flex-col border-r border-gray-200 dark:border-gray-700"
//           > */}

//             <motion.aside
//     initial={{ x: isOpen ? 0 : -300 }}
//     animate={{ x: isOpen ? 0 : -300 }}
//     exit={{ x: -300 }}
//     transition={{ type: "spring", damping: 20 }}
//     className={`fixed lg:static top-0 left-0 h-full w-72 bg-white dark:bg-gray-900 shadow-xl z-50 flex flex-col border-r border-gray-200 dark:border-gray-700 
//       ${isOpen ? '' : 'lg:translate-x-0'} 
//       ${!isOpen ? 'hidden lg:flex' : ''}`}
//   >
//             {/* Header */}
//             <div className="p-6 border-b border-gray-200 dark:border-gray-700">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-3">
//                   <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
//                     <span className="text-white font-bold text-lg">CT</span>
//                   </div>
//                   <div>
//                     <h2 className="text-lg font-bold text-gray-900 dark:text-white">CivicTrack</h2>
//                     <p className="text-xs text-gray-500 dark:text-gray-400">Smart Civic Platform</p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={onClose}
//                   className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
//                 >
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>
//             </div>

//             {/* User Stats */}
//             <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 mx-4 my-4 rounded-xl">
//               <div className="flex items-center space-x-3">
//                 {user?.avatar ? (
//                   <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
//                 ) : (
//                   <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
//                     <span className="text-lg font-bold text-gray-600 dark:text-gray-300">
//                       {user?.name?.charAt(0)}
//                     </span>
//                   </div>
//                 )}
//                 <div>
//                   <p className="font-semibold text-gray-900 dark:text-white">{user?.name}</p>
//                   <p className="text-sm text-blue-600 dark:text-blue-400">{user?.points} points</p>
//                   <p className="text-xs text-gray-500 dark:text-gray-400">{user?.reportsCount} reports</p>
//                 </div>
//               </div>
//             </div>

//             {/* Navigation */}
//             <nav className="flex-1 px-4 space-y-2">
//               {/* Main Menu */}
//               <div className="space-y-1">
//                 {menuItems.map((item) => (
//                   <motion.button
//                     key={item.id}
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                     onClick={() => {
//                       onViewChange(item.id);
//                       onClose();
//                     }}
//                     className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
//                       currentView === item.id
//                         ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
//                         : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
//                     }`}
//                   >
//                     <item.icon className="w-5 h-5" />
//                     <span className="font-medium">{item.label}</span>
//                   </motion.button>
//                 ))}
//               </div>

//               {/* Admin Section */}
//               {isAdmin && (
//                 <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
//                   <p className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                     Administration
//                   </p>
//                   <div className="space-y-1">
//                     {adminItems.map((item) => (
//                       <motion.button
//                         key={item.id}
//                         whileHover={{ scale: 1.02 }}
//                         whileTap={{ scale: 0.98 }}
//                         onClick={() => {
//                           onViewChange(item.id);
//                           onClose();
//                         }}
//                         className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
//                           currentView === item.id
//                             ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
//                             : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
//                         }`}
//                       >
//                         <item.icon className="w-5 h-5" />
//                         <span className="font-medium">{item.label}</span>
//                       </motion.button>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </nav>

//             {/* Bottom Menu */}
//             <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-1">
//               {bottomItems.map((item) => (
//                 <motion.button
//                   key={item.id}
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   onClick={() => {
//                     onViewChange(item.id);
//                     onClose();
//                   }}
//                   className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
//                     currentView === item.id
//                       ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
//                       : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
//                   }`}
//                 >
//                   <item.icon className="w-5 h-5" />
//                   <span className="font-medium">{item.label}</span>
//                 </motion.button>
//               ))}
//             </div>
//           </motion.aside>
//         </>
//       )}
//     </AnimatePresence>
//   );
// };

// import React from 'react';
// import {
//   Home, Map, Plus, List, BarChart3, Settings,
//   HelpCircle, Award, Users, Shield, X
// } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';

// interface SidebarProps {
//   isOpen: boolean;
//   onClose: () => void;
//   currentView: string;
//   onViewChange: (view: string) => void;
//   user: any;
//   onNewReport?: () => void;
// }

// const menuItems = [
//   { id: 'dashboard', label: 'Dashboard', icon: Home },
//   { id: 'map', label: 'Issue Map', icon: Map },
//   { id: 'report', label: 'Report Issue', icon: Plus },
//   { id: 'issues', label: 'All Issues', icon: List },
//   { id: 'leaderboard', label: 'Leaderboard', icon: Award },
//   { id: 'community', label: 'Community', icon: Users },
// ];

// const adminItems = [
//   { id: 'admin', label: 'Admin Panel', icon: Shield },
//   { id: 'analytics', label: 'Analytics', icon: BarChart3 },
// ];

// const bottomItems = [
//   { id: 'settings', label: 'Settings', icon: Settings },
//   { id: 'help', label: 'Help & Support', icon: HelpCircle },
// ];

// export const Sidebar: React.FC<SidebarProps> = ({
//   isOpen,
//   onClose,
//   currentView,
//   onViewChange,
//   user
// }) => {
//   const isAdmin = user?.email === 'admin@civictrack.com';

//   return (
//     <>
//       {/* Overlay on small screens */}
//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             onClick={onClose}
//             className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
//           />
//         )}
//       </AnimatePresence>

//       {/* Sidebar */}
//       <div className={`${isOpen ? 'block' : 'hidden'} lg:block`}>
//         <AnimatePresence>
//           {isOpen && (
//             <motion.aside
//               initial={{ x: -300 }}
//               animate={{ x: 0 }}
//               exit={{ x: -300 }}
//               transition={{ type: 'spring', damping: 20 }}
//               className="fixed lg:static top-0 left-0 z-50 h-full w-72 bg-white dark:bg-gray-900 shadow-xl flex flex-col border-r border-gray-200 dark:border-gray-700"
//             >
//               {/* Header */}
//               <div className="p-6 border-b border-gray-200 dark:border-gray-700">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center space-x-3">
//                     <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
//                       <span className="text-white font-bold text-lg">CT</span>
//                     </div>
//                     <div>
//                       <h2 className="text-lg font-bold text-gray-900 dark:text-white">CivicTrack</h2>
//                       <p className="text-xs text-gray-500 dark:text-gray-400">Smart Civic Platform</p>
//                     </div>
//                   </div>
//                   <button
//                     onClick={onClose}
//                     className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
//                   >
//                     <X className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>

//               {/* User Info */}
//               <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 mx-4 my-4 rounded-xl">
//                 <div className="flex items-center space-x-3">
//                   {user?.avatar ? (
//                     <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
//                   ) : (
//                     <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
//                       <span className="text-lg font-bold text-gray-600 dark:text-gray-300">
//                         {user?.name?.charAt(0)}
//                       </span>
//                     </div>
//                   )}
//                   <div>
//                     <p className="font-semibold text-gray-900 dark:text-white">{user?.name}</p>
//                     <p className="text-sm text-blue-600 dark:text-blue-400">{user?.points} points</p>
//                     <p className="text-xs text-gray-500 dark:text-gray-400">{user?.reportsCount} reports</p>
//                   </div>
//                 </div>
//               </div>

//               {/* Menu */}
//               <nav className="flex-1 px-4 overflow-y-auto space-y-2">
//                 {menuItems.map((item) => (
//                   <motion.button
//                     key={item.id}
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                     onClick={() => {
//                       onViewChange(item.id);
//                       onClose();
//                     }}
//                     className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
//                       currentView === item.id
//                         ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
//                         : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
//                     }`}
//                   >
//                     <item.icon className="w-5 h-5" />
//                     <span className="font-medium">{item.label}</span>
//                   </motion.button>
//                 ))}

//                 {isAdmin && (
//                   <>
//                     <p className="px-4 pt-4 pb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                       Administration
//                     </p>
//                     {adminItems.map((item) => (
//                       <motion.button
//                         key={item.id}
//                         whileHover={{ scale: 1.02 }}
//                         whileTap={{ scale: 0.98 }}
//                         onClick={() => {
//                           onViewChange(item.id);
//                           onClose();
//                         }}
//                         className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
//                           currentView === item.id
//                             ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
//                             : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
//                         }`}
//                       >
//                         <item.icon className="w-5 h-5" />
//                         <span className="font-medium">{item.label}</span>
//                       </motion.button>
//                     ))}
//                   </>
//                 )}
//               </nav>

//               {/* Bottom */}
//               <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-1">
//                 {bottomItems.map((item) => (
//                   <motion.button
//                     key={item.id}
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                     onClick={() => {
//                       onViewChange(item.id);
//                       onClose();
//                     }}
//                     className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
//                       currentView === item.id
//                         ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
//                         : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
//                     }`}
//                   >
//                     <item.icon className="w-5 h-5" />
//                     <span className="font-medium">{item.label}</span>
//                   </motion.button>
//                 ))}
//               </div>
//             </motion.aside>
//           )}
//         </AnimatePresence>
//       </div>
//     </>
//   );
// };

import React from 'react';
import {
  Home, Map, Plus, List, BarChart3, Settings,
  HelpCircle, Award, Users, Shield, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: string;
  onViewChange: (view: string) => void;
  user: any;
  onNewReport?: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'map', label: 'Issue Map', icon: Map },
  { id: 'report', label: 'Report Issue', icon: Plus },
  { id: 'issues', label: 'All Issues', icon: List },
  { id: 'leaderboard', label: 'Leaderboard', icon: Award },
  { id: 'community', label: 'Community', icon: Users },
];

const adminItems = [
  { id: 'admin', label: 'Admin Panel', icon: Shield },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
];

const bottomItems = [
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'help', label: 'Help & Support', icon: HelpCircle },
];

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  currentView,
  onViewChange,
  user
}) => {
  const isAdmin = user?.email === 'admin@civictrack.com';

  return (
    <>
      {/* Overlay only on mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black bg-opacity-50"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', damping: 20 }}
            className={`fixed lg:static top-0 left-0 z-50 h-full w-72 bg-white dark:bg-gray-900 shadow-xl flex flex-col border-r border-gray-200 dark:border-gray-700 ${
              isOpen ? '' : 'hidden lg:flex'
            }`}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">CT</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">CivicTrack</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Smart Civic Platform</p>
                  </div>
                </div>
                {/* Close button only on mobile */}
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* User Info */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 mx-4 my-4 rounded-xl">
              <div className="flex items-center space-x-3">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-gray-600 dark:text-gray-300">
                      {user?.name?.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{user?.name}</p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">{user?.points} points</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user?.reportsCount} reports</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 px-4 overflow-y-auto space-y-2">
              {menuItems.map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onViewChange(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    currentView === item.id
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </motion.button>
              ))}

              {isAdmin && (
                <>
                  <p className="px-4 pt-4 pb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Administration
                  </p>
                  {adminItems.map((item) => (
                    <motion.button
                      key={item.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        onViewChange(item.id);
                        onClose();
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        currentView === item.id
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </motion.button>
                  ))}
                </>
              )}
            </nav>

            {/* Bottom Items */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-1">
              {bottomItems.map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onViewChange(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    currentView === item.id
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};


