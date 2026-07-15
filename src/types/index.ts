export interface ThemeInfo {
  name: string;
  background: string;
  foreground: string;
  accent: string;
}

export interface CommandInfo {
  command: string;
  description: string;
  usage: string;
}

export interface CliConfigResponse {
  themes: ThemeInfo[];
  commands: CommandInfo[];
  quotes: string[];
  asciiArt: string;
}

export interface EducationEntry {
  institution: string;
  degree: string;
  location: string;
  duration: string;
  cgpa: string;
  coursework: string[];
}

export interface SocialLink {
  platform: string;
  url: string;
  handle: string;
}

export interface NeofetchInfo {
  os: string;
  host: string;
  shell: string;
  uptime: string;
  languages: string[];
  interests: string[];
}

export interface ProfileResponse {
  name: string;
  title: string;
  tagline: string;
  location: string;
  email: string;
  phone: string;
  about: string;
  resumeUrl: string;
  githubUrl: string;
  education: EducationEntry[];
  socials: SocialLink[];
  neofetch: NeofetchInfo;
}

export interface SkillResponse {
  category: string;
  items: string[];
}

export interface ProjectResponse {
  title: string;
  tagline: string;
  description: string;
  techStack: string[];
  highlights: string[];
  githubUrl: string;
  liveUrl: string;
  duration: string;
  featured: boolean;
}

export interface ExperienceResponse {
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  companyDescription: string;
  responsibilities: string[];
  techStack: string[];
}

export interface TerminalLine {
  type: 'input' | 'output' | 'system' | 'error' | 'theme-picker';
  text: string;
  id: string;
}
