/**
 * Content data — single source of truth for stevenjvik.tech v2
 *
 * All text content (experience, projects, guides, certs, skills, contact info,
 * bio) lives here. Both the home-page section components and deep-page routes
 * import from this module. Update real-world data here; components render it.
 *
 * Imported by:
 *   - src/components/sections/*.astro (home summary sections)
 *   - src/pages/experience.astro (full list)
 *   - src/pages/projects.astro (full list)
 *   - src/pages/guides.astro (full list + sample chapters)
 *   - src/pages/about.astro (skills, certs, education, contact)
 */

// ── Types ────────────────────────────────────────────────────

export type ExperienceItem = {
  id: string;
  title: string;
  company: string;
  via?: string;
  location: string;
  dates: string;
  description: string;
  tags: string[];
  caseStudyUrl?: string;
  accent?: "emerald" | "amber" | "secondary";
};

export type ProjectItem = {
  id: string;
  name: string;
  description: string;
  tags: string[];
  url?: string;
  urlLabel?: string;
  external?: boolean;
  status?: string;
  kind?: "infra" | "tool" | "data" | "sec" | "web" | "mod";
  year?: number;
};

export type GuideItem = {
  id: string;
  title: string;
  description: string;
  audience: string;
  price: string;
  pages: string;
  chapters: string[];
  tags: string[];
  url: string;
  highlights: string[];
  sampleTitle: string;
  sampleContent: string;
};

export type SkillGroup = { name: string; skills: string[] };

export type Education = {
  degree: string;
  school: string;
  status: string;
  description: string;
};

export type ContactInfo = {
  email: string;
  linkedin: string;
  github: string;
  resumeUrl: string;
  location: string;
  availability: string;
  bio: string[];
};

// ── Contact ──────────────────────────────────────────────────

export const CONTACT: ContactInfo = {
  email: "steven@stevenjvik.tech",
  linkedin: "https://linkedin.com/in/stevenjvik",
  github: "https://github.com/sjviklabs",
  resumeUrl: "/Steven_Vik_Resume.pdf",
  location: "Seattle, WA",
  availability: "Available for cybersecurity, DevOps, and infrastructure roles",
  bio: [
    "Cybersecurity engineer and DevOps practitioner based in Seattle. I build security tools, run the SJVIK NOC (a VLAN-segmented 3-node Proxmox operations center with 16 containers, centralized logging, SIEM, and Ansible IaC), and create practical guides for other practitioners.",
    "My background is defending enterprise networks and hunting threats — from DoD environments to transit infrastructure. I'm currently looking for my next role while building tools and infrastructure that demonstrate the work.",
    "Everything I ship comes from production experience. No theoretical fluff, no AI-generated filler. Real configs, real patterns, real lessons learned.",
  ],
};

// ── Experience (most recent first) ────────────────────────────

export const EXPERIENCE: ExperienceItem[] = [
  {
    id: "sound-transit",
    title: "Engineer — Network Operations Center",
    company: "Sound Transit",
    via: "via Infojini",
    location: "Seattle, WA",
    dates: "Feb 2024 – Mar 2025",
    description:
      "Monitored 3,000+ endpoints across critical transit IT and OT infrastructure in a 24/7 NOC. Authored SOPs, developed Python automation and Django-based internal tools reducing MTTR by 40%. Managed endpoint security tooling including CrowdStrike Falcon, Defender for Endpoint, and Entra ID. Enforced CJIS and NIST 800-53 compliance with zero audit violations.",
    tags: ["Splunk", "SolarWinds", "Python", "CrowdStrike", "NIST 800-53", "CJIS"],
    caseStudyUrl: "/experience/sound-transit",
    accent: "emerald",
  },
  {
    id: "tes-amazon",
    title: "Enterprise Technology Auditor",
    company: "TES USA / Amazon Campus",
    location: "Tukwila, WA",
    dates: "Jul 2023 – Jan 2024",
    description:
      "Coordinated infrastructure audits across 20+ Amazon buildings — AV systems, Cisco hardware, and projector infrastructure. Streamlined asset inventory documentation and developed improved tracking processes that shortened audit cycles and improved equipment accuracy across campuses.",
    tags: ["Asset Inventory", "Cisco", "Infrastructure Auditing", "Documentation"],
    accent: "secondary",
  },
  {
    id: "seattle-u",
    title: "IT System Engineer",
    company: "Seattle University & City of Medina PD",
    location: "Seattle, WA",
    dates: "2020 – 2021",
    description:
      "Deployed Cisco Communicator and unified communications infrastructure supporting the COVID-19 continuity transition — configuring help desk phone lines, student services lines, and online classroom capability for 200+ faculty, staff, and students. Enforced CJIS compliance and developed incident response playbooks.",
    tags: ["Cisco UC", "CJIS", "Incident Response", "PowerShell"],
    accent: "secondary",
  },
  {
    id: "jblm",
    title: "IT Security Specialist",
    company: "Joint Base Lewis-McChord",
    via: "via TEKsystems",
    location: "Tacoma, WA",
    dates: "Mar 2017 – Mar 2018",
    description:
      "Rebuilt DoD security environments for 500+ users. Managed DISA STIG-compliant Windows 10 deployment — 25% reduction in unauthorized access. Developed Splunk SIEM threat hunting protocols and vulnerability management strategies that delivered a 35% stronger security posture.",
    tags: ["Splunk", "DISA STIG", "Windows Server", "Threat Hunting", "Vulnerability Management"],
    caseStudyUrl: "/experience/jblm",
    accent: "amber",
  },
];

// ── Projects ──────────────────────────────────────────────────

export const PROJECTS: ProjectItem[] = [
  {
    id: "sjvik-noc",
    name: "SJVIK NOC",
    description:
      "Production operations center: 3-node Proxmox HA cluster, 16 LXC containers across 4 VLANs. Centralized logging (Loki/Alloy), Wazuh SIEM, 13 Grafana alert rules, Ansible IaC (20+ roles, site.yml converges all), and a custom React operator dashboard with log search.",
    tags: ["Linux", "Proxmox", "VLANs", "Ansible", "Wazuh", "Grafana", "Loki"],
    url: "/experience/nexus-lab",
    urlLabel: "Case Study",
    status: "Online",
    kind: "infra",
    year: 2024,
  },
  {
    id: "soc-lab",
    name: "SOC Lab",
    description:
      "Incident response playbooks, Sigma detection rules, Ansible hardening roles, and automation scripts. Public portfolio-quality security demonstrations.",
    tags: ["Splunk", "IR", "Detection", "Sigma", "Ansible"],
    url: "https://github.com/sjviklabs/sec-lab",
    urlLabel: "GitHub",
    external: true,
    kind: "sec",
    year: 2025,
  },
  {
    id: "lab-control",
    name: "Lab Control Center",
    description:
      "Full-stack orchestration dashboard with real-time node health, agent management, project hub, Loki log search, scheduler, and command center. Express 5 + SQLite + React 19.",
    tags: ["TypeScript", "React", "Express", "SQLite", "Loki"],
    url: "/noc/",
    urlLabel: "Architecture",
    kind: "tool",
    year: 2026,
  },
  {
    id: "job-tracker",
    name: "Job Tracker",
    description:
      "Job search mission control with automated daily scraper across 8 profiles, O*NET-aligned scoring, cover letter templates, and email integration.",
    tags: ["JavaScript", "Python", "Express", "Cron"],
    kind: "tool",
    year: 2026,
  },
  {
    id: "squire-mod",
    name: "Squire Mod v2",
    description:
      "Ground-up rebuild of a Minecraft companion mod. Custom FSM, handler-per-behavior architecture, mining/farming/fishing work system, mounted combat, Geckolib animations. 80+ Java files, 170+ commits.",
    tags: ["Java", "NeoForge", "Geckolib", "Minecraft"],
    url: "https://github.com/sjviklabs/squire-mod-v2",
    urlLabel: "GitHub",
    external: true,
    kind: "mod",
    year: 2025,
  },
];

// ── Guides (digital products) ─────────────────────────────────
// Full sampleContent HTML is split out to keep this module scannable;
// guide pages build from these bodies via set:html.

export const GUIDES: GuideItem[] = [
  {
    id: "proxmox-homelab",
    title: "Proxmox Homelab: Zero to Production",
    description:
      "Build a production-grade homelab from scratch. Proxmox clustering, LXC containers, Traefik, monitoring, backups, and security hardening. 131 pages of copy-paste configs and real-world patterns.",
    audience:
      "IT enthusiasts, career changers, and junior DevOps/SRE professionals who want hands-on infrastructure experience they can talk about in interviews.",
    price: "$20",
    pages: "131 pages",
    chapters: [
      "Introduction: What this guide is (and isn't)",
      "Hardware & Planning: Budget builds, node specs, network layout",
      "Proxmox Installation: Cluster setup from bare metal",
      "LXC Containers: Templates, networking, resource limits",
      "Core Services: DNS, Traefik reverse proxy, file sync",
      "Monitoring & Alerting: Grafana + Prometheus + alerting rules",
      "Backups & Recovery: PBS + Restic, verification, DR testing",
      "Security Hardening: SSH, firewalls, fail2ban, least privilege",
      "Automation & Maintenance: Ansible, cron, day-2 ops",
      "Advanced Topics: ZFS, Ceph, live migration, GPU passthrough",
      "Appendix: Quick reference, troubleshooting, version matrix",
    ],
    tags: ["Proxmox", "LXC", "Traefik", "Grafana", "Monitoring", "Backups", "Security"],
    url: "https://stevenjvik.gumroad.com/l/gxcefj",
    highlights: [
      "3-node Proxmox cluster setup from bare metal",
      "LXC container templates and best practices",
      "Traefik reverse proxy with auto-TLS",
      "Grafana + Prometheus monitoring with file-based alerts",
      "Restic + Proxmox Backup Server strategy",
      "Fail2ban, SSH hardening, firewall rules",
      "Ansible automation for repeatable deploys",
      "Chapter checkpoints and interview callouts",
    ],
    sampleTitle: "Sample: Security Hardening (Chapter 7)",
    // Existing HTML lives on the legacy deep-page file until Step 9 migration.
    // Keep a short teaser here; the full sample stays in /pages/guides.astro
    // via set:html until we move it too.
    sampleContent: "",
  },
  {
    id: "soc-interview-kit",
    title: "SOC Analyst Interview Kit",
    description:
      "200+ flashcards, 25 scenarios, Splunk SPL & Sentinel KQL exercises, MITRE ATT&CK mapping, behavioral frameworks, and a mock interview rubric. Everything you need to land the SOC role. 160 pages.",
    audience:
      "Career changers, bootcamp grads, cert holders, and junior analysts who keep hearing 'not enough hands-on experience' in interviews.",
    price: "$25",
    pages: "160 pages",
    chapters: [
      "Introduction: Who this is for, how to use it",
      "Core Concepts: Foundational Q&A review",
      "Scenario Questions: 25 realistic walkthroughs",
      "Technical Questions: Deep dive on protocols, logs, tools",
      "Behavioral Questions: STAR framework with real examples",
      "Tools & Technology: Splunk SPL, Sentinel KQL, Wireshark",
      "Resume & Prep Tips: What interviewers actually look for",
      "Quick Reference Cards: Printable cheat sheets",
      "Common Mistakes: Answers that sound right but are wrong",
      "First 90 Days: Your onboarding playbook",
    ],
    tags: ["SOC", "SIEM", "Splunk", "Sentinel", "MITRE ATT&CK", "Interview Prep"],
    url: "https://stevenjvik.gumroad.com/l/pwemdd",
    highlights: [
      "200+ flashcards covering SOC fundamentals",
      "25 realistic scenario walkthroughs",
      "Splunk SPL & Sentinel KQL query exercises",
      "MITRE ATT&CK framework mapping",
      "Behavioral answer frameworks that actually work",
      "Mock interview rubric with scoring guide",
      '"First 90 days" onboarding playbook',
      "Common mistakes and answers that sound right but aren't",
    ],
    sampleTitle: "Sample: Answers That Sound Right But Are Wrong (Chapter 8)",
    sampleContent: "",
  },
];

// ── Skills ────────────────────────────────────────────────────

export const SKILLS: SkillGroup[] = [
  {
    name: "SIEM & Detection",
    skills: [
      "Splunk",
      "SolarWinds",
      "Blackrock3",
      "CrowdStrike Falcon",
      "Defender for Endpoint",
      "Sentinel",
    ],
  },
  {
    name: "Cloud & Identity",
    skills: ["AWS (EC2, S3, IAM)", "Azure (VMs, Security Center)", "Entra ID", "Defender", "CSPM"],
  },
  {
    name: "Scripting & Automation",
    skills: ["Python", "PowerShell", "Bash", "SQL", "Splunk SPL"],
  },
  {
    name: "Infrastructure",
    skills: ["Linux", "Windows Server", "Proxmox VE", "LXC", "VMware ESXi", "Cisco UC"],
  },
  {
    name: "Network & Security Tools",
    skills: [
      "Cisco",
      "Fortinet",
      "VPN",
      "Active Directory",
      "DNS",
      "DHCP",
      "Nessus",
      "Wireshark",
      "Snort",
      "Metasploit",
    ],
  },
  {
    name: "Compliance & Frameworks",
    skills: ["NIST 800-53", "NIST CSF", "CJIS", "DISA STIG", "ISO 27001", "ITIL"],
  },
  {
    name: "Security Disciplines",
    skills: [
      "Incident Response",
      "Threat Hunting",
      "Vulnerability Assessment",
      "Digital Forensics",
      "Malware Analysis",
    ],
  },
  {
    name: "DevOps & Tooling",
    skills: ["Git", "GitHub", "Terraform", "Ansible", "Node.js / Express", "CI/CD", "ServiceNow"],
  },
];

// ── Certifications ────────────────────────────────────────────

export const CERTS_ACTIVE: string[] = [
  "CompTIA Security+",
  "CompTIA Network+",
  "CompTIA A+",
  "ITIL Foundation",
  "Linux Essentials (LPI 010-160)",
  "CJIS Level 4",
  "Google Cybersecurity Certificate",
  "Google IT Support Certificate",
];

export const CERTS_EXAM_READY: string[] = [
  "CCNA",
  "CySA+",
  "PenTest+",
  "Linux+",
  "Project+",
  "SSCP",
  "CEH",
];

// ── Education ─────────────────────────────────────────────────

export const EDUCATION: Education[] = [
  {
    degree: "B.S. Cybersecurity & Information Assurance",
    school: "Western Governors University",
    status: "In Progress (~7 courses remaining)",
    description:
      "Competency-based program covering security operations, cryptography, network defense, risk management, and governance.",
  },
  {
    degree: "Cybersecurity & Forensics Coursework",
    school: "Highline College",
    status: "2+ years completed",
    description:
      "Foundation in digital forensics, network security, incident response methodology, and applied security analysis.",
  },
];

// ── Hero metrics (for stat boxes) ─────────────────────────────

export const HERO_METRICS = [
  { value: "40%", label: "MTTR reduction via Python automation" },
  { value: "3,000+", label: "Endpoints monitored in 24/7 SOC" },
  { value: "CJIS", label: "Level 4 cleared, NIST 800-53" },
] as const;
