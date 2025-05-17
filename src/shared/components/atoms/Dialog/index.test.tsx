import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './index';

describe('Dialog Component', () => {
  it('should render the dialog trigger', () => {
    render(
      <Dialog>
        <DialogTrigger data-testid="dialog-trigger">Open Dialog</DialogTrigger>
        <DialogContent>Dialog Content</DialogContent>
      </Dialog>
    );

    const trigger = screen.getByTestId('dialog-trigger');
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveTextContent('Open Dialog');
  });

  it('should open dialog when trigger is clicked', async () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent data-testid="dialog-content">
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog Description</DialogDescription>
          </DialogHeader>
          Dialog Content
          <DialogFooter>Dialog Footer</DialogFooter>
        </DialogContent>
      </Dialog>
    );

    const trigger = screen.getByText('Open Dialog');
    await userEvent.click(trigger);

    const content = screen.getByTestId('dialog-content');
    expect(content).toBeInTheDocument();
    expect(screen.getByText('Dialog Title')).toBeInTheDocument();
    expect(screen.getByText('Dialog Description')).toBeInTheDocument();
    expect(screen.getByText('Dialog Footer')).toBeInTheDocument();
  });

  it('should apply custom class names', () => {
    render(
      <Dialog defaultOpen>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent className="custom-content" data-testid="dialog-content">
          <DialogHeader className="custom-header" data-testid="dialog-header">
            <DialogTitle className="custom-title" data-testid="dialog-title">
              Dialog Title
            </DialogTitle>
            <DialogDescription className="custom-desc" data-testid="dialog-desc">
              Dialog Description
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="custom-footer" data-testid="dialog-footer">
            Dialog Footer
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );

    expect(screen.getByTestId('dialog-content')).toHaveClass('custom-content');
    expect(screen.getByTestId('dialog-header')).toHaveClass('custom-header');
    expect(screen.getByTestId('dialog-title')).toHaveClass('custom-title');
    expect(screen.getByTestId('dialog-desc')).toHaveClass('custom-desc');
    expect(screen.getByTestId('dialog-footer')).toHaveClass('custom-footer');
  });
});
