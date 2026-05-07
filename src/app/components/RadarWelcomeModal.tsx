import { motion, AnimatePresence } from 'motion/react';
import React, { useRef, useCallback } from 'react';

interface RadarWelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function ProductIllustration() {
  /* ── Layout constants ── */
  const W = 400, cardW = 260, cardX = (W - cardW) / 2;
  const headerH = 40, rowH = 42, rowGap = 6, footerH = 38;
  const px = 14, rowInner = cardW - px * 2;
  const rowY = (i: number) => 24 + headerH + 8 + i * (rowH + rowGap);
  const rows = [
    { label: 'Show Line Items', sub: 'Expand items under this section', iconFill: '#FDE8E4', iconStroke: '#C0605D', on: false },
    { label: 'Show Line-Item Prices', sub: 'Display individual line prices', iconFill: '#E8E4FA', iconStroke: '#6360B8', on: false },
    { label: 'Show Section Total', sub: 'Display aggregate subtotal', iconFill: '#D1F0E0', iconStroke: '#2E8B5E', on: true },
    { label: 'Hide Section', sub: 'Hide from customer view', iconFill: '#F5D5DD', iconStroke: '#B5607A', on: false },
  ];
  const cardH = headerH + 8 + rows.length * (rowH + rowGap) + 6 + footerH + 10;
  const totalH = 24 + cardH + 24;

  return (
    <svg viewBox={`0 0 ${W} ${totalH}`} fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
      <defs>
        <filter id="cs" x="-20%" y="-12%" width="140%" height="140%">
          <feDropShadow dx="0" dy="10" stdDeviation="18" floodColor="#3D2C28" floodOpacity="0.13" />
        </filter>
        <linearGradient id="sb" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#E8603C" /><stop offset="100%" stopColor="#FD5000" />
        </linearGradient>
      </defs>

      {/* Pink bg */}
      <rect width={W} height={totalH} fill="#FBF0ED" />

      {/* Card */}
      <g filter="url(#cs)">
        <rect x={cardX} y="24" width={cardW} height={cardH} rx="16" fill="#FFFFFF" />

        {/* ── Header ── */}
        <circle cx={cardX + 18} cy={24 + 20} r="5" fill="#FD5000" />
        <text x={cardX + 30} y={24 + 24} fontFamily="system-ui,-apple-system,sans-serif" fontSize="12.5" fontWeight="700" fill="#1C1E21">Section Settings</text>
        {/* X button */}
        <g transform={`translate(${cardX + cardW - 22},${24 + 14})`} opacity="0.28">
          <line x1="0" y1="0" x2="10" y2="10" stroke="#1C1E21" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="10" y1="0" x2="0" y2="10" stroke="#1C1E21" strokeWidth="1.6" strokeLinecap="round" />
        </g>

        {/* ── Rows ── */}
        {rows.map((r, i) => {
          const y = rowY(i);
          const rx = cardX + px;
          const active = r.on;
          const iconSize = 24;
          const iconX = rx + 8;
          const iconY = y + (rowH - iconSize) / 2;
          const toggleX = rx + rowInner - 30;
          const toggleY = y + (rowH - 14) / 2;

          return (
            <g key={i}>
              {/* Active glow */}
              {active && <rect x={rx - 4} y={y - 4} width={rowInner + 8} height={rowH + 8} rx="14" fill="#FD5000" opacity="0.06" />}
              {/* Row bg */}
              <rect x={rx} y={y} width={rowInner} height={rowH} rx="11"
                fill={active ? '#FFFFFF' : '#F7F5F4'}
                stroke={active ? '#FD5000' : '#EDEAE8'}
                strokeWidth={active ? 1.4 : 0.6}
              />
              {/* Icon badge */}
              <rect x={iconX} y={iconY} width={iconSize} height={iconSize} rx="7" fill={r.iconFill} />
              {/* Icon glyph */}
              {i === 0 && (
                <g transform={`translate(${iconX + 12},${iconY + 12})`}>
                  <ellipse cx="0" cy="0" rx="4.5" ry="3" fill="none" stroke={r.iconStroke} strokeWidth="1.3" />
                  <circle cx="0" cy="0" r="1.5" fill={r.iconStroke} />
                </g>
              )}
              {i === 1 && (
                <g transform={`translate(${iconX + 12},${iconY + 12})`}>
                  <circle cx="0" cy="0" r="4.5" fill="none" stroke={r.iconStroke} strokeWidth="1.3" />
                  <line x1="0" y1="-6.5" x2="0" y2="-2.5" stroke={r.iconStroke} strokeWidth="1.3" strokeLinecap="round" />
                  <line x1="0" y1="2.5" x2="0" y2="6.5" stroke={r.iconStroke} strokeWidth="1.3" strokeLinecap="round" />
                  <line x1="-6.5" y1="0" x2="-2.5" y2="0" stroke={r.iconStroke} strokeWidth="1.3" strokeLinecap="round" />
                  <line x1="2.5" y1="0" x2="6.5" y2="0" stroke={r.iconStroke} strokeWidth="1.3" strokeLinecap="round" />
                </g>
              )}
              {i === 2 && (
                <g transform={`translate(${iconX + 12},${iconY + 12})`}>
                  <rect x="-5.5" y="-3.5" width="11" height="7" rx="1.5" fill="none" stroke={r.iconStroke} strokeWidth="1.3" />
                  <line x1="-5.5" y1="-0.5" x2="5.5" y2="-0.5" stroke={r.iconStroke} strokeWidth="1.3" />
                </g>
              )}
              {i === 3 && (
                <g transform={`translate(${iconX + 12},${iconY + 12})`}>
                  <path d="M-2,-4 A4,4 0 0,1 4,2" fill="none" stroke={r.iconStroke} strokeWidth="1.3" strokeLinecap="round" />
                  <path d="M2,4 A4,4 0 0,1 -4,-2" fill="none" stroke={r.iconStroke} strokeWidth="1.3" strokeLinecap="round" />
                  <line x1="-1.5" y1="1.5" x2="1.5" y2="-1.5" stroke={r.iconStroke} strokeWidth="1.3" strokeLinecap="round" />
                </g>
              )}

              {/* Label + sub */}
              <text x={iconX + iconSize + 8} y={y + 17} fontFamily="system-ui,-apple-system,sans-serif" fontSize="9.5" fontWeight={active ? '700' : '600'} fill="#1C1E21">{r.label}</text>
              <text x={iconX + iconSize + 8} y={y + 29} fontFamily="system-ui,-apple-system,sans-serif" fontSize="7" fill={active ? '#6B7280' : '#A8A09C'}>{r.sub}</text>

              {/* Toggle */}
              <rect x={toggleX} y={toggleY} width="26" height="14" rx="7" fill={active ? '#FD5000' : '#DDD8D5'} />
              <circle cx={active ? toggleX + 19 : toggleX + 7} cy={toggleY + 7} r="5" fill="white" />
            </g>
          );
        })}


        {/* ── Footer ── */}
        {(() => {
          const fy = 24 + headerH + 8 + rows.length * (rowH + rowGap) + 6;
          return (
            <g>
              <line x1={cardX + px} y1={fy} x2={cardX + cardW - px} y2={fy} stroke="#F0ECEB" strokeWidth="0.7" />
              {/* Cancel */}
              <rect x={cardX + cardW - px - 118} y={fy + 8} width={52} height={24} rx="7" fill="#FFFFFF" stroke="#E0DBD8" strokeWidth="0.7" />
              <text x={cardX + cardW - px - 92} y={fy + 24} fontFamily="system-ui,-apple-system,sans-serif" fontSize="8.5" fontWeight="500" fill="#6D5F63" textAnchor="middle">Cancel</text>
              {/* Save */}
              <rect x={cardX + cardW - px - 60} y={fy + 8} width={60} height={24} rx="7" fill="url(#sb)" />
              <text x={cardX + cardW - px - 30} y={fy + 24} fontFamily="system-ui,-apple-system,sans-serif" fontSize="9" fontWeight="700" fill="white" textAnchor="middle">Save</text>
            </g>
          );
        })()}
      </g>
    </svg>
  );
}

export function RadarWelcomeModal({ isOpen, onClose }: RadarWelcomeModalProps) {
  const svgRef = useRef<HTMLDivElement>(null);

  const handleDownload = useCallback(() => {
    const svgEl = svgRef.current?.querySelector('svg');
    if (!svgEl) return;
    const scale = 3; // 3x for high quality
    const clone = svgEl.cloneNode(true) as SVGSVGElement;
    const vb = svgEl.viewBox.baseVal;
    const w = vb.width || 400;
    const h = vb.height || 340;
    clone.setAttribute('width', String(w));
    clone.setAttribute('height', String(h));
    const svgData = new XMLSerializer().serializeToString(clone);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = w * scale;
      canvas.height = h * scale;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      canvas.toBlob((blob) => {
        if (!blob) return;
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'sense-illustration.png';
        a.click();
        URL.revokeObjectURL(a.href);
      }, 'image/png');
    };
    img.src = url;
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="relative w-full max-w-[420px] mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div ref={svgRef}>
              <ProductIllustration />
            </div>

            <div className="px-8 pt-5 pb-8 text-center">
              <h2 className="text-xl font-bold text-[#221E1F] mb-2">Welcome to Radar</h2>
              <p className="text-sm text-[#7A706C] leading-relaxed mb-6">
                Your real-time dashboard to track KPIs, charts, and business insights — all in one place.
              </p>
              <button
                onClick={handleDownload}
                className="w-full py-3 px-6 rounded-xl text-white text-sm font-semibold bg-gradient-to-r from-[#221E1F] to-[#6D5F63] hover:opacity-90 active:scale-[0.98] transition-all duration-150 cursor-pointer"
              >
                Download Illustration
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
