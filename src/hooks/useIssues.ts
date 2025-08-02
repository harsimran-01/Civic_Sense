import { useState, useEffect } from 'react';
import { Issue, FilterOptions, IssueCategory, IssueStatus } from '../types';

// Mock data
const mockIssues: Issue[] = [
  {
    id: '1',
    title: 'Large Pothole on Main Street',
    description: 'Dangerous pothole causing vehicle damage. Located near the intersection with Oak Avenue.',
    category: 'pothole',
    status: 'in-progress',
    priority: 'high',
    location: {
      lat: 40.7128,
      lng: -74.0060,
      address: '123 Main Street, New York, NY'
    },
    images: ['https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?w=500'],
    reportedBy: {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      points: 250,
      badges: [],
      reportsCount: 12,
      joinedAt: new Date()
    },
    reportedAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-16'),
    assignedTo: 'City Works Department',
    supportCount: 8,
    supportedBy: ['2', '3', '4'],
    comments: [
      {
        id: '1',
        userId: '2',
        userName: 'Jane Smith',
        userAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=50',
        content: 'I hit this pothole yesterday and it damaged my tire!',
        createdAt: new Date('2024-01-15T10:30:00')
      }
    ],
    timeline: [
      {
        id: '1',
        type: 'created',
        description: 'Issue reported by John Doe',
        date: new Date('2024-01-15T09:00:00')
      },
      {
        id: '2',
        type: 'verified',
        description: 'Issue verified by city inspector',
        date: new Date('2024-01-15T14:30:00'),
        by: 'Inspector Williams'
      },
      {
        id: '3',
        type: 'assigned',
        description: 'Assigned to City Works Department',
        date: new Date('2024-01-16T08:00:00'),
        by: 'Admin'
      }
    ]
  },
  {
    id: '2',
    title: 'Overflowing Garbage Bin',
    description: 'Garbage bin has been overflowing for 3 days, attracting pests.',
    category: 'garbage',
    status: 'reported',
    priority: 'medium',
    location: {
      lat: 40.7589,
      lng: -73.9851,
      address: '456 Park Avenue, New York, NY'
    },
    images: ['https://images.pexels.com/photos/2827392/pexels-photo-2827392.jpeg?w=500'],
    reportedBy: {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      points: 180,
      badges: [],
      reportsCount: 8,
      joinedAt: new Date()
    },
    reportedAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-17'),
    supportCount: 3,
    supportedBy: ['1', '3'],
    comments: [],
    timeline: [
      {
        id: '1',
        type: 'created',
        description: 'Issue reported by Jane Smith',
        date: new Date('2024-01-17T11:15:00')
      }
    ]
  },
  {
    id: '3',
    title: 'Broken Street Light',
    description: 'Street light has been out for over a week, making the area unsafe at night.',
    category: 'street-light',
    status: 'resolved',
    priority: 'high',
    location: {
      lat: 40.7505,
      lng: -73.9934,
      address: '789 Broadway, New York, NY'
    },
    images: ['https://images.pexels.com/photos/327540/pexels-photo-327540.jpeg?w=500'],
    progressImages: {
      before: ['https://images.pexels.com/photos/327540/pexels-photo-327540.jpeg?w=500'],
      after: ['https://images.pexels.com/photos/302769/pexels-photo-302769.jpeg?w=500']
    },
    reportedBy: {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      points: 320,
      badges: [],
      reportsCount: 15,
      joinedAt: new Date()
    },
    reportedAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18'),
    assignedTo: 'Electric Department',
    supportCount: 12,
    supportedBy: ['1', '2', '4', '5'],
    comments: [
      {
        id: '1',
        userId: '1',
        userName: 'John Doe',
        userAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=50',
        content: 'This is a safety hazard! Glad it\'s been resolved.',
        createdAt: new Date('2024-01-18T16:00:00')
      }
    ],
    timeline: [
      {
        id: '1',
        type: 'created',
        description: 'Issue reported by Mike Johnson',
        date: new Date('2024-01-10T20:30:00')
      },
      {
        id: '2',
        type: 'verified',
        description: 'Issue verified and prioritized as high',
        date: new Date('2024-01-11T09:00:00'),
        by: 'Inspector Davis'
      },
      {
        id: '3',
        type: 'assigned',
        description: 'Assigned to Electric Department',
        date: new Date('2024-01-12T08:30:00'),
        by: 'Admin'
      },
      {
        id: '4',
        type: 'resolved',
        description: 'Street light repaired and working',
        date: new Date('2024-01-18T14:00:00'),
        by: 'Electric Department',
        images: ['https://images.pexels.com/photos/302769/pexels-photo-302769.jpeg?w=500']
      }
    ]
  }
];

export const useIssues = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({});

  useEffect(() => {
    // Simulate API call
    const fetchIssues = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setIssues(mockIssues);
      setFilteredIssues(mockIssues);
      setIsLoading(false);
    };

    fetchIssues();
  }, []);

  useEffect(() => {
    let filtered = [...issues];

    if (filters.category && filters.category.length > 0) {
      filtered = filtered.filter(issue => filters.category!.includes(issue.category));
    }

    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(issue => filters.status!.includes(issue.status));
    }

    if (filters.priority && filters.priority.length > 0) {
      filtered = filtered.filter(issue => filters.priority!.includes(issue.priority));
    }

    setFilteredIssues(filtered);
  }, [filters, issues]);

  const addIssue = (newIssue: Omit<Issue, 'id' | 'reportedAt' | 'updatedAt' | 'supportCount' | 'supportedBy' | 'comments' | 'timeline'>) => {
    const issue: Issue = {
      ...newIssue,
      id: Date.now().toString(),
      reportedAt: new Date(),
      updatedAt: new Date(),
      supportCount: 0,
      supportedBy: [],
      comments: [],
      timeline: [
        {
          id: '1',
          type: 'created',
          description: `Issue reported by ${newIssue.reportedBy.name}`,
          date: new Date()
        }
      ]
    };

    setIssues(prev => [issue, ...prev]);
    setFilteredIssues(prev => [issue, ...prev]);
  };

  const supportIssue = (issueId: string, userId: string) => {
    setIssues(prev => prev.map(issue => {
      if (issue.id === issueId) {
        const alreadySupported = issue.supportedBy.includes(userId);
        return {
          ...issue,
          supportCount: alreadySupported ? issue.supportCount - 1 : issue.supportCount + 1,
          supportedBy: alreadySupported 
            ? issue.supportedBy.filter(id => id !== userId)
            : [...issue.supportedBy, userId]
        };
      }
      return issue;
    }));

    setFilteredIssues(prev => prev.map(issue => {
      if (issue.id === issueId) {
        const alreadySupported = issue.supportedBy.includes(userId);
        return {
          ...issue,
          supportCount: alreadySupported ? issue.supportCount - 1 : issue.supportCount + 1,
          supportedBy: alreadySupported 
            ? issue.supportedBy.filter(id => id !== userId)
            : [...issue.supportedBy, userId]
        };
      }
      return issue;
    }));
  };

  const addComment = (issueId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => {
    const newComment: Comment = {
      ...comment,
      id: Date.now().toString(),
      createdAt: new Date()
    };

    setIssues(prev => prev.map(issue => 
      issue.id === issueId 
        ? { ...issue, comments: [...issue.comments, newComment] }
        : issue
    ));

    setFilteredIssues(prev => prev.map(issue => 
      issue.id === issueId 
        ? { ...issue, comments: [...issue.comments, newComment] }
        : issue
    ));
  };

  return {
    issues: filteredIssues,
    allIssues: issues,
    isLoading,
    filters,
    setFilters,
    addIssue,
    supportIssue,
    addComment
  };
};

// import { useState, useEffect } from 'react';
// import { Issue, FilterOptions, IssueCategory, IssueStatus } from '../types';
// // import { Issue, FilterOptions, Comment } from '../types';

// // LocalStorage key
// const STORAGE_KEY = 'localIssues';

// // Fallback mock data
// const mockIssues: Issue[] = [/* ... same as your original mockIssues ... */];

// export const useIssues = () => {
//   const [issues, setIssues] = useState<Issue[]>([]);
//   const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [filters, setFilters] = useState<FilterOptions>({});

//   // 🔁 Load issues from localStorage or fallback to mock data
//   useEffect(() => {
//     const fetchIssues = async () => {
//       setIsLoading(true);
//       await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay

//       const stored = localStorage.getItem(STORAGE_KEY);
//       if (stored) {
//         try {
//           const parsed: Issue[] = JSON.parse(stored);
//           setIssues(parsed);
//           setFilteredIssues(parsed);
//         } catch (err) {
//           console.error('Failed to parse local issues:', err);
//           setIssues(mockIssues);
//           setFilteredIssues(mockIssues);
//         }
//       } else {
//         setIssues(mockIssues);
//         setFilteredIssues(mockIssues);
//       }

//       setIsLoading(false);
//     };

//     fetchIssues();
//   }, []);

//   // 🔍 Filtering
//   useEffect(() => {
//     let filtered = [...issues];

//     if (filters.category?.length) {
//       filtered = filtered.filter(issue => filters.category!.includes(issue.category));
//     }

//     if (filters.status?.length) {
//       filtered = filtered.filter(issue => filters.status!.includes(issue.status));
//     }

//     if (filters.priority?.length) {
//       filtered = filtered.filter(issue => filters.priority!.includes(issue.priority));
//     }

//     setFilteredIssues(filtered);
//   }, [filters, issues]);

//   // 🔄 Save to localStorage
//   const updateLocalStorage = (updated: Issue[]) => {
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
//   };

//   // ➕ Add issue
//   const addIssue = (
//     newIssue: Omit<Issue, 'id' | 'reportedAt' | 'updatedAt' | 'supportCount' | 'supportedBy' | 'comments' | 'timeline'>
//   ) => {
//     const issue: Issue = {
//       ...newIssue,
//       id: Date.now().toString(),
//       reportedAt: new Date(),
//       updatedAt: new Date(),
//       supportCount: 0,
//       supportedBy: [],
//       comments: [],
//       timeline: [
//         {
//           id: '1',
//           type: 'created',
//           description: `Issue reported by ${newIssue.reportedBy.name}`,
//           date: new Date()
//         }
//       ]
//     };

//     const updated = [issue, ...issues];
//     setIssues(updated);
//     setFilteredIssues(updated);
//     updateLocalStorage(updated); // 🔐 Store locally
//   };

//   // 👍 Support issue
//   const supportIssue = (issueId: string, userId: string) => {
//     const updated = issues.map(issue => {
//       if (issue.id === issueId) {
//         const alreadySupported = issue.supportedBy.includes(userId);
//         return {
//           ...issue,
//           supportCount: alreadySupported ? issue.supportCount - 1 : issue.supportCount + 1,
//           supportedBy: alreadySupported
//             ? issue.supportedBy.filter(id => id !== userId)
//             : [...issue.supportedBy, userId]
//         };
//       }
//       return issue;
//     });

//     setIssues(updated);
//     setFilteredIssues(updated);
//     updateLocalStorage(updated); // 🔐 Store locally
//   };

//   // 💬 Add comment
//   const addComment = (issueId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => {
//     const newComment: Comment = {
//       ...comment,
//       id: Date.now().toString(),
//       createdAt: new Date()
//     };

//     const updated = issues.map(issue =>
//       issue.id === issueId
//         ? { ...issue, comments: [...issue.comments, newComment] }
//         : issue
//     );

//     setIssues(updated);
//     setFilteredIssues(updated);
//     updateLocalStorage(updated); // 🔐 Store locally
//   };

//   return {
//     issues: filteredIssues,
//     allIssues: issues,
//     isLoading,
//     filters,
//     setFilters,
//     addIssue,
//     supportIssue,
//     addComment
//   };
// };
