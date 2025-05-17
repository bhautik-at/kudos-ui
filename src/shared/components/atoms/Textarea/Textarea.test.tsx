import { fireEvent, render, screen } from '@testing-library/react';

import { Textarea } from './index';

describe('Textarea', () => {
  it('should render textarea', () => {
    render(<Textarea placeholder="Enter text" />);

    const textarea = screen.getByTestId('textarea');
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveAttribute('placeholder', 'Enter text');
  });

  it('should handle user input', () => {
    render(<Textarea />);

    const textarea = screen.getByTestId('textarea');
    fireEvent.change(textarea, { target: { value: 'Hello, world!' } });

    expect(textarea).toHaveValue('Hello, world!');
  });

  it('should apply custom className', () => {
    render(<Textarea className="custom-class" />);

    const textarea = screen.getByTestId('textarea');
    expect(textarea).toHaveClass('custom-class');
  });

  it('should forward disabled attribute', () => {
    render(<Textarea disabled />);

    const textarea = screen.getByTestId('textarea');
    expect(textarea).toBeDisabled();
  });
});
