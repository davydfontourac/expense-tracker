import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Docs from './Docs';

describe('Docs Component', () => {
  it('renders correctly', () => {
    render(
      <BrowserRouter>
        <Docs />
      </BrowserRouter>
    );
    expect(screen.getAllByText(/Documentação/i)[0]).toBeInTheDocument();
  });
});
