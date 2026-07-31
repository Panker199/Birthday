import { useState, useEffect, useRef, useCallback, memo } from 'react';

const PASSKEY = '3107';
const BIRTH_DATE = new Date('2023-06-15');

type Screen = 'locked' | 'loading' | 'age' | 'gallery' | 'letter';

const NUMPAD = ['1','2','3','4','5','6','7','8','9','','0','⌫'];

const GIRL_PICS = [
  { url: '/assets/images/IMG-20260730-WA0038(2).jpg', label: 'your beautiful smile' },
  { url: '/assets/images/IMG-20260730-WA0039(1).jpg', label: 'that glow' },
  { url: '/assets/images/IMG-20260730-WA0040(1).jpg', label: 'sunshine personified' },
  { url: '/assets/images/IMG-20260730-WA0042(1).jpg', label: 'pure elegance' },
  { url: '/assets/videos/VID-20260730-WA0041.mp4', label: 'a moment with you', type: 'video' as const },
];

const FALLBACK_IMG = 'data:image/svg+xml,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400"><rect fill="#1a0a10" width="300" height="400"/><text x="150" y="200" text-anchor="middle" fill="#ff6b8a" font-size="60" font-family="serif">❤️</text></svg>'
);

const COLORS_CONFETTI = ['#ff1a56','#ff6b8a','#ffd93d','#ff9f43','#ff6bff','#ff3b5c','#ffd700'];
const SHAPES_CONFETTI = ['●','♥','✦','✧','★','♦','❤️','✨','♡'];

function GoldenPen({ size = 24 }: { size?: number }) {
  return (
    <span className="golden-pen-wrap">
      <svg width={size} height={size * 1.2} viewBox="0 0 48 56" className="golden-pen-svg">
        <defs>
          <linearGradient id="gPenG" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffec80" />
            <stop offset="35%" stopColor="#ffd700" />
            <stop offset="70%" stopColor="#e8b800" />
            <stop offset="100%" stopColor="#c89600" />
          </linearGradient>
          <linearGradient id="gPenT" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#c89600" />
            <stop offset="100%" stopColor="#7a5400" />
          </linearGradient>
          <radialGradient id="gRoseG" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff2040" />
            <stop offset="100%" stopColor="#cc0020" />
          </radialGradient>
        </defs>
        <g className="pen-group">
          <text x="14" y="56" fontSize="20" textAnchor="middle" className="pen-rose-text" dominantBaseline="central">🌹</text>
          <path d="M20 52 L24 48 L32 24 L28 20 L10 38 Q8 42 20 52Z" fill="url(#gPenG)" stroke="#a07000" strokeWidth="0.6" />
          <path d="M28 20 L32 24 L36 18 L32 15 Z" fill="url(#gPenT)" stroke="#6a4800" strokeWidth="0.5" />
          <path d="M20 52 L16 54 L18 50 Z" fill="#ffd700" stroke="#a07000" strokeWidth="0.3" />
          <path d="M24 48 L26 50" stroke="#ffd700" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          <path className="pen-trail" d="M34 18 Q38 14 42 18" stroke="#ffd700" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.5" />
        </g>
      </svg>
    </span>
  );
}

function Icon({ name, size = 24, className, style }: { name: string; size?: number; className?: string; style?: React.CSSProperties }) {
  return <span className={`material-symbols-rounded ${className ?? ''}`} style={{ fontSize: size, lineHeight: 1, ...style }}>{name}</span>;
}

function PandaSVG({ size = 120, sleep = false }: { size?: number; sleep?: boolean }) {
  return (
    <svg width={size} height={size * 1.05} viewBox="0 0 120 126" fill="none">
      <ellipse cx="60" cy="95" rx="38" ry="28" fill="#1a1a1a" opacity="0.3" />
      <ellipse cx="60" cy="78" rx="38" ry="35" fill="#f0f0f0" />
      <ellipse cx="60" cy="78" rx="34" ry="31" fill="#fafafa" />
      <ellipse cx="39" cy="52" rx="16" ry="18" fill="#1a1a1a" />
      <ellipse cx="81" cy="52" rx="16" ry="18" fill="#1a1a1a" />
      <ellipse cx="39" cy="50" rx="12" ry="14" fill="#f0f0f0" />
      <ellipse cx="81" cy="50" rx="12" ry="14" fill="#f0f0f0" />
      <ellipse cx="39" cy="48" rx="10" ry="12" fill="#fafafa" />
      <ellipse cx="81" cy="48" rx="10" ry="12" fill="#fafafa" />
      <ellipse cx="39" cy="52" rx="4" ry="5" fill="#1a1a1a" />
      <ellipse cx="81" cy="52" rx="4" ry="5" fill="#1a1a1a" />
      <ellipse cx="39" cy="51" rx="2" ry="2.5" fill="#fff" />
      <ellipse cx="81" cy="51" rx="2" ry="2.5" fill="#fff" />
      <ellipse cx="60" cy="68" rx="5" ry="3.5" fill="#1a1a1a" />
      <ellipse cx="60" cy="67" rx="3" ry="2" fill="#f0c0c0" />
      {sleep ? (
        <>
          <path d="M33 38 Q28 34 32 30" stroke="#1a1a1a" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <path d="M87 38 Q92 34 88 30" stroke="#1a1a1a" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <path d="M33 38 Q32 36 34 34" stroke="#1a1a1a" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <path d="M87 38 Q88 36 86 34" stroke="#1a1a1a" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        </>
      )}
      <ellipse cx="52" cy="88" rx="12" ry="8" fill="#1a1a1a" />
      <ellipse cx="68" cy="88" rx="12" ry="8" fill="#1a1a1a" />
      <ellipse cx="52" cy="86" rx="8" ry="6" fill="#f0f0f0" />
      <ellipse cx="68" cy="86" rx="8" ry="6" fill="#f0f0f0" />
      <ellipse cx="40" cy="82" rx="6" ry="4" fill="#1a1a1a" />
      <ellipse cx="80" cy="82" rx="6" ry="4" fill="#1a1a1a" />
    </svg>
  );
}

/* ─────────── Locked Screen ─────────── */

const PasscodeScreen = memo(function PasscodeScreen({
  passcode, setPasscode, showHint, setShowHint, unlocked, onUnlock,
}: {
  passcode: string; setPasscode: (v: string) => void;
  showHint: boolean; setShowHint: (v: boolean) => void;
  unlocked: boolean; onUnlock: () => void;
}) {
  useEffect(() => {
    if (passcode === PASSKEY) {
      const t = setTimeout(onUnlock, 50);
      return () => clearTimeout(t);
    }
  }, [passcode, onUnlock]);

  const handlePad = useCallback((val: string) => {
    if (unlocked) return;
    if (val === '⌫') setPasscode(passcode.slice(0, -1));
    else if (val && passcode.length < 4) setPasscode(passcode + val);
  }, [unlocked, passcode, setPasscode]);

  return (
    <div className={`screen ${unlocked ? 'fade-out' : 'fade-in'}`}>
      <div className="locked-card">
        <div className="locked-icon" onClick={() => setShowHint(true)}>
          <div className="avatar-ring">
            <img src={GIRL_PICS[0]!.url} alt="" className="avatar-img"
              onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }} />
          </div>
          <div className="avatar-hint-text"><Icon name="lock" size={12} /> tap for hint</div>
        </div>
        <h1 className="locked-title">LOCKED</h1>
        <div className="passcode-dots">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={`passcode-dot ${passcode[i] ? 'filled' : ''}`}>
              {passcode[i] ? '●' : '○'}
            </div>
          ))}
        </div>
        <div className="numpad">
          {NUMPAD.map((val, i) => (
            <button key={i} className={`numpad-btn ${!val ? 'empty' : ''} ${val === '⌫' ? 'del' : ''}`}
              onClick={() => handlePad(val)} disabled={!val || unlocked}>
              {val === '⌫' ? <Icon name="backspace" size={20} /> : val}
            </button>
          ))}
        </div>
        {passcode.length === 4 && passcode !== PASSKEY && (
          <div className="shake-text"><Icon name="error" size={12} /> incorrect — try again</div>
        )}
      </div>
      {showHint && (
        <div className="overlay" onClick={() => setShowHint(false)}>
          <div className="hint-card" onClick={(e) => e.stopPropagation()}>
            <Icon name="vpn_key" size={40} style={{ color: '#ff6b8a' }} />
            <h3 className="hint-title">hint</h3>
            <p className="hint-body">the date it all began<br /><span className="hint-code">3107</span></p>
            <button className="hint-btn" onClick={() => setShowHint(false)}>got it</button>
          </div>
        </div>
      )}
    </div>
  );
});

/* ─────────── Loading Screen ─────────── */

const LoadingScreen = memo(function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<'loading' | 'welcome'>('loading');
  const [loadProg, setLoadProg] = useState(0);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    let cancelled = false;
    const t1 = setTimeout(() => { if (!cancelled) setPhase('welcome'); }, 2600);

    let step = 0;
    const total = 30;
    const progInterval = setInterval(() => {
      step++;
      setLoadProg(Math.min((step / total) * 100, 100));
      if (step >= total) clearInterval(progInterval);
    }, 80);

    return () => { cancelled = true; clearTimeout(t1); clearInterval(progInterval); };
  }, []);

  const handleStart = useCallback(() => {
    const fn = doneRef.current;
    if (fn) { doneRef.current = (() => {}) as typeof fn; fn(); }
  }, []);

  if (phase === 'loading') {
    return (
      <div className="screen fade-in">
        <div className="loading-wrap">
          <div className="panda-bounce"><PandaSVG size={100} /><div className="bounce-dots"><span /><span /><span /></div></div>
          <div className="loading-msg">
            <span className="loading-hmm">Hmm...</span>
            <span className="loading-sub"><Icon name="hourglass_bottom" size={14} /> loading something special</span>
          </div>
          <div className="loading-bar-wrap">
            <div className="loading-bar-track"><div className="loading-bar-fill-inner" style={{ width: `${loadProg}%` }} /></div>
            <span className="loading-bar-pct">{Math.round(loadProg)}%</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="screen fade-in">
      <div className="welcome-wrap">
        <div className="panda-sleep"><PandaSVG size={110} sleep /></div>
        <h2 className="welcome-title">It's Your Special Day</h2>
        <p className="welcome-sub">the universe made you, and here we are</p>
        <button className="btn-primary" onClick={handleStart}><Icon name="play_arrow" size={16} /> start</button>
        <p className="btn-hint">touch to begin</p>
      </div>
    </div>
  );
});

/* ─────────── Age Screen ─────────── */

const AgeScreen = memo(function AgeScreen({ onNext }: { onNext: () => void }) {
  const calc = useCallback(() => {
    const now = new Date();
    let y = now.getFullYear() - BIRTH_DATE.getFullYear();
    let m = now.getMonth() - BIRTH_DATE.getMonth();
    let d = now.getDate() - BIRTH_DATE.getDate();
    if (d < 0) { m--; const prev = new Date(now.getFullYear(), now.getMonth(), 0); d += prev.getDate(); }
    if (m < 0) { y--; m += 12; }
    return { years: y, months: m, days: d };
  }, []);

  const [time, setTime] = useState(calc);
  useEffect(() => { const i = setInterval(() => setTime(calc()), 60000); return () => clearInterval(i); }, [calc]);

  return (
    <div className="screen fade-in">
      <div className="age-wrap">
        <div className="age-panda"><PandaSVG size={80} /></div>
        <h2 className="age-heading">happy birthday<br /><span className="age-name">my girl</span></h2>
        <div className="counter-row">
          {(['Years', 'Months', 'Days'] as const).map((lbl, i) => (
            <div key={lbl} className="counter-card" style={{ animationDelay: `${i * 0.12}s` }}>
              <span className="counter-num">{i === 0 ? time.years : i === 1 ? time.months : time.days}</span>
              <span className="counter-lbl">{lbl}</span>
            </div>
          ))}
        </div>
        <p className="age-msg">every moment with you is a treasure</p>
        <button className="btn-primary" onClick={onNext}><Icon name="arrow_forward" size={16} /> next</button>
      </div>
    </div>
  );
});

/* ─────────── Gallery Screen ─────────── */

const GalleryScreen = memo(function GalleryScreen({ onNext, onSelectPic }: { onNext: () => void; onSelectPic: (url: string) => void }) {
  const [loaded, setLoaded] = useState<Set<number>>(new Set());
  const [selected, setSelected] = useState<number | null>(null);

  const handleSelect = useCallback((i: number) => {
    setSelected((prev) => {
      const next = prev === i ? null : i;
      if (next !== null) onSelectPic(GIRL_PICS[next]!.url);
      return next;
    });
  }, [onSelectPic]);

  useEffect(() => {
    if (selected === null) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.girl-card') && !target.closest('.gallery-btn') && !target.closest('.gallery-overlay-btn')) {
        setSelected(null);
      }
    };
    const t = setTimeout(() => document.addEventListener('click', handler), 0);
    return () => { clearTimeout(t); document.removeEventListener('click', handler); };
  }, [selected]);

  return (
    <div className="screen fade-in">
      <div className="gallery-wrap">
        <h2 className="section-title"><Icon name="photo_library" size={20} /> her gallery</h2>
        <p className="section-sub">tap any picture to continue</p>

        <div className="gallery-scroll">
          <div className="gallery-track">
            {GIRL_PICS.map((pic, i) => (
              <div
                key={i}
                className={`girl-card ${loaded.has(i) ? 'loaded' : ''} ${selected === i ? 'selected' : ''}`}
                onClick={(e) => { e.stopPropagation(); handleSelect(i); }}
              >
                <div className="girl-card-inner">
                  {pic.type === 'video' ? (
                    <video src={pic.url} className="girl-img" muted loop playsInline preload="auto"
                      style={{ objectFit: 'cover' }}
                      onLoadedData={() => setLoaded((prev) => new Set(prev).add(i))}
                      onError={() => setLoaded((prev) => new Set(prev).add(i))}
                      onMouseEnter={(e) => (e.target as HTMLVideoElement).play()}
                      onMouseLeave={(e) => { (e.target as HTMLVideoElement).pause(); (e.target as HTMLVideoElement).currentTime = 0; }} />
                  ) : (
                    <img src={pic.url} alt={pic.label} className="girl-img"
                      loading="lazy"
                      onLoad={() => setLoaded((prev) => new Set(prev).add(i))}
                      onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }} />
                  )}
                  <div className="girl-img-overlay" />
                  {pic.type === 'video' && (
                    <div className="video-play-icon"><Icon name="play_circle" size={32} style={{ color: '#fff' }} /></div>
                  )}
                  {selected === i && (
                    <div className="girl-card-check"><Icon name="check_circle" size={28} style={{ color: '#ff1a56' }} /></div>
                  )}
                </div>
                <p className="girl-label"><Icon name="favorite" size={12} style={{ color: '#ff1a56' }} /> {pic.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={`gallery-overlay-btn ${selected !== null ? 'visible' : ''}`}>
          <button className="btn-primary gallery-btn writing-btn" onClick={onNext}>
            <GoldenPen size={20} /> a letter for you
          </button>
        </div>
      </div>
    </div>
  );
});

/* ─────────── Letter Screen ─────────── */

function TypewriterText({ text, speed = 40, onDone }: { text: string; speed?: number; onDone?: () => void }) {
  const words = text.split(' ');
  const [visible, setVisible] = useState(0);
  const doneRef = useRef(false);

  useEffect(() => {
    doneRef.current = false;
    if (words.length === 0) { onDone?.(); return; }
    const timer = setInterval(() => {
      setVisible(prev => {
        const next = prev + 1;
        if (next >= words.length) {
          clearInterval(timer);
          if (!doneRef.current) { doneRef.current = true; setTimeout(() => onDone?.(), 200); }
          return words.length;
        }
        return next;
      });
    }, speed);
    return () => { clearInterval(timer); doneRef.current = true; };
  }, [text, speed]);

  return (
    <span>
      {words.map((w, i) => (
        <span key={i} className={`tw-word ${i < visible ? 'tw-visible' : ''}`}>
          {w}{i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
      <span className={`tw-cursor ${visible >= words.length ? 'tw-cursor-blink' : ''}`}>|</span>
    </span>
  );
}

const LetterScreen = memo(function LetterScreen({ selectedPic, onCelebrate, onRestart }: { selectedPic: string; onCelebrate: () => void; onRestart: () => void }) {
  const [sealed, setSealed] = useState(true);
  const [opening, setOpening] = useState(false);
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleOpen = useCallback(() => {
    if (!sealed) return;
    setOpening(true);
    openTimerRef.current = setTimeout(() => {
      setOpening(false);
      setSealed(false);
      setOpen(true);
    }, 2000);
  }, [sealed]);

  useEffect(() => {
    return () => { if (openTimerRef.current) clearTimeout(openTimerRef.current); };
  }, []);

  return (
    <div className="screen fade-in">
      <div className="letter-wrap">
        {sealed && !opening && (
          <div className="letter-sealed">
            <p className="letter-prompt"><Icon name="touch_app" size={14} /> tap the heart to open your letter...</p>
            <div className="heart-wrap" onClick={handleOpen}>
              <div className="heart-ring" />
              <img src={selectedPic} alt="tap to open" className="heart-icon girl-pic-icon" />
            </div>
          </div>
        )}

        {opening && (
          <div className="letter-opening">
            <div className="envelope">
              <Icon name="mail" size={56} className="env-pulse" style={{ color: '#ff6b8a' }} />
              <div className="env-dots"><span /><span /><span /></div>
            </div>
            <p className="opening-msg"><Icon name="auto_stories" size={14} /> opening your letter...</p>
          </div>
        )}

        {open && (
          <div className="letter-open">
            <div className="letter-card">
              <Icon name="mail" size={36} style={{ color: '#ff6b8a' }} />
              <div className="letter-heading">from my heart to yours</div>
              <div className="letter-body">
                <p><TypewriterText text="My Dearest," speed={50} /></p>
                <p><TypewriterText text="On this beautiful day, I want to pause and tell you just how incredibly special you are to me. Every moment with you feels like a dream I never want to end." speed={35} /></p>
                <p><TypewriterText text="You have brought so much light, love, and warmth into my life. Your smile brightens my darkest days, and your laughter is the sweetest sound I have ever known." speed={35} /></p>
                <p><TypewriterText text="Thank you for being you — for your kindness, your strength, and your beautiful heart. I treasure every memory we have made and look forward to creating so many more." speed={35} /></p>
                <p><TypewriterText text="Happy Birthday, my love. You deserve every happiness the universe has to offer and more." speed={40} onDone={() => setDone(true)} /></p>
                {done && (
                  <div className="letter-signoff">
                    <p>with all my love,</p>
                    <p className="letter-signature">forever yours</p>
                  </div>
                )}
              </div>
              {done && (
                <div className="letter-actions">
                  <button className="btn-primary celebrate-btn" onClick={onCelebrate}><Icon name="celebration" size={16} /> celebrate</button>
                  <button className="btn-ghost" onClick={onRestart}><Icon name="replay" size={14} /> restart</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

/* ─────────── Confetti ─────────── */

const ConfettiOverlay = memo(function ConfettiOverlay({ active }: { active: boolean }) {
  const [pieces, setPieces] = useState<{ id: number; x: number; y: number; color: string; size: number; speed: number; rot: number; shape: string }[]>([]);
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    if (!active) { setPieces([]); return; }
    let tick = 0;
    const interval = setInterval(() => {
      tick++;
      setPieces((prev) => {
        const up = prev.map((p) => ({ ...p, y: p.y + p.speed, rot: p.rot + p.speed })).filter((p) => p.y < 110);
        if (tick % 2 === 0 && up.length < 150) {
          const count = 1 + Math.floor(Math.random() * 2);
          for (let i = 0; i < count; i++) {
            up.push({
              id: Date.now() + Math.random(),
              x: Math.random() * 100,
              y: -5 - Math.random() * 20,
              color: COLORS_CONFETTI[Math.floor(Math.random() * COLORS_CONFETTI.length)]!,
              size: 10 + Math.random() * 18,
              speed: 0.4 + Math.random() * 1.8,
              rot: Math.random() * 360,
              shape: SHAPES_CONFETTI[Math.floor(Math.random() * SHAPES_CONFETTI.length)]!,
            });
          }
        }
        return up;
      });
    }, 50);
    const timeout = setTimeout(() => { if (activeRef.current) setPieces([]); }, 9000);
    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, [active]);

  if (!active || pieces.length === 0) return null;
  return (
    <div className="confetti-overlay">
      {pieces.map((p) => (
        <span key={p.id} className="confetti-piece" style={{
          left: `${p.x}%`, top: `${p.y}%`, color: p.color,
          fontSize: `${p.size}px`, transform: `rotate(${p.rot}deg)`,
        }}>{p.shape}</span>
      ))}
    </div>
  );
});

/* ─────────── App ─────────── */

export default function App() {
  const [screen, setScreen] = useState<Screen>('locked');
  const [passcode, setPasscode] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [selectedPic, setSelectedPic] = useState(GIRL_PICS[0]!.url);
  const unlockRef = useRef(false);

  const handleUnlock = useCallback(() => {
    if (unlockRef.current) return;
    unlockRef.current = true;
    setUnlocked(true);
    setTimeout(() => { setScreen('loading'); setPasscode(''); }, 600);
  }, []);

  return (
    <div className="app">
      <ConfettiOverlay active={celebrating} />
      {screen === 'locked' && (
        <PasscodeScreen passcode={passcode} setPasscode={setPasscode}
          showHint={showHint} setShowHint={setShowHint} unlocked={unlocked} onUnlock={handleUnlock} />
      )}
      {screen === 'loading' && <LoadingScreen onDone={() => setScreen('age')} />}
      {screen === 'age' && <AgeScreen onNext={() => setScreen('gallery')} />}
      {screen === 'gallery' && <GalleryScreen onNext={() => setScreen('letter')} onSelectPic={(url) => setSelectedPic(url)} />}
      {screen === 'letter' && (
        <LetterScreen
          selectedPic={selectedPic}
          onCelebrate={() => { setCelebrating(true); setTimeout(() => setCelebrating(false), 9000); }}
          onRestart={() => { window.location.reload(); }}
        />
      )}
    </div>
  );
}
