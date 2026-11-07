import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import App from '../../src/App.jsx';
import Services from '../../src/components/Services.jsx';
import Projects from '../../src/components/Projects.jsx';
import { buildContactMailto } from '../../src/components/Contact.jsx';

const text = (el) => el.textContent.replace(/\s+/g, ' ').trim();

describe('UI regression', () => {
  it('Services copy is unchanged', () => {
    const { container } = render(<Services />);
    expect(text(container)).toMatchSnapshot();
  });

  it('Projects copy is unchanged', () => {
    const { container } = render(<Projects />);
    expect(text(container)).toMatchSnapshot();
  });

  it('every external link opens in a new tab with rel=noopener (security regression)', () => {
    const { container } = render(<App />);
    const external = [...container.querySelectorAll('a[href^="http"]')];
    expect(external.length).toBeGreaterThan(5);
    external.forEach((a) => {
      expect(a.getAttribute('target')).toBe('_blank');
      expect(a.getAttribute('rel')).toMatch(/noopener/);
    });
  });

  it('every in-page anchor resolves to an element (no dead #links)', () => {
    const { container } = render(<App />);
    const anchors = [...container.querySelectorAll('a[href^="#"]')];
    anchors.forEach((a) => {
      const id = a.getAttribute('href').slice(1);
      expect(container.querySelector(`[id="${id}"]`), `missing #${id}`).not.toBeNull();
    });
  });

  it('uses the real LinkedIn URL (CV previously had a broken custom URL)', () => {
    const { container } = render(<App />);
    const li = [...container.querySelectorAll('a[href*="linkedin.com"]')];
    expect(li.length).toBeGreaterThan(0);
    li.forEach((a) => expect(a.getAttribute('href')).toBe('https://www.linkedin.com/in/tathagata-mallik-081591233/'));
  });

  it('has exactly one h1 (SEO regression)', () => {
    const { container } = render(<App />);
    expect(container.querySelectorAll('h1').length).toBe(1);
  });

  it('contact mailto encodes special characters safely', () => {
    const url = buildContactMailto({ name: 'A & B', email: 'a@b.co', message: 'Price? 100% & more\nline2' }, 'me@x.com');
    expect(url).not.toMatch(/ /);
    expect(decodeURIComponent(url.split('body=')[1])).toContain('100% & more\nline2');
  });
});
