import { useState, useEffect, useRef, useCallback } from 'react';

// --- Color interpolation utilities ---
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : { r: 0, g: 0, b: 0 };
}

function rgbToHex(r, g, b) {
  return (
    '#' +
    [r, g, b]
      .map((x) => {
        const hex = Math.round(Math.max(0, Math.min(255, x))).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      })
      .join('')
  );
}

function lerpColor(color1, color2, t) {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);
  return rgbToHex(
    c1.r + (c2.r - c1.r) * t,
    c1.g + (c2.g - c1.g) * t,
    c1.b + (c2.b - c1.b) * t
  );
}

// Piecewise color interpolation: morning → midday → night
function interpolateColors(progress) {
  const t = Math.max(0, Math.min(1, progress));

  // Color stops for each time of day
  const morning = {
    bg: '#fdf6f0',
    text: '#333333',
    textLight: '#666666',
    textMuted: '#999999',
    cardBg: '#ffffff',
    accent: '#D4AF37',
    border: 'rgba(212,175,55,0.2)',
    cardShadow: '0 4px 24px rgba(0,0,0,0.06)',
  };
  const midday = {
    bg: '#f0f4ff',
    text: '#2a2a4a',
    textLight: '#555577',
    textMuted: '#8888aa',
    cardBg: '#ffffff',
    accent: '#D4AF37',
    border: 'rgba(212,175,55,0.25)',
    cardShadow: '0 4px 24px rgba(0,0,0,0.07)',
  };
  const night = {
    bg: '#0f1a2e',
    text: '#e8e0d8',
    textLight: '#b8b0a8',
    textMuted: '#8a8078',
    cardBg: '#1a2740',
    accent: '#D4AF37',
    border: 'rgba(212,175,55,0.15)',
    cardShadow: '0 4px 24px rgba(0,0,0,0.25)',
  };

  let from, to, localT;

  if (t <= 0.5) {
    from = morning;
    to = midday;
    localT = t / 0.5;
  } else {
    from = midday;
    to = night;
    localT = (t - 0.5) / 0.5;
  }

  return {
    bg: lerpColor(from.bg, to.bg, localT),
    text: lerpColor(from.text, to.text, localT),
    textLight: lerpColor(from.textLight, to.textLight, localT),
    textMuted: lerpColor(from.textMuted, to.textMuted, localT),
    cardBg: lerpColor(from.cardBg, to.cardBg, localT),
    accent: lerpColor(from.accent, to.accent, localT),
    border: localT < 0.5
      ? `rgba(212,175,55,${0.2 + localT * 0.1})`
      : `rgba(212,175,55,${0.25 - (localT - 0.5) * 0.2})`,
    cardShadow: localT < 0.5
      ? `0 4px 24px rgba(0,0,0,${0.06 + localT * 0.04})`
      : `0 4px 24px rgba(0,0,0,${0.1 + (localT - 0.5) * 0.3})`,
  };
}

function applyTheme(progress) {
  const colors = interpolateColors(progress);
  const root = document.documentElement.style;
  root.setProperty('--bg', colors.bg);
  root.setProperty('--text', colors.text);
  root.setProperty('--text-light', colors.textLight);
  root.setProperty('--text-muted', colors.textMuted);
  root.setProperty('--card-bg', colors.cardBg);
  root.setProperty('--accent', colors.accent);
  root.setProperty('--border', colors.border);
  root.setProperty('--card-shadow', colors.cardShadow);
}

// Sky gradient colors based on progress
function getSkyColors(t) {
  const morningTop = '#ff9a56';
  const morningBot = '#ffcf8a';
  const middayTop = '#4a90d9';
  const middayBot = '#87ceeb';
  const nightTop = '#0a0e27';
  const nightBot = '#1a2744';

  if (t <= 0.5) {
    const lt = t / 0.5;
    return {
      top: lerpColor(morningTop, middayTop, lt),
      bot: lerpColor(morningBot, middayBot, lt),
    };
  } else {
    const lt = (t - 0.5) / 0.5;
    return {
      top: lerpColor(middayTop, nightTop, lt),
      bot: lerpColor(middayBot, nightBot, lt),
    };
  }
}

// Hill/grass colors
function getGroundColors(t) {
  const morningGrass = '#5a8a3c';
  const morningHill = '#4a7a2c';
  const middayGrass = '#4a9a2c';
  const middayHill = '#3a8a1c';
  const nightGrass = '#1a3a1c';
  const nightHill = '#0f2f12';

  if (t <= 0.5) {
    const lt = t / 0.5;
    return {
      grass: lerpColor(morningGrass, middayGrass, lt),
      hill: lerpColor(morningHill, middayHill, lt),
    };
  } else {
    const lt = (t - 0.5) / 0.5;
    return {
      grass: lerpColor(middayGrass, nightGrass, lt),
      hill: lerpColor(middayHill, nightHill, lt),
    };
  }
}

// Sun/moon position along parabolic arc
function getArcPosition(t, svgWidth, svgHeight) {
  // Parabola: Y = 4t(1-t), peaks at t=0.5
  // X goes from left margin to right margin
  const margin = svgWidth * 0.08;
  const x = margin + t * (svgWidth - 2 * margin);
  const parabolaY = 4 * t * (1 - t); // 0 at edges, 1 at center
  const maxArcHeight = svgHeight * 0.55;
  const baseY = svgHeight * 0.82;
  const y = baseY - parabolaY * maxArcHeight;
  return { x, y };
}

// Deterministic pseudo-random for consistent star positions across reloads
function seededRandom(seed) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

const STARS = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  x: seededRandom(i * 3) * 100,
  y: seededRandom(i * 3 + 1) * 55,
  size: 1 + seededRandom(i * 3 + 2) * 2,
  delay: seededRandom(i * 3 + 3) * 3,
}));

// Birds data
const BIRDS = [
  { x: 15, y: 25, scale: 0.8, delay: 0 },
  { x: 25, y: 20, scale: 0.6, delay: 0.5 },
  { x: 35, y: 28, scale: 0.7, delay: 1 },
  { x: 55, y: 18, scale: 0.5, delay: 1.5 },
  { x: 65, y: 24, scale: 0.65, delay: 0.8 },
];

function DayCycleScene() {
  const [progress, setProgress] = useState(0.15); // Start at early morning
  const svgRef = useRef(null);
  const isDragging = useRef(false);
  const cleanupRef = useRef(null); // stores cleanup function for window listeners
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showHint, setShowHint] = useState(true);

  // Auto-animate on load from dawn to morning
  useEffect(() => {
    let start = null;
    const target = 0.15;
    const duration = 2000;

    function animate(timestamp) {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const t = Math.min(elapsed / duration, 1);
      const eased = t * (2 - t); // ease-out quad
      const currentProgress = eased * target;
      setProgress(currentProgress);
      applyTheme(currentProgress);
      if (t < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }, []);

  // Fade out hint after a few seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Hide hint immediately on first interaction
  const handleFirstInteraction = useCallback(() => {
    if (!hasInteracted) {
      setHasInteracted(true);
      setShowHint(false);
    }
  }, [hasInteracted]);

  // Drag handlers — attach move/up to window so dragging works outside the sun element
  const handlePointerDown = useCallback((e) => {
    e.preventDefault();
    isDragging.current = true;
    handleFirstInteraction();

    const onMove = (ev) => {
      if (!isDragging.current || !svgRef.current) return;
      const svg = svgRef.current;
      const rect = svg.getBoundingClientRect();
      const x = ev.clientX - rect.left;
      const t = Math.max(0, Math.min(1, x / rect.width));
      setProgress(t);
      applyTheme(t);
    };

    const onUp = () => {
      isDragging.current = false;
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      cleanupRef.current = null;
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    cleanupRef.current = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [handleFirstInteraction]);

  // Clean up window listeners on unmount
  useEffect(() => {
    return () => {
      if (cleanupRef.current) cleanupRef.current();
    };
  }, []);

  // Touch support for the arc line itself
  const handleSvgClick = useCallback((e) => {
    if (!svgRef.current) return;
    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const t = Math.max(0, Math.min(1, x / rect.width));
    setProgress(t);
    applyTheme(t);
    handleFirstInteraction();
  }, [handleFirstInteraction]);

  const SVG_W = 800;
  const SVG_H = 450;

  const sunPos = getArcPosition(progress, SVG_W, SVG_H);
  const skyColors = getSkyColors(progress);
  const groundColors = getGroundColors(progress);

  // Calculate sun/moon visual properties
  const isNight = progress > 0.75;
  const moonMaskProgress = progress > 0.6 ? Math.min(1, (progress - 0.6) / 0.3) : 0;
  const celestialColor = progress < 0.5
    ? lerpColor('#ff6b35', '#ffd700', progress / 0.5)
    : lerpColor('#ffd700', '#e8e4d4', (progress - 0.5) / 0.5);
  const celestialGlow = progress < 0.5
    ? lerpColor('#ff8c42', '#ffe066', progress / 0.5)
    : lerpColor('#ffe066', '#a0b4d0', (progress - 0.5) / 0.5);
  const celestialRadius = progress > 0.6 ? 22 - (progress - 0.6) * 5 : 22;
  const glowRadius = celestialRadius * 2.5;

  // Birds opacity
  const birdOpacity = progress < 0.55 ? Math.max(0, 1 - progress * 1.5) : 0;

  // Stars opacity
  const starOpacity = progress > 0.45 ? Math.min(1, (progress - 0.45) * 2.5) : 0;

  // House colors
  const houseWall = progress < 0.5
    ? lerpColor('#d4a574', '#c4956a', progress / 0.5)
    : lerpColor('#c4956a', '#6a5a4a', (progress - 0.5) / 0.5);
  const houseRoof = progress < 0.5
    ? lerpColor('#8b4513', '#7a3a10', progress / 0.5)
    : lerpColor('#7a3a10', '#3a2a1a', (progress - 0.5) / 0.5);
  const windowGlow = progress > 0.5 ? Math.min(1, (progress - 0.5) * 2.5) : 0;

  // Tree colors
  const treeTrunk = progress < 0.5
    ? lerpColor('#6b4226', '#5a3620', progress / 0.5)
    : lerpColor('#5a3620', '#2a1a10', (progress - 0.5) / 0.5);
  const treeLeaves = progress < 0.5
    ? lerpColor('#2d8a4e', '#228b22', progress / 0.5)
    : lerpColor('#228b22', '#0f3f1a', (progress - 0.5) / 0.5);

  // Arc path (for visual guide)
  const arcPathPoints = [];
  for (let i = 0; i <= 50; i++) {
    const t = i / 50;
    const pos = getArcPosition(t, SVG_W, SVG_H);
    arcPathPoints.push(`${i === 0 ? 'M' : 'L'}${pos.x},${pos.y}`);
  }
  const arcPathD = arcPathPoints.join(' ');

  // Cloud positions
  const cloudOpacity = progress < 0.6 ? Math.max(0, 0.6 - progress * 0.5) : 0;
  const cloudColor = progress < 0.4 ? '#ffffff' : lerpColor('#ffffff', '#4a5a7a', (progress - 0.4) / 0.3);

  return (
    <div className="day-cycle-scene">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="day-cycle-svg"
        xmlns="http://www.w3.org/2000/svg"
        onClick={handleSvgClick}
        style={{ touchAction: 'none' }}
      >
        <defs>
          {/* Moon mask - creates crescent by covering part of the circle */}
          <mask id="moon-mask">
            <rect width="100%" height="100%" fill="white" />
            <circle
              cx={sunPos.x + celestialRadius * 0.6 * moonMaskProgress}
              cy={sunPos.y - celestialRadius * 0.3 * moonMaskProgress}
              r={celestialRadius * (0.8 + moonMaskProgress * 0.4)}
              fill="black"
            />
          </mask>

          {/* Sun glow filter */}
          <filter id="sun-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Star twinkle filter */}
          <filter id="star-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Window light filter */}
          <filter id="window-light" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Sky gradient */}
          <linearGradient id="sky-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={skyColors.top} />
            <stop offset="100%" stopColor={skyColors.bot} />
          </linearGradient>

          {/* Hill gradient */}
          <linearGradient id="hill-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={groundColors.hill} />
            <stop offset="100%" stopColor={groundColors.grass} />
          </linearGradient>
        </defs>

        {/* Sky */}
        <rect width={SVG_W} height={SVG_H} fill="url(#sky-gradient)" />

        {/* Stars (visible at night) */}
        <g opacity={starOpacity}>
          {STARS.map((star) => (
            <circle
              key={star.id}
              cx={`${star.x}%`}
              cy={`${star.y}%`}
              r={star.size}
              fill="#ffffff"
              filter="url(#star-glow)"
              className="star"
              style={{ animationDelay: `${star.delay}s` }}
            />
          ))}
        </g>

        {/* Clouds */}
        <g opacity={cloudOpacity}>
          <ellipse cx="150" cy="100" rx="60" ry="20" fill={cloudColor} />
          <ellipse cx="180" cy="90" rx="40" ry="18" fill={cloudColor} />
          <ellipse cx="120" cy="95" rx="35" ry="15" fill={cloudColor} />

          <ellipse cx="600" cy="80" rx="50" ry="18" fill={cloudColor} />
          <ellipse cx="630" cy="72" rx="35" ry="14" fill={cloudColor} />
          <ellipse cx="575" cy="76" rx="30" ry="12" fill={cloudColor} />
        </g>

        {/* Birds (visible during day) */}
        <g opacity={birdOpacity}>
          {BIRDS.map((bird, i) => (
            <g
              key={i}
              transform={`translate(${bird.x * SVG_W / 100}, ${bird.y * SVG_H / 100}) scale(${bird.scale})`}
              className="bird"
              style={{ animationDelay: `${bird.delay}s` }}
            >
              <path
                d="M-8,0 Q-4,-6 0,0 Q4,-6 8,0"
                fill="none"
                stroke={progress < 0.4 ? '#333' : '#555'}
                strokeWidth="2"
                strokeLinecap="round"
              />
            </g>
          ))}
        </g>

        {/* Arc path (subtle guide line) */}
        <path
          d={arcPathD}
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1"
          strokeDasharray="6,6"
        />

        {/* Sun/Moon glow */}
        <circle
          cx={sunPos.x}
          cy={sunPos.y}
          r={glowRadius}
          fill={celestialGlow}
          opacity={0.2}
        />

        {/* Sun/Moon body — only pointerDown needed; move/up handled on window */}
        <g
          onPointerDown={handlePointerDown}
          style={{ cursor: 'grab' }}
        >
          <circle
            cx={sunPos.x}
            cy={sunPos.y}
            r={celestialRadius}
            fill={celestialColor}
            filter="url(#sun-glow)"
            mask={moonMaskProgress > 0 ? 'url(#moon-mask)' : undefined}
          />
          {/* Moon craters (visible as moon forms) */}
          {moonMaskProgress > 0.3 && (
            <g opacity={moonMaskProgress * 0.4} mask="url(#moon-mask)">
              <circle cx={sunPos.x - 5} cy={sunPos.y - 4} r={3} fill="rgba(180,180,200,0.3)" />
              <circle cx={sunPos.x + 4} cy={sunPos.y + 3} r={2} fill="rgba(180,180,200,0.2)" />
              <circle cx={sunPos.x - 2} cy={sunPos.y + 6} r={1.5} fill="rgba(180,180,200,0.2)" />
            </g>
          )}
        </g>

        {/* Distant hills (back) */}
        <path
          d={`M0,${SVG_H * 0.72} Q${SVG_W * 0.15},${SVG_H * 0.62} ${SVG_W * 0.3},${SVG_H * 0.68} 
              Q${SVG_W * 0.45},${SVG_H * 0.58} ${SVG_W * 0.6},${SVG_H * 0.65} 
              Q${SVG_W * 0.8},${SVG_H * 0.55} ${SVG_W},${SVG_H * 0.68} L${SVG_W},${SVG_H} L0,${SVG_H} Z`}
          fill={groundColors.hill}
          opacity="0.5"
        />

        {/* Closer hills */}
        <path
          d={`M0,${SVG_H * 0.78} Q${SVG_W * 0.2},${SVG_H * 0.68} ${SVG_W * 0.35},${SVG_H * 0.74} 
              Q${SVG_W * 0.5},${SVG_H * 0.7} ${SVG_W * 0.65},${SVG_H * 0.75} 
              Q${SVG_W * 0.85},${SVG_H * 0.69} ${SVG_W},${SVG_H * 0.76} L${SVG_W},${SVG_H} L0,${SVG_H} Z`}
          fill={groundColors.hill}
          opacity="0.7"
        />

        {/* Ground */}
        <rect
          x="0"
          y={SVG_H * 0.82}
          width={SVG_W}
          height={SVG_H * 0.18}
          fill={groundColors.grass}
        />

        {/* Trees (left side) */}
        <g>
          {/* Tree 1 */}
          <rect x="100" y={SVG_H * 0.65} width="8" height="30" fill={treeTrunk} rx="2" />
          <ellipse cx="104" cy={SVG_H * 0.6} rx="22" ry="28" fill={treeLeaves} />
          <ellipse cx="96" cy={SVG_H * 0.58} rx="16" ry="22" fill={treeLeaves} opacity="0.8" />

          {/* Tree 2 (smaller) */}
          <rect x="60" y={SVG_H * 0.7} width="6" height="22" fill={treeTrunk} rx="2" />
          <ellipse cx="63" cy={SVG_H * 0.66} rx="16" ry="20" fill={treeLeaves} opacity="0.9" />
        </g>

        {/* Trees (right side) */}
        <g>
          {/* Tree 3 */}
          <rect x="670" y={SVG_H * 0.66} width="8" height="28" fill={treeTrunk} rx="2" />
          <ellipse cx="674" cy={SVG_H * 0.61} rx="20" ry="26" fill={treeLeaves} />
          <ellipse cx="682" cy={SVG_H * 0.59} rx="15" ry="20" fill={treeLeaves} opacity="0.8" />

          {/* Tree 4 (smaller) */}
          <rect x="720" y={SVG_H * 0.71} width="6" height="20" fill={treeTrunk} rx="2" />
          <ellipse cx="723" cy={SVG_H * 0.67} rx="14" ry="18" fill={treeLeaves} opacity="0.9" />
        </g>

        {/* House */}
        <g>
          {/* House body */}
          <rect
            x={SVG_W / 2 - 40}
            y={SVG_H * 0.72}
            width="80"
            height="45"
            fill={houseWall}
            rx="2"
          />
          {/* Roof */}
          <polygon
            points={`${SVG_W / 2 - 50},${SVG_H * 0.72} ${SVG_W / 2},${SVG_H * 0.6} ${SVG_W / 2 + 50},${SVG_H * 0.72}`}
            fill={houseRoof}
          />
          {/* Door with rounded top */}
          <path
            d={`M${SVG_W / 2 - 10},${SVG_H * 0.82} V${SVG_H * 0.82 - 12} A10,10 0 0,1 ${SVG_W / 2 + 10},${SVG_H * 0.82 - 12} V${SVG_H * 0.82} Z`}
            fill={houseRoof}
          />
          {/* Door handle */}
          <circle
            cx={SVG_W / 2 + 5}
            cy={SVG_H * 0.82 - 10}
            r="1.5"
            fill={celestialColor}
          />
          {/* Windows */}
          <rect
            x={SVG_W / 2 - 32}
            y={SVG_H * 0.75}
            width="14"
            height="14"
            rx="1"
            fill={windowGlow > 0.3 ? '#ffcc44' : '#87ceeb'}
            opacity={windowGlow > 0.3 ? 0.9 : 0.6}
            filter={windowGlow > 0.3 ? 'url(#window-light)' : undefined}
          />
          <rect
            x={SVG_W / 2 + 18}
            y={SVG_H * 0.75}
            width="14"
            height="14"
            rx="1"
            fill={windowGlow > 0.3 ? '#ffcc44' : '#87ceeb'}
            opacity={windowGlow > 0.3 ? 0.9 : 0.6}
            filter={windowGlow > 0.3 ? 'url(#window-light)' : undefined}
          />
          {/* Window cross bars */}
          <line
            x1={SVG_W / 2 - 25} y1={SVG_H * 0.75}
            x2={SVG_W / 2 - 25} y2={SVG_H * 0.75 + 14}
            stroke={houseWall} strokeWidth="1.5"
          />
          <line
            x1={SVG_W / 2 - 32} y1={SVG_H * 0.75 + 7}
            x2={SVG_W / 2 - 18} y2={SVG_H * 0.75 + 7}
            stroke={houseWall} strokeWidth="1.5"
          />
          <line
            x1={SVG_W / 2 + 25} y1={SVG_H * 0.75}
            x2={SVG_W / 2 + 25} y2={SVG_H * 0.75 + 14}
            stroke={houseWall} strokeWidth="1.5"
          />
          <line
            x1={SVG_W / 2 + 18} y1={SVG_H * 0.75 + 7}
            x2={SVG_W / 2 + 32} y2={SVG_H * 0.75 + 7}
            stroke={houseWall} strokeWidth="1.5"
          />
          {/* Chimney */}
          <rect
            x={SVG_W / 2 + 20}
            y={SVG_H * 0.6 - 18}
            width="10"
            height="22"
            fill={houseRoof}
            rx="1"
          />
          {/* Chimney smoke (visible at night) */}
          {windowGlow > 0.3 && (
            <g opacity={windowGlow * 0.5}>
              <circle cx={SVG_W / 2 + 25} cy={SVG_H * 0.6 - 25} r="4" fill="rgba(200,200,220,0.3)" className="smoke smoke-1" />
              <circle cx={SVG_W / 2 + 28} cy={SVG_H * 0.6 - 35} r="5" fill="rgba(200,200,220,0.2)" className="smoke smoke-2" />
              <circle cx={SVG_W / 2 + 23} cy={SVG_H * 0.6 - 45} r="6" fill="rgba(200,200,220,0.15)" className="smoke smoke-3" />
            </g>
          )}
        </g>

        {/* Small flowers/bushes near house */}
        <ellipse cx={SVG_W / 2 - 55} cy={SVG_H * 0.83} rx="12" ry="8" fill={treeLeaves} opacity="0.7" />
        <ellipse cx={SVG_W / 2 + 55} cy={SVG_H * 0.83} rx="12" ry="8" fill={treeLeaves} opacity="0.7" />

        {/* Fence */}
        <g stroke={houseWall} strokeWidth="1.5" opacity="0.6">
          {[-55, -45, -35, 35, 45, 55].map((offset, i) => (
            <line
              key={i}
              x1={SVG_W / 2 + offset}
              y1={SVG_H * 0.82}
              x2={SVG_W / 2 + offset}
              y2={SVG_H * 0.82 - 12}
            />
          ))}
          <line x1={SVG_W / 2 - 55} y1={SVG_H * 0.82 - 6} x2={SVG_W / 2 - 35} y2={SVG_H * 0.82 - 6} />
          <line x1={SVG_W / 2 + 35} y1={SVG_H * 0.82 - 6} x2={SVG_W / 2 + 55} y2={SVG_H * 0.82 - 6} />
        </g>

        {/* Path to the house */}
        <path
          d={`M${SVG_W / 2},${SVG_H} Q${SVG_W / 2 + 5},${SVG_H * 0.9} ${SVG_W / 2},${SVG_H * 0.82}`}
          fill="none"
          stroke={lerpColor('#c4a882', '#6a5a4a', Math.max(0, (progress - 0.3) * 1.5))}
          strokeWidth="8"
          strokeLinecap="round"
          opacity="0.5"
        />
      </svg>

      {/* Drag hint — adapts to light/dark theme */}
      {showHint && (
        <div className={`drag-hint ${progress > 0.6 ? 'drag-hint-dark' : ''}`}>
          <span className="drag-hint-text">
            {isNight ? '🌙 Drag the moon' : '☀️ Drag the sun'}
          </span>
          <span className="drag-hint-sub">to change time of day</span>
        </div>
      )}
    </div>
  );
}

export default DayCycleScene;
