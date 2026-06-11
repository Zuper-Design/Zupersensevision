import { useEffect, useState } from 'react';
import { Ruler, Plus, Check, Layers, Maximize2 } from 'lucide-react';
import { ROOF_FACETS, ROOF_EDGES, ROOF_LINES, ROOF_DEFAULTS, ROOF_IMAGE_URL, ROOF_IMAGE_CREDIT, slopeMultiplier, polygonCentroid, type RoofFacet } from './buildData';
import { token } from './tokens';

// Roof Draw — an aerial roof traced into measured facets (Hover/EagleView style).
// True surface area = footprint × the pitch's slope multiplier; the rail rolls
// everything up to squares × waste, plus ridge/hip/valley line totals.
interface Props {
  isViewer?: boolean;
  selectedFacetId?: string | null;
  onSelectFacet?: (id: string) => void;
}

const trueArea = (f: RoofFacet) => f.planeArea * slopeMultiplier(f.pitch);
const ptsToStr = (pts: [number, number][]) => pts.map((p) => p.join(',')).join(' ');

// Edge topology is data-viz, not status — differentiated by tone + line style
// so the layer stays legible inside the achromatic system (DESIGN.md 3).
const EDGE_STYLE: Record<string, { color: string; dash?: string; label: string }> = {
  ridge: { color: '#000000', label: 'Ridge' },
  hip: { color: '#636363', label: 'Hip' },
  valley: { color: '#959595', dash: '2 2', label: 'Valley' },
  eave: { color: '#636363', dash: '4 3', label: 'Eave' },
};

export function RoofDrawCanvas({ isViewer, selectedFacetId, onSelectFacet }: Props) {
  const [loading, setLoading] = useState(true);
  const [waste, setWaste] = useState(ROOF_DEFAULTS.wastePct);
  const [localSel, setLocalSel] = useState<string | null>('f-1');
  const [showLines, setShowLines] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 280); return () => clearTimeout(t); }, []);

  const sel = selectedFacetId ?? localSel;
  const pick = (id: string) => { setLocalSel(id); onSelectFacet?.(id); };

  const totalTrue = ROOF_FACETS.reduce((s, f) => s + trueArea(f), 0);
  const baseSquares = totalTrue / 100;
  const orderSquares = baseSquares * (1 + waste / 100);
  const pitchPredominant = '6/12';

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ background: '#F8F8F8' }}>
      {/* toolbar */}
      <div className="flex items-center gap-2.5 px-4 h-14 flex-shrink-0">
        <span className="w-8 h-8 rounded-2xl bg-white border border-[rgba(0,0,0,0.06)] inline-flex items-center justify-center"
          style={{ color: token.color.brand.primary, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <Ruler className="w-4 h-4" />
        </span>
        <div className="min-w-0">
          <p className="text-[15px] font-medium tracking-[-0.015em]" style={{ color: token.color.text.primary }}>Roof draw</p>
          <p className="text-[11px]" style={{ color: token.color.text.muted }}>1428 Oakridge Dr · traced from aerial imagery</p>
        </div>
        <button
          onClick={() => setShowLines((v) => !v)}
          className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-[12px] font-medium ml-2 transition-colors"
          style={{
            background: showLines ? token.color.brand.subtle : '#FFFFFF',
            border: `1px solid ${showLines ? '#FED7AA' : token.color.border.default}`,
            color: showLines ? token.color.brand.primary : token.color.text.secondary,
          }}
        >
          <Layers className="w-3.5 h-3.5" /> Lines
        </button>
        {!isViewer && (
          <button className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-[12px] font-medium transition-colors"
            style={{ background: '#FFFFFF', border: `1px solid ${token.color.border.default}`, color: token.color.text.secondary }}>
            <Plus className="w-3.5 h-3.5" /> Add facet
          </button>
        )}
        <span className="ml-auto text-[11.5px]" style={{ color: token.color.text.muted }}>
          <span className="font-medium" style={{ color: token.color.text.secondary }}>{ROOF_FACETS.length}</span> facets
        </span>
      </div>

      {loading ? (
        <div className="flex-1 p-3 pt-0 flex gap-3">
          <div className="flex-1 rounded-[24px] animate-pulse" style={{ background: token.color.bg.surface, border: `1px solid ${token.color.border.default}` }} />
          <div className="w-[268px] rounded-[24px] animate-pulse" style={{ background: token.color.bg.surface, border: `1px solid ${token.color.border.default}` }} />
        </div>
      ) : (
        <div data-app-reveal className="flex-1 overflow-hidden p-3 pt-0 flex gap-3">
          {/* drawing surface — aerial image + traced facets */}
          <div className="flex-1 rounded-[24px] overflow-hidden relative bg-[#2A2D33]" style={{ border: '1px solid #FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            {/* real aerial roof photo (Unsplash, free license) */}
            <img
              src={ROOF_IMAGE_URL}
              alt="Aerial view of the roof"
              className="absolute inset-0 h-full w-full object-cover"
              draggable={false}
            />
            {/* slight darken so the trace reads clearly */}
            <div className="absolute inset-0 bg-black/5" />

            {/* trace overlay */}
            <svg viewBox="0 0 100 92" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
              {/* facet fills */}
              {ROOF_FACETS.map((f) => {
                const on = sel === f.id;
                return (
                  <polygon
                    key={f.id}
                    points={ptsToStr(f.points)}
                    onClick={() => pick(f.id)}
                    fill={f.color}
                    fillOpacity={on ? 0.42 : 0.2}
                    stroke={f.color}
                    strokeWidth={on ? 1.1 : 0.7}
                    strokeLinejoin="round"
                    style={{ cursor: 'pointer', transition: 'fill-opacity 140ms' }}
                  />
                );
              })}

              {/* measured edges (ridge/hip/eave/valley) */}
              {showLines && ROOF_EDGES.filter((e) => e.kind !== 'valley').map((e) => {
                const s = EDGE_STYLE[e.kind];
                const mx = (e.from[0] + e.to[0]) / 2;
                const my = (e.from[1] + e.to[1]) / 2;
                return (
                  <g key={e.id}>
                    <line x1={e.from[0]} y1={e.from[1]} x2={e.to[0]} y2={e.to[1]}
                      stroke={s.color} strokeWidth={1.1} strokeDasharray={s.dash} strokeLinecap="round" />
                    <g transform={`translate(${mx}, ${my})`}>
                      <rect x={-3.6} y={-1.7} width={7.2} height={3.4} rx={1.7} fill="#FFFFFF" opacity={0.92} />
                      <text x={0} y={0.05} textAnchor="middle" dominantBaseline="middle" fontSize="2.2" fontWeight={700} fill={s.color}>{e.length}</text>
                    </g>
                  </g>
                );
              })}

              {/* vertex handles on the selected facet */}
              {ROOF_FACETS.filter((f) => f.id === sel).flatMap((f) =>
                f.points.map((p, i) => (
                  <circle key={f.id + i} cx={p[0]} cy={p[1]} r={1.2} fill="#FFFFFF" stroke={f.color} strokeWidth={0.9} />
                )),
              )}

              {/* pitch chips at each facet centroid */}
              {ROOF_FACETS.map((f) => {
                const [cx, cy] = polygonCentroid(f.points);
                return (
                  <g key={f.id + '-chip'} style={{ pointerEvents: 'none' }} opacity={sel === f.id ? 1 : 0.85}>
                    <rect x={cx - 4.2} y={cy - 1.9} width={8.4} height={3.8} rx={1.9} fill="#000000" opacity={0.82} />
                    <text x={cx} y={cy + 0.1} textAnchor="middle" dominantBaseline="middle" fontSize="2.2" fontWeight={700} fill="#FFFFFF">{f.pitch}</text>
                  </g>
                );
              })}
            </svg>

            {/* scale + legend chips */}
            <div className="absolute left-3 bottom-3 inline-flex items-center gap-2 h-7 px-2.5 rounded-full bg-white/90 backdrop-blur-sm text-[10.5px] font-medium text-[#636363] border border-[rgba(0,0,0,0.06)]">
              <Maximize2 className="w-3 h-3 text-[#959595]" /> 1 sq = 100 ft²
            </div>
            {showLines && (
              <div className="absolute right-3 bottom-3 inline-flex items-center gap-3 h-7 px-3 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-medium border border-[rgba(0,0,0,0.06)]">
                {(['ridge', 'hip', 'eave'] as const).map((k) => (
                  <span key={k} className="inline-flex items-center gap-1" style={{ color: EDGE_STYLE[k].color }}>
                    <span className="w-2.5 h-[2px] rounded-full" style={{ background: EDGE_STYLE[k].color }} />
                    {EDGE_STYLE[k].label}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* totals rail */}
          <div className="w-[268px] flex flex-col gap-3 overflow-y-auto">
            {/* facet list */}
            <div className="rounded-[20px] overflow-hidden bg-white" style={{ border: `1px solid ${token.color.border.default}` }}>
              <div className="px-3 h-9 flex items-center justify-between text-[10.5px] font-mono uppercase tracking-wide" style={{ color: token.color.text.muted, borderBottom: `1px solid ${token.color.border.hairline}` }}>
                <span>Facets</span>
                <span>{pitchPredominant} predominant</span>
              </div>
              {ROOF_FACETS.map((f) => (
                <button key={f.id} onClick={() => pick(f.id)}
                  className="w-full flex items-center gap-2.5 px-3 h-11 text-left transition-colors hover:bg-[#FAFAFA]"
                  style={{ borderBottom: `1px solid ${token.color.border.hairline}`, background: sel === f.id ? token.color.brand.subtle : 'transparent' }}>
                  <span className="h-2.5 w-2.5 rounded-[10px] flex-shrink-0" style={{ background: f.color }} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[12.5px] font-medium" style={{ color: token.color.text.primary }}>{f.name}</span>
                    <span className="block text-[11px]" style={{ color: token.color.text.muted }}>{f.pitch} · {Math.round(trueArea(f))} ft²</span>
                  </span>
                  {sel === f.id && <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: token.color.brand.primary }} />}
                </button>
              ))}
            </div>

            {/* line totals */}
            <div className="rounded-[20px] p-4 bg-white" style={{ border: `1px solid ${token.color.border.default}` }}>
              <p className="text-[11px] font-mono uppercase tracking-wide mb-2.5" style={{ color: token.color.text.muted }}>Lines</p>
              <Row label="Ridge" value={`${ROOF_LINES.ridge} ft`} dot={EDGE_STYLE.ridge.color} />
              <Row label="Hips" value={`${ROOF_LINES.hip} ft`} dot={EDGE_STYLE.hip.color} />
              <Row label="Valleys" value={`${ROOF_LINES.valley} ft`} dot={EDGE_STYLE.valley.color} />
              <Row label="Eaves" value={`${ROOF_LINES.eave} ft`} dot={EDGE_STYLE.eave.color} />
            </div>

            {/* material totals */}
            <div className="rounded-[20px] p-4 bg-white" style={{ border: `1px solid ${token.color.border.default}` }}>
              <p className="text-[11px] font-mono uppercase tracking-wide mb-2.5" style={{ color: token.color.text.muted }}>Materials</p>
              <Row label="Surface area" value={`${Math.round(totalTrue).toLocaleString()} ft²`} />
              <Row label="Squares" value={baseSquares.toFixed(1)} />

              <div className="mt-3 mb-1 flex items-center justify-between">
                <span className="text-[12px]" style={{ color: token.color.text.secondary }}>Waste factor</span>
                <span className="text-[12px] font-medium" style={{ color: token.color.text.primary }}>{waste}%</span>
              </div>
              <input type="range" min={0} max={25} step={5} value={waste} disabled={isViewer}
                onChange={(e) => setWaste(Number(e.target.value))}
                className="w-full accent-[#000000]" />

              <div className="mt-3 pt-3 flex items-center justify-between" style={{ borderTop: `1px solid ${token.color.border.hairline}` }}>
                <span className="text-[12.5px] font-medium" style={{ color: token.color.text.primary }}>Order qty</span>
                <span className="text-[18px] font-medium tracking-[-0.03em]" style={{ color: token.color.brand.primary }}>
                  {Math.ceil(orderSquares)} sq
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, dot }: { label: string; value: string; dot?: string }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="inline-flex items-center gap-2 text-[12px]" style={{ color: token.color.text.secondary }}>
        {dot && <span className="w-2 h-2 rounded-full" style={{ background: dot }} />}
        {label}
      </span>
      <span className="text-[12.5px] font-medium font-mono" style={{ color: token.color.text.primary }}>{value}</span>
    </div>
  );
}
