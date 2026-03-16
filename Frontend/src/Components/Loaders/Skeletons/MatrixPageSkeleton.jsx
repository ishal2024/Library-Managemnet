import React from 'react';

// ==========================================
// 1️⃣ SUB-COMPONENT: Stat Card Skeleton
// ==========================================
const StatCardSkeleton = () => {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-xl p-5 shadow-sm flex flex-col gap-4">
      <div className="flex justify-between items-start">
        {/* Title Line Skeleton */}
        <div className="h-4 w-24 bg-[var(--bg-surface)] rounded-md animate-pulse"></div>
        {/* Icon Circle Skeleton */}
        <div className="w-10 h-10 rounded-xl bg-[var(--bg-surface)] animate-pulse"></div>
      </div>
      {/* Large Number Skeleton */}
      <div className="h-8 w-20 bg-[var(--bg-surface)] rounded-lg animate-pulse mt-1"></div>
    </div>
  );
};

// ==========================================
// 2️⃣ SUB-COMPONENT: Matrix Card Skeleton
// ==========================================
const MatrixCardSkeleton = () => {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-lg p-4 flex flex-col justify-between aspect-square transition-colors duration-300">
      
      {/* Top Row: Number/ID & Badge */}
      <div className="flex justify-between items-start mb-3">
        {/* Small Number Skeleton */}
        <div className="h-5 w-8 bg-[var(--bg-surface)] rounded-md animate-pulse"></div>
        {/* Small Badge Skeleton */}
        <div className="h-4 w-12 bg-[var(--bg-surface)] rounded-full animate-pulse"></div>
      </div>

      {/* Middle: User Name / Details Lines */}
      <div className="flex-1 flex flex-col gap-2 justify-center">
        <div className="h-3 w-3/4 bg-[var(--bg-surface)] rounded-md animate-pulse"></div>
        <div className="h-3 w-1/2 bg-[var(--bg-surface-hover)] rounded-md animate-pulse"></div>
      </div>

      {/* Bottom: Action Button */}
      <div className="h-8 w-full bg-[var(--bg-surface)] rounded-md animate-pulse mt-3"></div>
      
    </div>
  );
};

// ==========================================
// 3️⃣ SUB-COMPONENT: Matrix Grid Skeleton
// ==========================================
const MatrixGridSkeleton = () => {
  // Generating 24 cards to ensure the grid looks full and realistic on all screen sizes
  const items = Array.from({ length: 24 });
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
      {items.map((_, index) => (
        <MatrixCardSkeleton key={index} />
      ))}
    </div>
  );
};

// ==========================================
// 4️⃣ MAIN COMPONENT: Matrix Page Skeleton
// ==========================================
export default function MatrixPageSkeleton() {
  return (
      <>
      {/* 
        ========================================================
        THEME CSS VARIABLES
        ========================================================
        These variables ensure the skeleton perfectly matches 
        your SaaS theme for both dark and light modes.
      */}
      <style>{`
        :root {
          --bg-background: #09090b;       
          --bg-card: #18181b;             
          --bg-surface: #27272a;          
          --bg-surface-hover: #3f3f46;    
          --border-muted: #27272a;        
        }
      `}</style>

      <div className="max-w-[1600px] mx-auto space-y-8">
        
        {/* --- PAGE HEADER SKELETON --- */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col gap-2.5">
            {/* Title Skeleton */}
            <div className="h-8 w-48 sm:w-64 bg-[var(--bg-surface)] rounded-lg animate-pulse"></div>
            {/* Subtitle Skeleton */}
            <div className="h-4 w-64 sm:w-80 bg-[var(--bg-surface-hover)] rounded-md animate-pulse"></div>
          </div>
          {/* Action / Filter Button Skeleton */}
          <div className="h-10 w-32 bg-[var(--bg-surface)] rounded-xl animate-pulse"></div>
        </header>

        {/* --- STATS SECTION SKELETON --- */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>

        {/* --- MAIN MATRIX GRID CONTAINER --- */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-2xl p-5 sm:p-6 lg:p-8 shadow-sm flex flex-col gap-6">
          
          {/* Optional Matrix Container Header (Filter/Search bar placeholders) */}
          <div className="flex justify-between items-center">
             <div className="h-6 w-32 bg-[var(--bg-surface)] rounded-md animate-pulse"></div>
             <div className="h-8 w-24 bg-[var(--bg-surface)] rounded-md animate-pulse"></div>
          </div>

          <MatrixGridSkeleton />
          
        </div>

      </div>
     </>
  );
}