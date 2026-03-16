import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  User,
  Phone,
  MapPin,
  Calendar,
  AlignLeft,
  Armchair
} from 'lucide-react';

// --- HELPER FUNCTION ---
const getInitials = (name) => {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  return parts.length > 1 
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name[0].toUpperCase();
};

export default function AssignedSeatOverviewModal({ 
  isOpen, 
  onClose,
  seatData 
}) {


  const [isDemoOpen, setIsDemoOpen] = useState(false);

  const modalRef = useRef(null);

  // --- Effects ---

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  },[isOpen]);

  // Handle outside click
  const handleOverlayClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  return (
    <>
      {/* 
        ========================================================
        THEME CSS VARIABLES (Dark / Light / Custom Adaptable)
        ========================================================
      */}
      <style>{`
        :root {
          --bg-background: #09090b;       
          --bg-card: #18181b;             
          --bg-surface: #27272a;          
          --bg-surface-hover: #3f3f46;    
          
          --text-primary: #f4f4f5;        
          --text-secondary: #a1a1aa;      
          --text-muted: #71717a;          
          
          --border-muted: #27272a;        
          --border-focus: #3f3f46;        
          
          --accent-primary: #3b82f6;      
          --accent-transparent: rgba(59, 130, 246, 0.1);
        }
      `}</style>

    

      {/* MODAL OVERLAY */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onMouseDown={handleOverlayClick}
        >
          {/* MODAL CARD */}
          <div 
            ref={modalRef}
            className="w-full max-w-[420px] bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
          >
            
            {/* 1️⃣ MODAL HEADER */}
            <div className="flex justify-between items-center px-5 py-4 border-b border-[var(--border-muted)] bg-[var(--bg-card)]">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[var(--accent-transparent)] text-[var(--accent-primary)]">
                  <Armchair size={18} />
                </div>
                <h2 className="text-base font-bold text-[var(--text-primary)] tracking-tight">
                  Seat Assignment Overview
                </h2>
              </div>
              <button 
                onClick={onClose}
                className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] rounded-lg transition-colors"
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* 2️⃣ MODAL CONTENT */}
            <div className="p-5 flex flex-col gap-5">
              
              {/* Single Card Container for all info */}
              <div className="bg-[var(--bg-surface)]/40 border border-[var(--border-muted)] rounded-xl p-1 flex flex-col">
                
                {/* User Profile Row */}
                <div className="p-4 flex items-center gap-4 border-b border-[var(--border-muted)]/60 bg-[var(--bg-card)]/50 rounded-t-lg">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--accent-primary)]/20 to-purple-500/20 border border-[var(--accent-primary)]/30 flex items-center justify-center text-[var(--accent-primary)] font-bold text-lg shrink-0 shadow-inner">
                    {getInitials(seatData?.userDetail?.name)}
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-base font-bold text-[var(--text-primary)] leading-tight">{seatData?.userDetail?.name}</h3>
                    <p className="text-sm text-[var(--text-secondary)] mt-0.5">{seatData?.userDetail?.contact}</p>
                  </div>
                </div>

                {/* Compact Details Rows */}
                <div className="p-4 flex flex-col gap-3.5">
                  <DetailRow icon={<MapPin />} label="Address" value={seatData?.userDetail?.address} />
                  <DetailRow icon={<Calendar />} label="Assigned Date" value={new Date(seatData?.userDetail?.seatId?.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })} />
                </div>

              </div>

              {/* Notes Display Section */}
              <div className="flex flex-col gap-2">
                <h4 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-1.5">
                  <AlignLeft size={14} /> Notes
                </h4>
                <div className="bg-[var(--bg-surface)] border border-[var(--border-muted)] rounded-lg p-3.5 shadow-sm">
                  {seatData?.userDetail?.seatId?.notes ? (
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed italic">
                      "{seatData?.userDetail?.seatId?.notes}"
                    </p>
                  ) : (
                    <p className="text-sm text-[var(--text-muted)] italic">
                      No notes provided for this assignment.
                    </p>
                  )}
                </div>
              </div>

            </div>

          </div>
        </div>
      )}
    </>
  );
}

// --- SUB-COMPONENT: Detail Row ---
function DetailRow({ icon, label, value, highlight = false }) {
  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-2.5 text-[var(--text-secondary)]">
        <span className="text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] transition-colors">
          {React.cloneElement(icon, { size: 14 })}
        </span>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="text-sm font-medium text-right text-[var(--text-primary)] max-w-[60%] truncate">
        {highlight ? (
          <span className="bg-[var(--bg-card)] border border-[var(--border-muted)] text-[var(--text-primary)] px-2.5 py-1 rounded-md shadow-sm">
            {value}
          </span>
        ) : (
          value
        )}
      </div>
    </div>
  );
}