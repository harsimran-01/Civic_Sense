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
    images: ['data:image/jpeg;base64,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'],
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
    images: ['https://static.toiimg.com/thumb/msid-120174429,imgsize-110858,width-400,height-225,resizemode-72/Garbage-overflow-at-RMC-points-sparks-outrage-in-Mohali.jpg'],
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
    images: ['https://www.shutterstock.com/image-photo/accident-on-street-broken-traffic-600nw-480536776.jpg],
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


///simple one 
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
