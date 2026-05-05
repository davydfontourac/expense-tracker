import { renderHook, act } from '@testing-library/react';
import { usePWA } from './usePWA';

describe('usePWA', () => {
  let originalAddEventListener: typeof window.addEventListener;
  let originalRemoveEventListener: typeof window.removeEventListener;

  beforeEach(() => {
    originalAddEventListener = window.addEventListener;
    originalRemoveEventListener = window.removeEventListener;
    window.addEventListener = vi.fn();
    window.removeEventListener = vi.fn();
  });

  afterEach(() => {
    window.addEventListener = originalAddEventListener;
    window.removeEventListener = originalRemoveEventListener;
  });

  it('should initialize with isInstallable as false', () => {
    const { result } = renderHook(() => usePWA());
    expect(result.current.isInstallable).toBe(false);
  });

  it('should set isInstallable to true when beforeinstallprompt is fired', () => {
    const { result } = renderHook(() => usePWA());
    
    // Get the registered handler
    const addEventListenerMock = window.addEventListener as vi.Mock;
    const eventName = addEventListenerMock.mock.calls[0][0];
    const handler = addEventListenerMock.mock.calls[0][1];

    expect(eventName).toBe('beforeinstallprompt');

    // Simulate the event
    const mockEvent = {
      preventDefault: vi.fn(),
      prompt: vi.fn(),
      userChoice: Promise.resolve({ outcome: 'accepted' }),
    };

    act(() => {
      handler(mockEvent as any);
    });

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(result.current.isInstallable).toBe(true);
  });

  it('should call prompt and handle accepted user choice', async () => {
    const { result } = renderHook(() => usePWA());
    
    const handler = (window.addEventListener as vi.Mock).mock.calls[0][1];

    const mockEvent = {
      preventDefault: vi.fn(),
      prompt: vi.fn().mockResolvedValue(undefined),
      userChoice: Promise.resolve({ outcome: 'accepted' }),
    };

    act(() => {
      handler(mockEvent as any);
    });

    await act(async () => {
      await result.current.installApp();
    });

    expect(mockEvent.prompt).toHaveBeenCalled();
    expect(result.current.isInstallable).toBe(false);
  });

  it('should call prompt and handle dismissed user choice', async () => {
    const { result } = renderHook(() => usePWA());
    
    const handler = (window.addEventListener as vi.Mock).mock.calls[0][1];

    const mockEvent = {
      preventDefault: vi.fn(),
      prompt: vi.fn().mockResolvedValue(undefined),
      userChoice: Promise.resolve({ outcome: 'dismissed' }),
    };

    act(() => {
      handler(mockEvent as any);
    });

    await act(async () => {
      await result.current.installApp();
    });

    expect(mockEvent.prompt).toHaveBeenCalled();
    expect(result.current.isInstallable).toBe(true); // Should still be true if dismissed
  });

  it('should remove event listener on unmount', () => {
    const { unmount } = renderHook(() => usePWA());
    
    const handler = (window.addEventListener as jest.Mock).mock.calls[0][1];
    
    unmount();
    
    expect(window.removeEventListener).toHaveBeenCalledWith('beforeinstallprompt', handler);
  });
});
