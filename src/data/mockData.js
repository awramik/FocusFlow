// src/data/mockData.js

export const currentUser = [
  {
    id: 1,
    firstName: "Stranger",
    lastName: "D.",
    title: "Big Boss",
    plan: "Premium User",
    avatarInitials: "SD"
  },
  {
    id: 2,
    firstName: "Wiktoria",
    lastName: "A.",
    title: "Project Manager",
    plan: "Premium User",
    avatarInitials: "WA"
  },
  {
    id: 3,
    firstName: "Maja",
    lastName: "C.",
    title: "UI/UX Designer",
    plan: "Premium User",
    avatarInitials: "MC"
  },
  {
    id: 4,
    firstName: "Zuzanna",
    lastName: "B.",
    title: "Graphic Designer",
    plan: "Premium User",
    avatarInitials: "ZB"
  }
];

export const statsData = {
  focusTime: "4h 20m" 
};

export const hoursData = {
  workHours: {
    current: 4.5,
    goal: 6,
    unit: "h"
  },
  focusedHours: {
    current: 1.2,
    goal: 2,
    unit: "h"
  }
};

export const tasksData = [
  {
    id: 1,
    title: "Finish figma project of FocusFlow",
    status: "ongoing",
    priority: "critical",
    category: "DESIGN V3.1",
    deadline: "2026-05-18 10:30 AM",
    description: "Complete all application screens in Figma, including the new Dashboard and Kanban views. Ensure all interactive components are linked.",
    attachments: [
      { id: 101, name: "wireframes_v2.pdf", size: "2.4 MB" }
    ],
    comments: [
      { id: 201, author: "Wiktoria A.", text: "Remember to update the color palette before handing off to developers.", date: "2 hours ago" }
    ],
    assignee: { name: "Maja C.", avatar: "MC" },
    tags: ["UI", "Figma", "Mobile"],
    startDate: "2026-05-10",
    endDate: "2026-05-18",
    estimate: "32h",
    dependencies: { blocks: 2, isBlocked: 0 }
  },
  {
    id: 2,
    title: "Prepare interactive elements",
    status: "planned",
    priority: "high",
    category: "FocusFlow",
    deadline: "2026-05-20 6:30 PM",
    description: "Create hover effects, click transitions, and loading state animations for all major buttons.",
    attachments: [],
    comments: [],
    assignee: { name: "Zuzanna B.", avatar: "ZB" },
    tags: ["Animation", "Prototyping"],
    startDate: "2026-05-19",
    endDate: "2026-05-20",
    estimate: "12h",
    dependencies: { blocks: 1, isBlocked: 1 }
  },
  {
    id: 3,
    title: "Create a GitHub repository",
    status: "done",
    priority: "low",
    category: "FocusFlow",
    deadline: "2026-05-15 12:00 PM",
    description: "Initialize the frontend repository, add initial Vite + React setup, and invite all team members.",
    attachments: [],
    comments: [
      { id: 202, author: "Wiktoria A.", text: "Repo created, invites sent via email.", date: "Yesterday" }
    ],
    assignee: { name: "Wiktoria A.", avatar: "WA" },
    tags: ["DevOps", "Setup"],
    startDate: "2026-05-15",
    endDate: "2026-05-15",
    estimate: "1h",
    dependencies: { blocks: 0, isBlocked: 0 }
  },
  {
    id: 4,
    title: "User requirements analysis",
    status: "ongoing",
    priority: "high",
    category: "RESEARCH",
    deadline: "2026-05-18 12:00 PM",
    description: "Analyze the feedback from the first round of user testing and prepare a summary report.",
    attachments: [
      { id: 102, name: "user_feedback_Q1.xlsx", size: "1.1 MB" }
    ],
    comments: [],
    assignee: { name: "Wiktoria A.", avatar: "WA" },
    tags: ["Research", "Data"],
    startDate: "2026-05-16",
    endDate: "2026-05-18",
    estimate: "16h",
    dependencies: { blocks: 1, isBlocked: 0 }
  },
  {
    id: 5,
    title: "UI/UX Design adjustments",
    status: "planned",
    priority: "medium",
    category: "DESIGN",
    deadline: "2026-05-22 3:00 PM",
    description: "Adjust the sidebar layout based on the new user requirements analysis.",
    attachments: [],
    comments: [],
    assignee: { name: "Maja C.", avatar: "MC" },
    tags: ["UI", "Feedback"],
    startDate: "2026-05-21",
    endDate: "2026-05-22",
    estimate: "8h",
    dependencies: { blocks: 0, isBlocked: 1 }
  },
  {
    id: 6,
    title: "Dashboard view implementation",
    status: "planned",
    priority: "high",
    category: "UI/UX",
    deadline: "2026-05-25 6:00 PM",
    description: "Code the main dashboard view in React using the provided Tailwind/CSS classes.",
    attachments: [],
    comments: [],
    assignee: { name: "Wiktoria A.", avatar: "WA" },
    tags: ["Frontend", "React"],
    startDate: "2026-05-23",
    endDate: "2026-05-25",
    estimate: "24h",
    dependencies: { blocks: 0, isBlocked: 2 }
  },
  {
    id: 7,
    title: "Bug fixes on Kanban Board",
    status: "done",
    priority: "low",
    category: "FRONTEND",
    deadline: "2026-05-16 7:30 PM",
    description: "Fix the drag and drop glitch happening on Safari browsers.",
    attachments: [
      { id: 103, name: "error_log.txt", size: "12 KB" }
    ],
    comments: [
      { id: 203, author: "Zuzanna B.", text: "Tested on macOS Safari, works perfectly now.", date: "Yesterday" }
    ],
    assignee: { name: "Wiktoria A.", avatar: "WA" },
    tags: ["Bug", "Kanban"],
    startDate: "2026-05-16",
    endDate: "2026-05-16",
    estimate: "3h",
    dependencies: { blocks: 0, isBlocked: 0 }
  }
];

// Dane o projektach (przydatne do widoku Dashboard)
export const projectsData = [
  {
    id: 1,
    title: "FocusFlow Web App",
    description: "Main task management application",
    progress: 75,
  },
  {
    id: 2,
    title: "FocusFlow Marketing",
    description: "Landing page and promotional materials",
    progress: 40,
  }
];

// Aktywność (do RightAnalytics)
export const recentActivity = [
  { id: 1, text: "Wiktoria completed 'Bug fixes on Kanban'", time: "2 hours ago" },
  { id: 2, text: "Maja attached 'wireframes_v2.pdf'", time: "4 hours ago" },
  { id: 3, text: "Zuzanna started 'FocusMode session'", time: "Yesterday" }
];