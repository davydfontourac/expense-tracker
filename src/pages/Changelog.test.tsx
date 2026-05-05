import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Changelog from './Changelog';

describe('Changelog Component', () => {
  it('renders correctly', () => {
    render(
      <BrowserRouter>
        <Changelog />
      </BrowserRouter>
    );
    expect(screen.getByText(/O que há de novo/i)).toBeInTheDocument();
  });
});
