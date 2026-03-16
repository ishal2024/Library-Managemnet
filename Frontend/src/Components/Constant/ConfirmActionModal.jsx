import React, { useEffect, useRef } from 'react';
import { AlertTriangle, Trash2, X, AlertOctagon } from 'lucide-react';
import Spinner from '../Loaders/Spinner/Spinner';

export default function ConfirmActionModal({
  title = "Confirm Action",
  description = "Are you sure you want to proceed? This action cannot be undone.",
  disclaimer,
  onConfirm,
  onCancel,
  open,
  spinnerOpen
}) {
  const cancelBtnRef = useRef(null);

  // --- Effects for Accessibility ---

  // Focus trap & Escape key listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && open) {
        onCancel();
      }
    };

    if (open) {
      window.addEventListener('keydown', handleKeyDown);
      // Auto-focus the cancel button to prevent accidental enter key confirmations
      // Small timeout ensures the element is in the DOM before focusing
      setTimeout(() => {
        cancelBtnRef.current?.focus();
      }, 10);
    }

    return () => window.removeEventListener('keydown', handleKeyDown);
  },[open, onCancel]);

  // Handle clicking outside the modal
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  // Do not render anything if modal is not open
  if (!open) return null;

  return (
    <>
      {/* 
        ========================================================
        THEME CSS VARIABLES (Dark / Light / Custom Adaptable)
        ========================================================
        Using CSS custom properties enables instant theme switching.
        These match the SaaS aesthetic from previous components.
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
          
          --danger: #ef4444;              
          --danger-hover: #dc2626;
          --danger-bg: rgba(239, 68, 68, 0.1);
          --danger-border: rgba(239, 68, 68, 0.2);
        }
      `}</style>

      {/* MODAL OVERLAY */}
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6 animate-in fade-in duration-200"
        onMouseDown={handleOverlayClick}
        aria-modal="true"
        role="dialog"
      >
        {/* MODAL CARD */}
        <div 
          className="w-full max-w-[450px] bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        >
          {/* 1️⃣ MODAL HEADER */}
          <div className="flex justify-between items-start p-5 sm:p-6 border-b border-[var(--border-muted)] bg-[var(--bg-card)] shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[var(--danger-bg)] border border-[var(--danger-border)] flex items-center justify-center shrink-0 shadow-inner">
                <AlertTriangle size={24} className="text-[var(--danger)]" />
              </div>
              <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">
                {title}
              </h2>
            </div>
            <button 
              onClick={onCancel}
              className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] rounded-lg transition-colors"
              title="Close"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>

          {/* 2️⃣ MODAL BODY (CONTENT) */}
          <div className="p-5 sm:p-6 flex flex-col gap-5">
            
            {/* Description */}
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {description}
            </p>

            {/* Disclaimer (Optional) */}
            {disclaimer && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-[var(--danger-bg)] border border-[var(--danger-border)]">
                <AlertOctagon size={18} className="text-[var(--danger)] shrink-0 mt-0.5" />
                <p className="text-xs font-medium text-[var(--danger)] leading-relaxed">
                  {disclaimer}
                </p>
              </div>
            )}

          </div>

          {/* 3️⃣ MODAL FOOTER (ACTIONS) */}
          <div className="p-5 sm:p-6 border-t border-[var(--border-muted)] bg-[var(--bg-surface)]/30 shrink-0 flex justify-end gap-3">
            <button
              ref={cancelBtnRef}
              onClick={onCancel}
              disabled = {spinnerOpen}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-[var(--text-primary)] bg-transparent border border-[var(--border-muted)] hover:bg-[var(--bg-surface)] hover:border-[var(--border-focus)] transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)]"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled = {spinnerOpen}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-[var(--danger)] to-[var(--danger-hover)] hover:opacity-90 shadow-lg shadow-[var(--danger)]/20 hover:shadow-[var(--danger)]/40 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[var(--danger)]/50"
            >
              {!spinnerOpen ?
              <>
              <Trash2 size={16} strokeWidth={2.5} />
              Delete
              </>
              :
              <Spinner />
              }
            </button>
          </div>

        </div>
      </div>
    </>
  );
}


 