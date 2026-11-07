import { describe, it, expect } from 'vitest';
import { profile, projects, experience, services, skills, certifications } from '../../src/data/profile.js';

describe('profile data integrity', () => {
  it('has core identity fields', () => {
    expect(profile.name).toBe('Tathagata Mallik');
    expect(profile.email).toMatch(/@/);
    expect(profile.links.linkedin).toBe('https://www.linkedin.com/in/tathagata-mallik-081591233/');
    expect(profile.links.huggingface).toMatch(/^https:\/\/huggingface\.co\//);
  });

  it('every project has title, summary, tags and https links', () => {
    expect(projects.length).toBeGreaterThanOrEqual(4);
    projects.forEach((p) => {
      expect(p.title).toBeTruthy();
      expect(p.summary.length).toBeGreaterThan(30);
      expect(p.tags.length).toBeGreaterThan(0);
      (p.links || []).forEach((l) => expect(l.href).toMatch(/^https:\/\//));
    });
  });

  it('features the Food Health Scanner with a live Hugging Face link', () => {
    const fhs = projects.find((p) => p.id === 'food-health-scanner');
    expect(fhs).toBeTruthy();
    expect(fhs.links.some((l) => l.href.includes('huggingface.co/spaces/Tatha1999/health_benefit_app'))).toBe(true);
  });

  it('lists experience newest first, with Infosys current', () => {
    expect(experience[0].company).toBe('Infosys');
    expect(experience[0].end).toBe('Present');
    expect(experience.map((e) => e.company)).toContain('Accenture');
  });

  it('no longer lists Trimplin Group', () => {
    expect(experience.map((e) => e.company)).not.toContain('Trimplin Group');
    expect(experience.length).toBe(2);
  });

  it('has a profile photo with webp + jpg fallback', () => {
    expect(profile.photo.webp).toBe('/profile.webp');
    expect(profile.photo.jpg).toBe('/profile.jpg');
    expect(profile.photo.alt).toMatch(/Tathagata Mallik/);
  });

  it('has unique ids for services and projects', () => {
    const ids = [...services, ...projects].map((x) => x.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('has skills and certifications', () => {
    expect(skills.length).toBeGreaterThan(10);
    expect(certifications.every((c) => c.url.startsWith('https://www.udemy.com/certificate/'))).toBe(true);
  });
});
