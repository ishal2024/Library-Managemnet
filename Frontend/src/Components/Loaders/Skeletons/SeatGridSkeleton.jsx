import React from 'react';

// ==========================================
// 1️⃣ SUB-COMPONENT: Seat Block Skeleton
// ==========================================
const SeatBlockSkeleton = () => {
  return (
    <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-xl bg-[var(--bg-surface)] animate-pulse shrink-0"></div>
  );
};

// ==========================================
// 2️⃣ SUB-COMPONENT: Seat Grid Layout Skeleton
// ==========================================
const SeatGridSkeleton = () => {
  return (
    <div className="w-full flex flex-col items-center">
      
      {/* Top Labels Placeholder (Entry, Lockers, Bathroom) */}
      <div className="w-full max-w-3xl flex justify-between items-center px-4 md:px-12 mb-10">
        {[1, 2, 3].map((idx) => (
          <div key={idx} className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--bg-surface)] animate-pulse"></div>
            <div className="w-12 h-2 rounded bg-[var(--bg-surface)] animate-pulse"></div>
          </div>
        ))}
      </div>

      {/* Seat Matrix: 6 Rows with Aisle */}
      <div className="flex flex-col w-full max-w-3xl items-center relative">
        {[...Array(6)].map((_, rowIndex) => {
          // Group rows in pairs (clusters)
          let mbClass = 'mb-3 sm:mb-4';
          if (rowIndex === 1 || rowIndex === 3) mbClass = 'mb-10 sm:mb-14 relative';
          if (rowIndex === 5) mbClass = '';

          return (
            <div key={rowIndex} className={`flex justify-center items-center gap-6 sm:gap-12 md:gap-20 w-full ${mbClass}`}>
              
              {/* Left Column (3 seats) */}
              <div className="flex gap-2 sm:gap-3">
                {[...Array(3)].map((_, seatIdx) => (
                  <SeatBlockSkeleton key={`left-${rowIndex}-${seatIdx}`} />
                ))}
              </div>

              {/* Right Column (4 seats) */}
              <div className="flex gap-2 sm:gap-3">
                {[...Array(4)].map((_, seatIdx) => (
                  <SeatBlockSkeleton key={`right-${rowIndex}-${seatIdx}`} />
                ))}
              </div>

              {/* Cluster Divider Skeleton */}
              {(rowIndex === 1 || rowIndex === 3) && (
                <div className="absolute -bottom-6 sm:-bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-px bg-[var(--border-muted)]"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ==========================================
// 3️⃣ SUB-COMPONENT: Seat Details Panel Skeleton
// ==========================================
const SeatDetailsSkeleton = () => {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-2xl shadow-sm flex flex-col w-full min-h-[500px] lg:sticky lg:top-6">
      
      {/* Panel Header */}
      <div className="px-6 py-5 border-b border-[var(--border-muted)] bg-[var(--bg-surface)]/30 flex justify-between items-center shrink-0">
        <div className="w-32 h-6 bg-[var(--bg-surface)] rounded-lg animate-pulse"></div>
        {/* Seat Badge Skeleton */}
        <div className="w-16 h-6 bg-[var(--bg-surface)] rounded-md animate-pulse"></div>
      </div>

      <div className="p-6 flex-1 flex flex-col gap-6">
        
        {/* Profile Row */}
        <div className="flex items-center gap-4 border-b border-[var(--border-muted)]/60 pb-6">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-[var(--bg-surface)] animate-pulse shrink-0"></div>
          {/* Name & Badge lines */}
          <div className="flex flex-col gap-2.5 w-full">
            <div className="w-3/4 h-5 bg-[var(--bg-surface)] rounded-md animate-pulse"></div>
            <div className="w-1/2 h-4 bg-[var(--bg-surface-hover)] rounded-md animate-pulse"></div>
          </div>
        </div>

        {/* Compact Detail Lines */}
        <div className="flex flex-col gap-4">
          {[...Array(5)].map((_, idx) => (
            <div key={idx} className="flex justify-between items-center">
              {/* Label */}
              <div className="w-24 h-4 bg-[var(--bg-surface-hover)] rounded-md animate-pulse"></div>
              {/* Value */}
              <div className="w-32 h-4 bg-[var(--bg-surface)] rounded-md animate-pulse"></div>
            </div>
          ))}
        </div>

        {/* Notes Block Skeleton */}
        <div className="flex flex-col gap-2 mt-2">
          <div className="w-16 h-3 bg-[var(--bg-surface)] rounded animate-pulse"></div>
          <div className="w-full h-20 bg-[var(--bg-surface)]/40 border border-[var(--border-muted)] rounded-xl animate-pulse"></div>
        </div>

        {/* Action Buttons Skeleton */}
        <div className="flex gap-3 pt-4 border-t border-[var(--border-muted)] mt-auto">
          <div className="flex-1 h-11 bg-[var(--bg-surface)] rounded-xl animate-pulse"></div>
          <div className="flex-1 h-11 bg-[var(--bg-surface)] rounded-xl animate-pulse"></div>
        </div>

      </div>
    </div>
  );
};

// ==========================================
// 4️⃣ MAIN COMPONENT: Live Seat Matrix Skeleton
// ==========================================
export default function LiveSeatMatrixSkeleton() {
  return (
       <>
      {/* 
        ========================================================
        THEME CSS VARIABLES
        ========================================================
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
            <div className="h-8 w-56 sm:w-64 bg-[var(--bg-surface)] rounded-lg animate-pulse"></div>
            <div className="h-4 w-64 sm:w-80 bg-[var(--bg-surface-hover)] rounded-md animate-pulse"></div>
          </div>
          
          <div className="h-10 w-28 bg-[var(--bg-surface)] rounded-xl animate-pulse"></div>
        </header>

        {/* --- MAIN LAYOUT (Seat Matrix + Details Panel) --- */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          
          {/* LEFT SECTION: Seat Matrix Container */}
          <div className="w-full lg:w-[65%] xl:w-[70%] bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-2xl p-6 lg:p-8 shadow-sm flex flex-col items-center">
            
            {/* Matrix Container Header */}
            <div className="w-full flex justify-between items-center mb-8">
               <div className="h-6 w-40 bg-[var(--bg-surface)] rounded-md animate-pulse"></div>
               <div className="hidden sm:block h-6 w-64 bg-[var(--bg-surface-hover)] rounded-md animate-pulse"></div>
            </div>

            <SeatGridSkeleton />

          </div>

          {/* RIGHT SECTION: Seat Details Sticky Panel */}
          <div className="w-full lg:w-[35%] xl:w-[30%]">
            <SeatDetailsSkeleton />
          </div>

        </div>

      </div>
    </> 
  );
}