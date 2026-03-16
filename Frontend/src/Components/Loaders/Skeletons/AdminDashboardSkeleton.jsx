import React from 'react';

export default function AdminDashboardSkeleton() {
  return (
    // <div className="min-h-screen bg-[var(--bg-background)] p-4 md:p-8 transition-colors duration-300 pointer-events-none select-none">
      <>
      {/* 
        ========================================================
        THEME CSS VARIABLES (Dark / Light / Custom Adaptable)
        ========================================================
        Using exactly the same CSS variables as the actual dashboard
        to ensure the skeleton flawlessly matches the live UI.
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

      <div className="max-w-[1400px] mx-auto space-y-8">
        
        {/* =========================================
            PAGE HEADER SKELETON
            ========================================= */}
        <header className="flex flex-col gap-2.5">
          <div className="h-10 w-48 sm:w-64 bg-[var(--bg-surface)] rounded-xl animate-pulse"></div>
          <div className="h-4 w-56 sm:w-72 bg-[var(--bg-surface)]/60 rounded-lg animate-pulse"></div>
        </header>

        {/* =========================================
            OVERVIEW STAT BOXES SKELETON
            ========================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div 
              key={idx} 
              className="bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-2xl p-6 shadow-sm"
            >
              <div className="flex justify-between items-start mb-6">
                {/* Title Placeholder */}
                <div className="h-4 w-28 bg-[var(--bg-surface)] rounded-md animate-pulse"></div>
                {/* Icon Placeholder */}
                <div className="w-10 h-10 rounded-xl bg-[var(--bg-surface)] animate-pulse"></div>
              </div>
              {/* Value Placeholder */}
              <div className="h-8 w-32 bg-[var(--bg-surface)]/80 rounded-lg animate-pulse"></div>
            </div>
          ))}
        </div>

        {/* =========================================
            MAIN CONTENT SECTION (Split Layout)
            ========================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch h-full">
          
          {/* LEFT SECTION: PAYMENT LOGS SKELETON */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-2xl shadow-sm flex flex-col h-[500px] overflow-hidden">
            
            {/* Header */}
            <div className="p-5 sm:p-6 border-b border-[var(--border-muted)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[var(--bg-surface)]/30 shrink-0">
              <div className="h-6 w-40 bg-[var(--bg-surface)] rounded-lg animate-pulse"></div>
              {/* Date Selector Placeholder */}
              <div className="h-10 w-36 bg-[var(--bg-surface)] rounded-xl animate-pulse"></div>
            </div>

            {/* List Body Skeleton */}
            <div className="flex-1 p-4 flex flex-col gap-2">
              {[1, 2, 3, 4, 5].map((idx) => (
                <div 
                  key={idx} 
                  className="flex items-center justify-between p-3.5 rounded-xl border border-transparent"
                >
                  <div className="flex flex-col gap-2.5">
                    {/* User Name Placeholder */}
                    <div className="h-4 w-32 sm:w-40 bg-[var(--bg-surface)] rounded-md animate-pulse"></div>
                    {/* Details Placeholder */}
                    <div className="h-3 w-48 sm:w-56 bg-[var(--bg-surface)]/60 rounded-md animate-pulse"></div>
                  </div>
                  <div className="flex flex-col items-end gap-2.5">
                    {/* Amount Placeholder */}
                    <div className="h-5 w-20 bg-[var(--bg-surface)] rounded-md animate-pulse"></div>
                    {/* Badge Placeholder */}
                    <div className="h-5 w-16 bg-[var(--bg-surface)]/60 rounded-md animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SECTION: NEW USERS SKELETON */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-2xl shadow-sm flex flex-col h-[500px] overflow-hidden">
            
            {/* Header */}
            <div className="p-5 sm:p-6 border-b border-[var(--border-muted)] flex justify-between items-center bg-[var(--bg-surface)]/30 shrink-0">
              <div className="h-6 w-32 bg-[var(--bg-surface)] rounded-lg animate-pulse"></div>
              {/* Icon Placeholder */}
              <div className="w-8 h-8 rounded-lg bg-[var(--bg-surface)] animate-pulse"></div>
            </div>

            {/* List Body Skeleton */}
            <div className="flex-1 p-4 flex flex-col gap-1">
              {[1, 2, 3, 4, 5, 6].map((idx) => (
                <div 
                  key={idx} 
                  className="flex items-center justify-between p-3.5 rounded-xl border border-transparent"
                >
                  <div className="flex items-center gap-3.5">
                    {/* Avatar Placeholder */}
                    <div className="w-10 h-10 rounded-full bg-[var(--bg-surface)] animate-pulse shrink-0"></div>
                    <div className="flex flex-col gap-2.5">
                      {/* Name Placeholder */}
                      <div className="h-4 w-28 sm:w-36 bg-[var(--bg-surface)] rounded-md animate-pulse"></div>
                      {/* Date Placeholder */}
                      <div className="h-3 w-24 bg-[var(--bg-surface)]/60 rounded-md animate-pulse"></div>
                    </div>
                  </div>
                  {/* Seat Badge Placeholder */}
                  <div className="h-7 w-16 bg-[var(--bg-surface)] rounded-lg animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
      </>
    // </div>
  );
}