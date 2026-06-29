// Backend API integration and state service for ScaleWithAbhi portfolio.
// Structured to easily plug in a Ruby on Rails API.

const API_BASE_URL = import.meta.env.VITE_RAILS_API_URL || '';

export interface Project {
  id: string;
  title: string;
  description: string;
  url: string;
  image: string;
  tech: string[];
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  points: string[];
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  location: string;
  period: string;
  score: string;
}

export interface SkillGroup {
  category: string;
  skills: { name: string; icon: string }[];
}

// Fallback data reflecting the original portfolio contents
const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'TaskFlow',
    description: 'A scalable task management system with real-time updates and collaborative workspaces.',
    url: 'https://taskflow.scalewithabhi.in/',
    image: '/assets/img/portfolio/Project1.png',
    tech: ['React', 'Node.js', 'MongoDB', 'TailwindCSS'],
  },
  {
    id: '2',
    title: 'ResumeCraft',
    description: 'An AI-powered interactive resume generator with export functionalities and template selectors.',
    url: 'https://www.resumecraft.scalewithabhi.in/',
    image: '/assets/img/portfolio/Project2.png',
    tech: ['React', 'Next.js', 'Ruby on Rails', 'TailwindCSS'],
  },
  {
    id: '3',
    title: 'ScaleWithAbhi Portfolio',
    description: '3D interactive portfolio featuring anti-gravity float elements and cursor-responsive light systems.',
    url: 'https://scalewithabhi.in/',
    image: '/assets/img/portfolio/Project3.png',
    tech: ['React', 'React Three Fiber', 'TailwindCSS', 'Framer Motion'],
  },
];

const MOCK_EXPERIENCE: Experience[] = [
  {
    id: 'exp-1',
    role: 'Software Engineer',
    company: 'Setlmint',
    location: 'Mumbai, Maharashtra',
    period: '03/2023 - Present',
    points: [
      'Implemented frontend and backend functionalities using React, Ruby on Rails and MySQL, optimizing database design to handle millions of rows efficiently, minimizing bundle size and reducing server computation by 30%.',
      'Developed a scalable Receivables feature using OCR and email parsing for automated bill ingestion, company detection, and user assignment.',
      'Leveraged AWS Serverless Application Model (SAM) and AWS Lambda to deploy scalable, cost-efficient serverless applications, improving reliability by 25%.',
      'Designed and developed a comprehensive Budget Management feature using ReactJS and Ruby on Rails, improving financial planning accuracy by 30%.',
      'Upgraded legacy Ruby on Rails 6 codebase to Rails 8 and MySQL 5.7 to 8.0, optimizing database performance through query tuning.',
    ],
  },
  {
    id: 'exp-2',
    role: 'Trainee',
    company: 'Sharpner',
    location: 'Bengaluru, Karnataka',
    period: '09/2022 - 02/2023',
    points: [
      'Developed full-stack applications using Node.js, Express, MongoDB, and React, gaining hands-on experience in building scalable web applications.',
      'Implemented RESTful APIs and database management, optimizing data flow and integrating backend services with frontends.',
    ],
  },
];

const MOCK_EDUCATION: Education[] = [
  {
    id: 'edu-1',
    degree: 'Graduation (B.E)',
    school: 'Terna Engineering College',
    location: 'Navi Mumbai, Maharashtra',
    period: '07/2018 - 06/2022',
    score: 'CGPA: 9.67',
  },
  {
    id: 'edu-2',
    degree: 'Higher Secondary (XII) - Science',
    school: 'V. G. Vaze Kelkar College',
    location: 'Mumbai, Maharashtra',
    period: '06/2016 - 05/2018',
    score: 'Percentage: 89.85%',
  },
];

const MOCK_SKILLS: SkillGroup[] = [
  {
    category: 'Frontend Development',
    skills: [
      { name: 'React', icon: 'https://profilinator.rishav.dev/skills-assets/react-original-wordmark.svg' },
      { name: 'Next.js', icon: '/assets/img/nextjs.png' },
      { name: 'Tailwind CSS', icon: 'https://profilinator.rishav.dev/skills-assets/tailwindcss.svg' },
      { name: 'JavaScript', icon: 'https://profilinator.rishav.dev/skills-assets/javascript-original.svg' },
      { name: 'HTML5/CSS3', icon: 'https://profilinator.rishav.dev/skills-assets/css3-original-wordmark.svg' },
    ],
  },
  {
    category: 'Backend & Database',
    skills: [
      { name: 'Ruby on Rails', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Ruby_on_Rails_logos.svg/770px-Ruby_on_Rails_logos.svg.png' },
      { name: 'Node.js', icon: 'https://profilinator.rishav.dev/skills-assets/nodejs-original-wordmark.svg' },
      { name: 'Express', icon: 'https://profilinator.rishav.dev/skills-assets/express-original-wordmark.svg' },
      { name: 'MySQL', icon: 'https://profilinator.rishav.dev/skills-assets/mysql-original-wordmark.svg' },
      { name: 'MongoDB', icon: 'https://profilinator.rishav.dev/skills-assets/mongodb-original-wordmark.svg' },
      { name: 'PostgreSQL', icon: 'https://profilinator.rishav.dev/skills-assets/postgresql-original-wordmark.svg' },
    ],
  },
  {
    category: 'DevOps & Cloud',
    skills: [
      { name: 'AWS', icon: 'https://profilinator.rishav.dev/skills-assets/amazonwebservices-original-wordmark.svg' },
      { name: 'Docker', icon: 'https://profilinator.rishav.dev/skills-assets/docker-original-wordmark.svg' },
      { name: 'Kubernetes', icon: '/assets/img/k8s.jpeg' },
      { name: 'Linux', icon: 'https://profilinator.rishav.dev/skills-assets/linux-original.svg' },
      { name: 'Git', icon: 'https://profilinator.rishav.dev/skills-assets/git-scm-icon.svg' },
    ],
  },
];

export async function fetchProjects(): Promise<Project[]> {
  if (!API_BASE_URL) return MOCK_PROJECTS;
  try {
    const res = await fetch(`${API_BASE_URL}/projects`);
    if (!res.ok) throw new Error('API failure');
    return await res.json();
  } catch (error) {
    console.warn('Falling back to static Projects data', error);
    return MOCK_PROJECTS;
  }
}

export async function fetchExperience(): Promise<Experience[]> {
  if (!API_BASE_URL) return MOCK_EXPERIENCE;
  try {
    const res = await fetch(`${API_BASE_URL}/experiences`);
    if (!res.ok) throw new Error('API failure');
    return await res.json();
  } catch (error) {
    console.warn('Falling back to static Experience data', error);
    return MOCK_EXPERIENCE;
  }
}

export async function fetchEducation(): Promise<Education[]> {
  if (!API_BASE_URL) return MOCK_EDUCATION;
  try {
    const res = await fetch(`${API_BASE_URL}/education`);
    if (!res.ok) throw new Error('API failure');
    return await res.json();
  } catch (error) {
    console.warn('Falling back to static Education data', error);
    return MOCK_EDUCATION;
  }
}

export async function fetchSkills(): Promise<SkillGroup[]> {
  if (!API_BASE_URL) return MOCK_SKILLS;
  try {
    const res = await fetch(`${API_BASE_URL}/skills`);
    if (!res.ok) throw new Error('API failure');
    return await res.json();
  } catch (error) {
    console.warn('Falling back to static Skills data', error);
    return MOCK_SKILLS;
  }
}

export async function submitContactForm(data: { name: string; email: string; message: string }): Promise<{ success: boolean; message: string }> {
  if (!API_BASE_URL) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { success: true, message: 'Message sent successfully (Mocked API)!' };
  }
  try {
    const res = await fetch(`${API_BASE_URL}/contacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to send contact message');
    return await res.json();
  } catch (error) {
    console.error('Contact submission error', error);
    return { success: false, message: 'Could not deliver your message. Please try again later.' };
  }
}
