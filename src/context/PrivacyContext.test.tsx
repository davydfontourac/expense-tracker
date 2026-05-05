import { render, screen, renderHook } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PrivacyProvider, usePrivacy } from './PrivacyContext';
import React from 'react';

describe('PrivacyContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders children correctly', () => {
    render(
      <PrivacyProvider>
        <div data-testid="child">Child Content</div>
      </PrivacyProvider>
    );
    expect(screen.getByTestId('child')).toHaveTextContent('Child Content');
  });

  it('loads hideBalance from localStorage initially', () => {
    localStorage.setItem('hide_balance', 'true');
    const { result } = renderHook(() => usePrivacy(), {
      wrapper: PrivacyProvider,
    });
    expect(result.current.hideBalance).toBe(true);
  });

  it('loads hideBalance as false if not in localStorage', () => {
    const { result } = renderHook(() => usePrivacy(), {
      wrapper: PrivacyProvider,
    });
    expect(result.current.hideBalance).toBe(false);
  });

  it('updates hideBalance and localStorage when setHideBalance is called', () => {
    const { result } = renderHook(() => usePrivacy(), {
      wrapper: PrivacyProvider,
    });

    expect(result.current.hideBalance).toBe(false);

    // Turn on hideBalance
    React.act(() => {
      result.current.setHideBalance(true);
    });

    expect(result.current.hideBalance).toBe(true);
    expect(localStorage.getItem('hide_balance')).toBe('true');

    // Turn off hideBalance
    React.act(() => {
      result.current.setHideBalance(false);
    });

    expect(result.current.hideBalance).toBe(false);
    expect(localStorage.getItem('hide_balance')).toBe('false');
  });

  it('throws an error when usePrivacy is used outside PrivacyProvider', () => {
    // Suppress console.error in vitest output for expected error
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      renderHook(() => usePrivacy());
    }).toThrow('usePrivacy deve ser usado dentro de um PrivacyProvider');

    spy.mockRestore();
  });
});
