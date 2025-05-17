import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sidebar, Header } from '@/shared/components/organisms/layout';
import { Sheet, SheetContent } from '@/shared/components/atoms/Sheet';
import { Button } from '@/shared/components/atoms/Button';

interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, className }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);

  // Handle responsive sidebar behavior
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };

    // Check on initial load
    checkMobile();

    // Listen for window resize
    window.addEventListener('resize', checkMobile);

    // Clean up event listener
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setSheetOpen(!sheetOpen);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  // Add custom styles to override the Sheet's overlay color
  useEffect(() => {
    // Create style element
    const styleEl = document.createElement('style');
    styleEl.setAttribute('id', 'sheet-overlay-fix');
    styleEl.innerHTML = `
      [data-radix-popper-content-wrapper] {
        z-index: 9999 !important;
      }
      .radix-sheet-overlay {
        background-color: transparent !important;
        backdrop-filter: blur(1px);
      }
    `;

    // Append style to head
    document.head.appendChild(styleEl);

    // Clean up
    return () => {
      const existingStyle = document.getElementById('sheet-overlay-fix');
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <div
          className={cn(
            'transition-all duration-300 ease-in-out z-30',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <Sidebar />
        </div>
      )}

      {/* Mobile Sidebar using Sheet */}
      {isMobile && (
        <Sheet
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          // This prop changes the overlay class
          modal={false}
        >
          <SheetContent
            side="left"
            className="p-0 max-w-[85vw] sm:max-w-[350px] border-0"
            style={{ background: 'white' }} // Force white background
          >
            <div className="bg-white h-full w-full">
              <Sidebar className="border-r-0" isMobile={true} onClose={() => setSheetOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header - Pass toggle function to Header component */}
        <Header
          className="z-10"
          onMenuClick={toggleSidebar}
          showMenuButton={true}
          isMobile={isMobile}
        />

        {/* Main content area */}
        <main className={cn('flex-1 overflow-auto p-4', className)}>
          {/* Page content */}
          {children}
        </main>
      </div>
    </div>
  );
};
