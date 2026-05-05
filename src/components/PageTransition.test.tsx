import { render } from '@testing-library/react';
import PageTransition from './PageTransition';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...props }: any) => (
      <div className={className} data-testid="motion-div" {...props}>
        {children}
      </div>
    )
  }
}));

describe('PageTransition', () => {
  it('renders children with the correct class name', () => {
    const { getByTestId, getByText } = render(
      <PageTransition className="test-class">
        <span>Test Content</span>
      </PageTransition>
    );

    const motionDiv = getByTestId('motion-div');
    expect(motionDiv).toHaveClass('test-class');
    expect(getByText('Test Content')).toBeInTheDocument();
  });

  it('renders without error when className is not provided', () => {
    const { getByTestId } = render(
      <PageTransition>
        <span>Test Content</span>
      </PageTransition>
    );

    const motionDiv = getByTestId('motion-div');
    expect(motionDiv.className).toBe('');
  });
});
