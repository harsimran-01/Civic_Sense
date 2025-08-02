import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { AuthModal } from './components/Auth/AuthModal';
import { Dashboard } from './components/Dashboard/Dashboard';
import { IssueMap } from './components/Map/IssueMap';
import { IssueCard } from './components/Issues/IssueCard';
import { IssueDetails } from './components/Issues/IssueDetails';
import { ReportIssueForm } from './components/Issues/ReportIssueForm';
import { Search, Filter, MapPin, List, Grid, Menu } from 'lucide-react';

// import ReportIssueForm from './components/Issues/ReportIssueForm';

import { useAuth } from './hooks/useAuth';
import { useIssues } from './hooks/useIssues';
import { Issue } from './types';
// import { Search, Filter, MapPin, List, Grid } from 'lucide-react';

function App() {
  const { user, isLoading: authLoading, login, register, logout } = useAuth();
  const { issues, isLoading: issuesLoading, addIssue, supportIssue, addComment } = useIssues();
  
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('civictrack_dark_mode') === 'true';
    }
    return false;
  });
  
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [reportFormOpen, setReportFormOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('civictrack_dark_mode', darkMode.toString());
  }, [darkMode]);

  // Show auth modal if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      setAuthModalOpen(true);
    }
  }, [authLoading, user]);

  const handleViewChange = (view: string) => {
    // setCurrentView(view);
    // if (view === 'report') {
    //   setReportFormOpen(true);
    //   // setCurrentView('dashboard'); // Return to dashboard after opening form
    // }
    if (view === 'report') {
    setReportFormOpen(true); // just open modal
  } else {
    setCurrentView(view); // change view normally
  }
  };

  const handleNewReport = () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    setReportFormOpen(true);
  };

  const handleSupportIssue = (issueId: string) => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    supportIssue(issueId, user.id);
  };

  const handleAddComment = (issueId: string, comment: any) => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    addComment(issueId, comment);
  };

  const filteredIssues = issues.filter(issue =>
    issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    issue.location.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading CivicTrack...</p>
        </div>
      </div>
    );
  }

  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <Header
        user={user}
        onMenuClick={() => setSidebarOpen(true)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onNewReport={handleNewReport}
        onProfileClick={() => setCurrentView('profile')}
      />
      {/* Toggle Button – visible on all screens */}
{/* <button
  onClick={() => setSidebarOpen(true)}
  className="fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 shadow rounded-lg text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 "


>
  <Menu className="w-6 h-6" />
</button> */}

        <button
  onClick={() => setSidebarOpen(prev => !prev)}
  className="fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 shadow rounded-lg text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
>
  <Menu className="w-6 h-6" />
</button>


      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentView={currentView}
        onViewChange={handleViewChange}
        onNewReport={handleNewReport} 
        user={user}
      />

      {/* Main Content */}
      <main className="lg:ml-0 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AnimatePresence mode="wait">
            {/* Dashboard */}
            {currentView === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
{/*                 <Dashboard issues={issues} user={user} /> */}
                <Dashboard
  issues={issues}
  user={user}
                  onNewReport={() => setCurrentView('report')}
  onNavigate={setCurrentView}
/>

              </motion.div>
            )}

            {/* Map View */}
            {currentView === 'map' && (
              <motion.div
                key="map"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-[calc(100vh-200px)]"
              >
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Issue Map
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    View all reported issues on the interactive map
                  </p>
                </div>
                <IssueMap
                  issues={issues}
                  onIssueClick={setSelectedIssue}
                  userLocation={{ lat: 40.7128, lng: -74.0060 }}
                  geofenceRadius={5000}
                />
              </motion.div>
            )}

            {/* Issues List */}
            {currentView === 'issues' && (
              <motion.div
                key="issues"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      All Issues
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      {filteredIssues.length} issues found
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search issues..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>

                    {/* View Toggle */}
                    <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-600 dark:text-gray-400'} rounded-l-lg`}
                      >
                        <Grid className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-600 dark:text-gray-400'} rounded-r-lg`}
                      >
                        <List className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {issuesLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                        <div className="animate-pulse">
                          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
                          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                    {filteredIssues.map((issue) => (
                      <IssueCard
                        key={issue.id}
                        issue={issue}
                        onSupportClick={handleSupportIssue}
                        onViewClick={setSelectedIssue}
                        currentUserId={user?.id}
                      />
                    ))}
                  </div>
                )}

                {filteredIssues.length === 0 && !issuesLoading && (
                  <div className="text-center py-12">
                    <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      No issues found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      {searchQuery ? 'Try adjusting your search terms' : 'Be the first to report an issue in your area'}
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleNewReport}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      Report First Issue
                    </motion.button>
                  </div>
                )}
              </motion.div>
            )}

            {/* Leaderboard */}
            {currentView === 'leaderboard' && (
              <motion.div
                key="leaderboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-12"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Community Leaderboard
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Coming soon! See who's making the biggest impact in your community.
                </p>
              </motion.div>
            )}

            {/* Community */}
            {currentView === 'community' && (
              <motion.div
                key="community"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-12"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Community Hub
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Connect with other community members and local organizations.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLogin={login}
        onRegister={register}
      />

      <ReportIssueForm
        isOpen={reportFormOpen}
        onClose={() => setReportFormOpen(false)}
        onSubmit={addIssue}
        currentUser={user}
      />

      <IssueDetails
        issue={selectedIssue}
        onClose={() => setSelectedIssue(null)}
        onSupportClick={handleSupportIssue}
        onAddComment={handleAddComment}
        currentUser={user}
      />
    </div>
  );
}

export default App;


