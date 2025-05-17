import { render, screen } from '@testing-library/react';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './index';

describe('Card Components', () => {
  // #region Card Component
  describe('Card', () => {
    it('should render with default props', () => {
      render(<Card>Card Content</Card>);
      expect(screen.getByText('Card Content')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(<Card className="custom-class">Card Content</Card>);
      expect(screen.getByText('Card Content')).toHaveClass('custom-class');
    });
  });
  // #endregion

  // #region CardHeader Component
  describe('CardHeader', () => {
    it('should render with children', () => {
      render(<CardHeader>Header Content</CardHeader>);
      expect(screen.getByText('Header Content')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(<CardHeader className="custom-header">Header Content</CardHeader>);
      expect(screen.getByText('Header Content')).toHaveClass('custom-header');
    });
  });
  // #endregion

  // #region CardFooter Component
  describe('CardFooter', () => {
    it('should render with children', () => {
      render(<CardFooter>Footer Content</CardFooter>);
      expect(screen.getByText('Footer Content')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(<CardFooter className="custom-footer">Footer Content</CardFooter>);
      expect(screen.getByText('Footer Content')).toHaveClass('custom-footer');
    });
  });
  // #endregion

  // #region CardTitle Component
  describe('CardTitle', () => {
    it('should render with children', () => {
      render(<CardTitle>Title Content</CardTitle>);
      expect(screen.getByText('Title Content')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(<CardTitle className="custom-title">Title Content</CardTitle>);
      expect(screen.getByText('Title Content')).toHaveClass('custom-title');
    });
  });
  // #endregion

  // #region CardDescription Component
  describe('CardDescription', () => {
    it('should render with children', () => {
      render(<CardDescription>Description Content</CardDescription>);
      expect(screen.getByText('Description Content')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(<CardDescription className="custom-desc">Description Content</CardDescription>);
      expect(screen.getByText('Description Content')).toHaveClass('custom-desc');
    });
  });
  // #endregion

  // #region CardContent Component
  describe('CardContent', () => {
    it('should render with children', () => {
      render(<CardContent>Content</CardContent>);
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(<CardContent className="custom-content">Content</CardContent>);
      expect(screen.getByText('Content')).toHaveClass('custom-content');
    });
  });
  // #endregion

  // #region Integration Tests
  describe('Card Integration', () => {
    it('should render a complete card with all subcomponents', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>Main Content</CardContent>
          <CardFooter>Footer Content</CardFooter>
        </Card>
      );

      expect(screen.getByText('Card Title')).toBeInTheDocument();
      expect(screen.getByText('Card Description')).toBeInTheDocument();
      expect(screen.getByText('Main Content')).toBeInTheDocument();
      expect(screen.getByText('Footer Content')).toBeInTheDocument();
    });
  });
  // #endregion
});
