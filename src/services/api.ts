import axios from 'axios';
import type {
  ProfileResponse,
  CliConfigResponse,
  SkillResponse,
  ProjectResponse,
  ExperienceResponse,
} from '../types';

// ===== API Cache =====
// API Base URL configured via environment variables. Defaults to Spring Boot port 8080.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Cache objects stored in memory. Since this is a single page application,
// these variables persist as long as the page is open, fulfilling the "never request twice" requirement.
let skillsCache: SkillResponse[] | null = null;
let projectsCache: ProjectResponse[] | null = null;
let experienceCache: ExperienceResponse[] | null = null;

export const apiService = {
  /**
   * Fetches the user identity and system details.
   * Called on initial boot sequence.
   */
  getProfile: async (): Promise<ProfileResponse> => {
    const response = await client.get<ProfileResponse>('/api/profile');
    return response.data;
  },

  /**
   * Fetches the CLI command metadata, quotes, themes, and ASCII banner.
   * Called on initial boot sequence.
   */
  getCliConfig: async (): Promise<CliConfigResponse> => {
    const response = await client.get<CliConfigResponse>('/api/cli-config');
    return response.data;
  },

  /**
   * Fetches skills list. Uses in-memory cache if available.
   */
  getSkills: async (): Promise<SkillResponse[]> => {
    if (skillsCache) {
      console.log('[API Cache] Serving skills from memory cache.');
      return skillsCache;
    }
    console.log('[API Fetch] GET /api/skills');
    const response = await client.get<SkillResponse[]>('/api/skills');
    skillsCache = response.data;
    return response.data;
  },

  /**
   * Fetches projects list. Uses in-memory cache if available.
   */
  getProjects: async (): Promise<ProjectResponse[]> => {
    if (projectsCache) {
      console.log('[API Cache] Serving projects from memory cache.');
      return projectsCache;
    }
    console.log('[API Fetch] GET /api/projects');
    const response = await client.get<ProjectResponse[]>('/api/projects');
    projectsCache = response.data;
    return response.data;
  },

  /**
   * Fetches work experience list. Uses in-memory cache if available.
   */
  getExperience: async (): Promise<ExperienceResponse[]> => {
    if (experienceCache) {
      console.log('[API Cache] Serving experience from memory cache.');
      return experienceCache;
    }
    console.log('[API Fetch] GET /api/experience');
    const response = await client.get<ExperienceResponse[]>('/api/experience');
    experienceCache = response.data;
    return response.data;
  },
};
