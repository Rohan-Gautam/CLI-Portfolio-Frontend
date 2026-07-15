/**
 * ===== Output Formatter =====
 * Handles printing formatting for retro CLI displays.
 * Converts structured backend response data into beautifully padded text lists and grids.
 */

import type {
  ProfileResponse,
  SkillResponse,
  ProjectResponse,
  ExperienceResponse,
  CommandInfo,
} from '../types';

/**
 * Formats the help command output as a clean table.
 */
export const formatHelp = (commands: CommandInfo[]): string => {
  let output = 'Available Commands:\n';
  output += '===================\n\n';

  // Calculate padding based on command length
  const maxCmdLength = Math.max(...commands.map((c) => c.command.length), 8);

  commands.forEach((c) => {
    if (c.command === 'theme') {
      const cmdCol = 'theme'.padEnd(maxCmdLength + 4, ' ');
      output += `${cmdCol} - Shows available themes.\n`;
      const indent = ''.padEnd(maxCmdLength + 4, ' ');
      output += `${indent}   Usage:\n`;
      output += `${indent}     theme\n`;
      output += `${indent}       Browse themes.\n`;
      output += `${indent}     theme <name>\n`;
      output += `${indent}       Switch to that theme.\n\n`;
      return;
    }

    const cmdCol = c.command.padEnd(maxCmdLength + 4, ' ');
    output += `${cmdCol} - ${c.description}\n`;
    output += `${''.padEnd(maxCmdLength + 4, ' ')}   Usage: ${c.usage}\n\n`;
  });

  return output;
};

/**
 * Formats the user's about details.
 */
export const formatAbout = (profile: ProfileResponse): string => {
  let output = `ABOUT ${profile.name.toUpperCase()}\n`;
  output += `${''.padEnd(6 + profile.name.length, '=')}\n\n`;
  output += `${profile.about}\n\n`;
  output += `Tagline:  ${profile.tagline}\n`;
  output += `Location: ${profile.location}\n`;
  return output;
};

/**
 * Formats skills grouped by category with a retro underline.
 */
export const formatSkills = (skills: SkillResponse[]): string => {
  let output = 'SKILLS & TECH STACK\n';
  output += '====================\n\n';

  skills.forEach((cat) => {
    output += `${cat.category}\n`;
    output += `${''.padEnd(cat.category.length, '-')}\n`;
    cat.items.forEach((skill) => {
      output += `* ${skill}\n`;
    });
    output += '\n';
  });

  return output.trim();
};

/**
 * Formats projects with neat ASCII frames.
 */
export const formatProjects = (projects: ProjectResponse[]): string => {
  let output = 'PROJECTS & PORTFOLIO\n';
  output += '====================\n\n';

  projects.forEach((proj) => {
    const header = `${proj.featured ? '[FEATURED] ' : ''}${proj.title}`;
    output += `+${''.padEnd(header.length + 2, '-')}+\n`;
    output += `| ${header} |\n`;
    output += `+${''.padEnd(header.length + 2, '-')}+\n`;
    output += `Duration: ${proj.duration}\n`;
    output += `Tagline:  ${proj.tagline}\n`;
    output += `Tech:     ${proj.techStack.join(', ')}\n\n`;
    output += `Description:\n  ${proj.description}\n\n`;

    if (proj.highlights && proj.highlights.length > 0) {
      output += `Highlights:\n`;
      proj.highlights.forEach((hl) => {
        output += `  * ${hl}\n`;
      });
      output += '\n';
    }

    if (proj.githubUrl) {
      output += `Code (GitHub): ${proj.githubUrl}\n`;
    }
    if (proj.liveUrl) {
      output += `Live Demo:     ${proj.liveUrl}\n`;
    }
    output += '\n';
    output += `${''.padEnd(50, '-')}\n\n`;
  });

  return output.trim();
};

/**
 * Formats experience list into retro CLI format.
 */
export const formatExperience = (experiences: ExperienceResponse[]): string => {
  let output = 'WORK EXPERIENCE\n';
  output += '===============\n\n';

  experiences.forEach((exp) => {
    const header = `${exp.company} - ${exp.role}`;
    output += `+${''.padEnd(header.length + 2, '-')}+\n`;
    output += `| ${header} |\n`;
    output += `+${''.padEnd(header.length + 2, '-')}+\n`;
    output += `Duration: ${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}\n`;
    output += `Location: ${exp.location}\n`;
    output += `Tech:     ${exp.techStack.join(', ')}\n\n`;
    output += `About the Company:\n  ${exp.companyDescription}\n\n`;

    if (exp.responsibilities && exp.responsibilities.length > 0) {
      output += `Key Responsibilities:\n`;
      exp.responsibilities.forEach((resp) => {
        output += `  * ${resp}\n`;
      });
    }
    output += '\n';
    output += `${''.padEnd(50, '-')}\n\n`;
  });

  return output.trim();
};

/**
 * Formats education details.
 */
export const formatEducation = (profile: ProfileResponse): string => {
  let output = 'EDUCATION HISTORY\n';
  output += '=================\n\n';

  profile.education.forEach((edu) => {
    const header = `${edu.institution}`;
    output += `+${''.padEnd(header.length + 2, '-')}+\n`;
    output += `| ${header} |\n`;
    output += `+${''.padEnd(header.length + 2, '-')}+\n`;
    output += `Degree:   ${edu.degree}\n`;
    output += `Location: ${edu.location}\n`;
    output += `Duration: ${edu.duration}\n`;
    output += `CGPA:     ${edu.cgpa}\n\n`;

    if (edu.coursework && edu.coursework.length > 0) {
      output += `Coursework:\n  ${edu.coursework.join(', ')}\n`;
    }
    output += '\n';
  });

  return output.trim();
};

/**
 * Formats social media links as a clean table.
 */
export const formatSocials = (profile: ProfileResponse): string => {
  let output = 'SOCIAL LINKS\n';
  output += '============\n\n';

  const maxPlatformLen = Math.max(...profile.socials.map((s) => s.platform.length), 8);
  const maxHandleLen = Math.max(...profile.socials.map((s) => s.handle.length), 6);

  const headerPlatform = 'Platform'.padEnd(maxPlatformLen + 4, ' ');
  const headerHandle = 'Handle'.padEnd(maxHandleLen + 4, ' ');
  output += `${headerPlatform}${headerHandle}URL\n`;
  output += `${''.padEnd(maxPlatformLen, '-')}${''.padEnd(4, ' ')}`;
  output += `${''.padEnd(maxHandleLen, '-')}${''.padEnd(4, ' ')}`;
  output += `${''.padEnd(20, '-')}\n`;

  profile.socials.forEach((social) => {
    const platformCol = social.platform.padEnd(maxPlatformLen + 4, ' ');
    const handleCol = social.handle.padEnd(maxHandleLen + 4, ' ');
    output += `${platformCol}${handleCol}${social.url}\n`;
  });

  return output;
};

/**
 * Renders neofetch information side-by-side with an ASCII art logo.
 */
export const formatNeofetch = (asciiArt: string, profile: ProfileResponse): string => {
  const asciiLines = asciiArt ? asciiArt.split('\n') : [];
  const neofetch = profile.neofetch;

  if (!neofetch) {
    return 'Neofetch data not available.';
  }

  const metadataLines = [
    `${profile.name.toLowerCase()}@rohan-os`,
    '-------------------------',
    `OS:          ${neofetch.os}`,
    `Host:        ${neofetch.host}`,
    `Shell:       ${neofetch.shell}`,
    `Uptime:      ${neofetch.uptime}`,
    `Title:       ${profile.title}`,
    `Location:    ${profile.location}`,
    `Email:       ${profile.email}`,
    `Phone:       ${profile.phone}`,
    `Languages:   ${neofetch.languages.join(', ')}`,
    `Interests:   ${neofetch.interests.join(', ')}`,
  ];

  const maxLines = Math.max(asciiLines.length, metadataLines.length);
  const resultLines: string[] = [];

  // Determine the width of the ASCII art block to align correctly
  const maxAsciiWidth = asciiLines.reduce((max, line) => Math.max(max, line.length), 0);

  for (let i = 0; i < maxLines; i++) {
    const ascii = asciiLines[i] || '';
    const meta = metadataLines[i] || '';
    // Pad ASCII side to ensure metadata aligns in a column
    const paddedAscii = ascii.padEnd(maxAsciiWidth + 4, ' ');
    resultLines.push(`${paddedAscii}${meta}`);
  }

  return resultLines.join('\n');
};
