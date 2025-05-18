import React, { useEffect, useRef, useState } from 'react';
import { LoadingPlaceholder } from '../atoms/LoadingPlaceholder';

interface WordCloudProps {
  data: {
    keyword: string;
    count: number;
    percentage: number;
  }[];
  isLoading?: boolean;
  maxWords?: number;
  minFontSize?: number;
  maxFontSize?: number;
  className?: string;
  onClick?: (keyword: string) => void;
}

interface WordPosition {
  keyword: string;
  count: number;
  percentage: number;
  fontSize: number;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  animationDelay: string;
}

export const WordCloud = ({
  data,
  isLoading = false,
  maxWords = 50,
  minFontSize = 16,
  maxFontSize = 48,
  className = '',
  onClick,
}: WordCloudProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [wordPositions, setWordPositions] = useState<WordPosition[]>([]);
  const [hoveredWord, setHoveredWord] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateDimensions();
    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(containerRef.current);

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!dimensions.width || !dimensions.height || isLoading || !data.length) return;

    // Sort data by count (descending) and limit to maxWords
    const limitedData = [...data].sort((a, b) => b.count - a.count).slice(0, maxWords);

    // Find max count for scaling font sizes
    const maxCount = Math.max(...limitedData.map(item => item.count));
    const positions: WordPosition[] = [];

    // Temporary canvas for measuring text
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    // Helper function to check if a word overlaps with existing words
    const doesOverlap = (word: WordPosition) => {
      for (const existingWord of positions) {
        // Add a small gap between words (10px buffer)
        const buffer = 10;
        if (
          word.x - buffer < existingWord.x + existingWord.width + buffer &&
          word.x + word.width + buffer > existingWord.x - buffer &&
          word.y - word.height / 2 - buffer < existingWord.y + existingWord.height / 2 + buffer &&
          word.y + word.height / 2 + buffer > existingWord.y - existingWord.height / 2 - buffer
        ) {
          return true;
        }
      }
      return false;
    };

    // Calculate font size based on count
    const calculateFontSize = (count: number) => {
      const ratio = Math.sqrt(count / maxCount); // Use sqrt for less extreme size differences
      return minFontSize + ratio * (maxFontSize - minFontSize);
    };

    // Generate a vibrant color based on percentage
    const generateColor = (percentage: number, index: number) => {
      // Get a base hue from the percentage (0-100%)
      const hue = Math.floor(percentage * 3.6) % 360;
      // Higher saturation for more vibrant colors
      const saturation = 85 + (index % 3) * 5;
      // Adjust lightness based on percentage for better contrast
      const lightness = 45 + (index % 4) * 3;

      return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    };

    // Position words using spiral layout algorithm
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    const maxRadius = Math.min(centerX, centerY) * 0.9;

    // Place words
    limitedData.forEach((item, index) => {
      const fontSize = calculateFontSize(item.count);
      ctx.font = `bold ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
      const metrics = ctx.measureText(item.keyword);
      const textWidth = metrics.width;
      const textHeight = fontSize * 1.2; // Approximate height

      let placed = false;
      let spiralStep = 0;
      let angle = Math.random() * Math.PI * 2; // Random starting angle
      let radius = 5;

      const word: WordPosition = {
        keyword: item.keyword,
        count: item.count,
        percentage: item.percentage,
        fontSize,
        x: 0,
        y: 0,
        width: textWidth,
        height: textHeight,
        color: generateColor(item.percentage, index),
        animationDelay: `${index * 40}ms`,
      };

      // Try to find a position in spiral
      while (!placed && spiralStep < 500) {
        angle += 1 / (radius / 10);
        radius += 0.75; // Faster spiral growth

        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        word.x = x - textWidth / 2;
        word.y = y;

        // Check if it's within container bounds
        if (
          word.x >= 10 &&
          word.x + textWidth <= dimensions.width - 10 &&
          word.y - textHeight / 2 >= 10 &&
          word.y + textHeight / 2 <= dimensions.height - 10
        ) {
          if (!doesOverlap(word)) {
            placed = true;
          }
        }

        spiralStep++;
      }

      if (placed) {
        positions.push(word);
      }
    });

    setWordPositions(positions);
  }, [data, dimensions, isLoading, maxFontSize, maxWords, minFontSize]);

  if (isLoading) {
    return <LoadingPlaceholder height={350} className={className} />;
  }

  if (!data.length) {
    return (
      <div
        className={`flex items-center justify-center h-[350px] bg-gray-50 dark:bg-gray-800/30 rounded-lg ${className}`}
      >
        <p className="text-muted-foreground">No keywords available</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[350px] bg-gradient-to-br from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-800/80 rounded-lg overflow-hidden shadow-inner ${className}`}
    >
      {wordPositions.length === 0 && !isLoading ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <svg
            className="w-12 h-12 mb-4 text-gray-300 dark:text-gray-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
            />
          </svg>
          <p className="text-center text-gray-500 dark:text-gray-400">
            No keywords could be displayed
          </p>
          <p className="text-center text-sm mt-1 text-gray-400 dark:text-gray-500">
            Try adjusting the size of the window
          </p>
        </div>
      ) : (
        wordPositions.map(word => (
          <div
            key={word.keyword}
            className="absolute transform -translate-y-1/2 transition-all duration-300 cursor-pointer animate-fadeIn"
            style={{
              left: `${word.x}px`,
              top: `${word.y}px`,
              fontSize: `${word.fontSize}px`,
              fontWeight: 700,
              color: word.color,
              opacity: hoveredWord && hoveredWord !== word.keyword ? 0.2 : 1,
              transform: `translateY(-50%) ${hoveredWord === word.keyword ? 'scale(1.2)' : 'scale(1)'}`,
              textShadow:
                hoveredWord === word.keyword
                  ? '0 2px 10px rgba(0,0,0,0.15), 0 0 2px rgba(0,0,0,0.1)'
                  : '0 1px 3px rgba(0,0,0,0.07)',
              animationDelay: word.animationDelay,
              transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
              letterSpacing: '-0.01em',
            }}
            onMouseEnter={() => setHoveredWord(word.keyword)}
            onMouseLeave={() => setHoveredWord(null)}
            onClick={() => onClick && onClick(word.keyword)}
            title={`${word.keyword}: ${word.count} (${word.percentage.toFixed(1)}%)`}
          >
            {word.keyword}
          </div>
        ))
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.5) translateY(-50%);
            filter: blur(3px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(-50%);
            filter: blur(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
      `}</style>
    </div>
  );
};
