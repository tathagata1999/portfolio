import { describe, it, expect } from 'vitest';
import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../src/App.jsx';

describe('App integration', () => {
  it('renders the hero with name and the core AI pitch', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Tathagata Mallik/);
    expect(screen.getAllByText(/I can automate your tasks with AI/i).length).toBeGreaterThan(0);
  });

  it('shows the profile photo with descriptive alt text in hero and about', () => {
    render(<App />);
    const imgs = screen.getAllByRole('img', { name: /portrait of tathagata mallik/i });
    expect(imgs.length).toBe(2);
    imgs.forEach((img) => {
      expect(img).toHaveAttribute('src', '/profile.jpg');
      expect(img).toHaveAttribute('width');
      expect(img).toHaveAttribute('height');
    });
    expect(imgs[0]).toHaveAttribute('fetchpriority', 'high');
    expect(imgs[1]).toHaveAttribute('loading', 'lazy');
  });

  it('does not render the Trimplin experience', () => {
    render(<App />);
    expect(screen.queryByText(/Trimplin/)).toBeNull();
  });

  it('every nav link points to a section that exists', () => {
    const { container } = render(<App />);
    const nav = screen.getByRole('navigation', { name: /primary/i });
    const links = within(nav).getAllByRole('link');
    expect(links.length).toBeGreaterThanOrEqual(5);
    links.forEach((a) => {
      const id = a.getAttribute('href').replace('#', '');
      expect(container.querySelector(`#${id}`)).not.toBeNull();
    });
  });

  it('shows all services and featured projects', () => {
    render(<App />);
    expect(screen.getByText('AI Customer Support')).toBeInTheDocument();
    expect(screen.getByText('Multi-Agent Workflows')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Food Health Scanner' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Hybrid LLM \+ ML Price Predictor/ })).toBeInTheDocument();
  });

  it('external project links open safely in a new tab', () => {
    render(<App />);
    const live = screen.getByRole('link', { name: /try it live/i });
    expect(live).toHaveAttribute('href', 'https://huggingface.co/spaces/Tatha1999/health_benefit_app');
    expect(live).toHaveAttribute('target', '_blank');
    expect(live.getAttribute('rel')).toMatch(/noopener/);
  });

  it('mobile menu toggles open and closed', async () => {
    const user = userEvent.setup();
    render(<App />);
    const toggle = screen.getByRole('button', { name: /open menu/i });
    await user.click(toggle);
    expect(screen.getByRole('navigation', { name: /mobile/i })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /close menu/i }));
    await waitFor(() => expect(screen.queryByRole('navigation', { name: /mobile/i })).toBeNull());
  });
});

describe('Business discovery chat (integration)', () => {
  it('walks a visitor from hello to a tailored automation plan', async () => {
    const user = userEvent.setup();
    render(<App />);
    const chat = screen.getByRole('region', { name: /ai business assistant/i });
    const input = within(chat).getByRole('textbox', { name: /message/i });

    await user.type(input, 'Priya{Enter}');
    expect(within(chat).getByText(/Nice to meet you, Priya/)).toBeInTheDocument();

    await user.click(within(chat).getByRole('button', { name: 'Online store' }));
    await user.click(within(chat).getByRole('button', { name: 'Answering customer questions' }));
    await user.click(within(chat).getByRole('button', { name: 'Excel / Google Sheets' }));
    await user.click(within(chat).getByRole('button', { name: '2-10' }));

    const plan = within(chat).getByTestId('plan-card');
    expect(within(plan).getByText('AI Customer Support Agent')).toBeInTheDocument();
    expect(within(plan).getByText(/hrs\/week/i)).toBeInTheDocument();

    await user.type(input, 'priya@shop.in{Enter}');
    const cta = within(chat).getByRole('link', { name: /send to tathagata/i });
    expect(cta.getAttribute('href')).toMatch(/^mailto:malliktathagata@gmail\.com/);
    expect(decodeURIComponent(cta.getAttribute('href'))).toMatch(/priya@shop\.in/);
  });

  it('send button is disabled for empty input and restart works', async () => {
    const user = userEvent.setup();
    render(<App />);
    const chat = screen.getByRole('region', { name: /ai business assistant/i });
    expect(within(chat).getByRole('button', { name: /send message/i })).toBeDisabled();
    await user.type(within(chat).getByRole('textbox', { name: /message/i }), 'Rahul{Enter}');
    await user.click(within(chat).getByRole('button', { name: /restart/i }));
    expect(within(chat).queryByText(/Rahul/)).toBeNull();
  });
});

describe('Contact form (integration)', () => {
  it('shows validation errors then a success state', async () => {
    const user = userEvent.setup();
    render(<App />);
    const form = screen.getByRole('form', { name: /contact/i });
    await user.click(within(form).getByRole('button', { name: /send/i }));
    expect(within(form).getByText(/tell me your name/i)).toBeInTheDocument();
    expect(within(form).getByText(/valid email/i)).toBeInTheDocument();

    await user.type(within(form).getByLabelText(/name/i), 'Asha');
    await user.type(within(form).getByLabelText(/email/i), 'asha@biz.com');
    await user.type(within(form).getByLabelText(/what should ai automate/i), 'Automate our invoice processing please');
    await user.click(within(form).getByRole('button', { name: /send/i }));
    expect(screen.getByRole('status')).toHaveTextContent(/thanks, asha/i);
  });
});
