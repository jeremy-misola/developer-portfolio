#!/usr/bin/env node

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { db, initializeDatabase } from '../src/lib/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
process.chdir(join(__dirname, '..'));

async function seedSettings() {
  await db.updateSettings({
    fullName: 'Jeremy Misola',
    headline_en: 'Cloud & Platform Engineer focused on Kubernetes and observability',
    headline_fr: 'Ingenieur Cloud et Plateforme axe Kubernetes et observabilite',
    bio_en:
      'Computer Science student focused on Kubernetes platform engineering, GitOps, observability, and infrastructure automation.',
    bio_fr:
      'Etudiant en informatique axe sur l ingenierie de plateforme Kubernetes, GitOps, observabilite et automatisation de l infrastructure.',
    resumeUrl: '',
    email: 'misolarellinj06@gmail.com',
    phone: '514-569-4387',
    location: 'Montreal, QC',
    linkedinUrl: 'https://linkedin.com/in/jeremy-misola-969402302',
    githubUrl: 'https://github.com/jeremy-misola',
  });
}

async function seedSkills() {
  const existing = await db.getSkills();
  if (existing.length > 0) return;

  const skills = [
    ['Go', 'Go', 'Languages', 'Advanced'],
    ['Java', 'Java', 'Languages', 'Advanced'],
    ['Python', 'Python', 'Languages', 'Advanced'],
    ['SQL', 'SQL', 'Languages', 'Intermediate'],
    ['Kubernetes', 'Kubernetes', 'Cloud & Orchestration', 'Advanced'],
    ['Docker', 'Docker', 'Cloud & Orchestration', 'Advanced'],
    ['Terraform', 'Terraform', 'Cloud & Orchestration', 'Advanced'],
    ['Ansible', 'Ansible', 'Cloud & Orchestration', 'Intermediate'],
    ['Istio', 'Istio', 'Distributed Systems', 'Intermediate'],
    ['Longhorn', 'Longhorn', 'Distributed Systems', 'Intermediate'],
    ['OpenTelemetry', 'OpenTelemetry', 'Distributed Systems', 'Intermediate'],
    ['GitOps (ArgoCD)', 'GitOps (ArgoCD)', 'DevOps/SRE', 'Advanced'],
    ['LGTM Stack', 'Pile LGTM', 'DevOps/SRE', 'Advanced'],
    ['CI/CD Pipelines', 'Pipelines CI/CD', 'DevOps/SRE', 'Advanced'],
  ];

  let order = 1;
  for (const [name_en, name_fr, category, level] of skills) {
    await db.createSkill({ name_en, name_fr, category, level, displayOrder: order++ });
  }
}

async function seedEducation() {
  const existing = await db.getEducation();
  if (existing.length > 0) return;

  await db.createEducation({
    school: 'Champlain College Saint-Lambert',
    location: 'Saint-Lambert, QC',
    degree_en: 'Diploma of College Studies (DEC) in Computer Science',
    degree_fr: "Diplome d etudes collegiales (DEC) en informatique",
    startDate: '2023-08-01',
    endDate: '2026-06-30',
    description_en: 'Computer Science DEC program.',
    description_fr: 'Programme DEC en informatique.',
    displayOrder: 1,
  });
}

async function seedExperience() {
  const existing = await db.getExperience();
  if (existing.length > 0) return;

  await db.createExperience({
    company: 'CAE',
    position: 'Cloud & DevOps Intern (Container Platform Team)',
    position_en: 'Cloud & DevOps Intern (Container Platform Team)',
    position_fr: 'Stagiaire Cloud et DevOps (equipe plateforme conteneurs)',
    startDate: '2026-03-01',
    endDate: '2026-06-30',
    description:
      "Selected for a 12-week internship supporting CAE's enterprise Kubernetes infrastructure and observability.",
    description_en:
      "Selected for a 12-week internship supporting CAE's enterprise Kubernetes infrastructure and observability.",
    description_fr:
      "Selectionne pour un stage de 12 semaines pour soutenir l infrastructure Kubernetes entreprise de CAE et l observabilite.",
    technologies: ['Kubernetes', 'CI/CD', 'Cloud-Native Observability'],
    achievements: [
      'Supported enterprise-scale Kubernetes infrastructure.',
      'Contributed to CI/CD pipeline and observability improvements.',
    ],
    achievements_en: [
      'Supported enterprise-scale Kubernetes infrastructure.',
      'Contributed to CI/CD pipeline and observability improvements.',
    ],
    achievements_fr: [
      'Soutien de l infrastructure Kubernetes a grande echelle.',
      'Contribution aux ameliorations CI/CD et observabilite.',
    ],
  });

  await db.createExperience({
    company: 'Kleff Hosting',
    position: 'Backend & Platform Developer | Contract',
    position_en: 'Backend & Platform Developer | Contract',
    position_fr: 'Developpeur backend et plateforme | Contrat',
    startDate: '2025-07-01',
    endDate: null,
    description:
      'Built a consumer-facing PaaS with microservices, Kubernetes operator lifecycle automation, and SRE observability.',
    description_en:
      'Built a consumer-facing PaaS with microservices, Kubernetes operator lifecycle automation, and SRE observability.',
    description_fr:
      'Concu un PaaS public avec microservices, automatisation via operateur Kubernetes et observabilite SRE.',
    technologies: ['Go', 'Java', 'Kubernetes', 'ArgoCD', 'LGTM Stack'],
    achievements: [
      'Deployed 10+ microservices.',
      'Built custom Kubernetes operator and CRDs.',
      'Maintained 99.9% availability target during beta testing.',
    ],
    achievements_en: [
      'Deployed 10+ microservices.',
      'Built custom Kubernetes operator and CRDs.',
      'Maintained 99.9% availability target during beta testing.',
    ],
    achievements_fr: [
      'Deploiement de plus de 10 microservices.',
      'Creation d un operateur Kubernetes personnalise et de CRD.',
      'Objectif de disponibilite 99.9% maintenu pendant la beta.',
    ],
  });
}

async function seedProjects() {
  const existing = await db.getProjects();
  if (existing.length > 0) return;

  await db.createProject({
    title: 'Distributed Observability Lab',
    description: 'Centralized observability platform for containerized microservices using LGTM.',
    description_en:
      'Centralized observability platform for containerized microservices using LGTM.',
    description_fr:
      'Plateforme d observabilite centralisee pour microservices conteneurises avec la pile LGTM.',
    technologies: ['Loki', 'Grafana', 'Tempo', 'Prometheus'],
    githubUrl: '',
    demoUrl: '',
    status: 'in-progress',
    priority: 1,
    images: [],
  });

  await db.createProject({
    title: 'Automated Bare-Metal Cloud',
    description:
      'GitOps homelab for HA K3s on Proxmox with Longhorn, Authentik OIDC SSO, and External Secrets.',
    description_en:
      'GitOps homelab for HA K3s on Proxmox with Longhorn, Authentik OIDC SSO, and External Secrets.',
    description_fr:
      'Homelab GitOps pour K3s haute disponibilite sur Proxmox avec Longhorn, Authentik OIDC SSO et External Secrets.',
    technologies: ['Terraform', 'Proxmox', 'K3s', 'Longhorn', 'External Secrets Operator', 'ArgoCD'],
    githubUrl: 'https://github.com/jeremy-misola/GitOps-Homelab',
    demoUrl: '',
    status: 'in-progress',
    priority: 2,
    images: [],
  });
}

async function seedHobbies() {
  const existing = await db.getHobbies();
  if (existing.length > 0) return;

  const hobbies = [
    [
      'Capture The Flag (CTF)',
      'Capture The Flag (CTF)',
      'Security and reverse engineering challenges.',
      'Defis de securite et d ingenierie inverse.',
    ],
    [
      'Hackathons',
      'Hackathons',
      'Building AI and cloud prototypes under time constraints.',
      'Construction de prototypes IA et cloud sous contraintes de temps.',
    ],
    [
      'Homelab Engineering',
      'Ingenierie Homelab',
      'Designing and automating self-hosted Kubernetes infrastructure.',
      'Conception et automatisation d une infrastructure Kubernetes auto-hebergee.',
    ],
  ];

  let order = 1;
  for (const [name_en, name_fr, description_en, description_fr] of hobbies) {
    await db.createHobby({ name_en, name_fr, description_en, description_fr, displayOrder: order++ });
  }
}

async function run() {
  console.log('=============================');
  console.log('Portfolio Initial Data Seeder');
  console.log('=============================');

  const initialized = await initializeDatabase();
  if (!initialized) {
    console.error('Database unavailable');
    process.exit(1);
  }

  await seedSettings();
  await seedSkills();
  await seedEducation();
  await seedExperience();
  await seedProjects();
  await seedHobbies();

  console.log('Seed completed successfully.');
  process.exit(0);
}

run().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
