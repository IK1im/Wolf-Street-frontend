import React from "react";

interface HeroSectionProps {
    palette: any;
    heroVisible: any;
    setEmail: (e: string) => void;
    email: string;
}



export default function HeroSection({palette, heroVisible,
    setEmail, email} : HeroSectionProps) {


    const handleStart = () => alert(`Введён email: ${email}`);

    return (
        <>
           <section id="main" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', height: '100vh', paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0, borderBottom: `1px solid ${palette.border}`, maxWidth: '100vw', margin: 0 }}>
        {/* Анимированный фон */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', left: '50%', top: '33%', transform: 'translate(-50%, 0)', width: 520, height: 520, background: `${palette.accent}22`, borderRadius: '50%', filter: 'blur(96px)', animation: 'pulse 3s infinite alternate' }} />
        </div>
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 80,
            zIndex: 10,
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'opacity 0.8s cubic-bezier(.4,0,.2,1), transform 0.8s cubic-bezier(.4,0,.2,1)',
          }}
        >
          {/* Левая часть: заголовок, описание, форма */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', maxWidth: 540 }}>
            <h1 style={{ fontSize: 56, fontWeight: 800, color: palette.fg, marginBottom: 32, lineHeight: 1.1, letterSpacing: '-1px' }}>
              Биржа будущего <span style={{ color: palette.accent }}>уже здесь</span>
            </h1>
            <p style={{ fontSize: 24, color: palette.accent, fontWeight: 500, marginBottom: 40, maxWidth: 480, lineHeight: 1.5 }}>
              Управляйте капиталом, инвестируйте и следите за рынком в премиальном стиле. Wolf Street — ваш финансовый успех начинается здесь.
            </p>
            <form
              onSubmit={e => { e.preventDefault(); handleStart(); }}
              style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 24, marginBottom: 32 }}
            >
              <div style={{ position: 'relative', width: '100%' }}>
                <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: palette.accent, fontFamily: 'Material Icons' }}>mail</span>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Введите ваш e-mail"
                  style={{ width: '100%', paddingLeft: 48, paddingRight: 16, paddingTop: 16, paddingBottom: 16, borderRadius: 999, border: `1px solid ${palette.accent}`, outline: 'none', background: palette.card, color: palette.fg, fontSize: 20, boxShadow: `0 1px 4px ${palette.shadow}` }}
                  required
                />
              </div>
              <button
                type="submit"
                style={{ padding: '16px 40px', background: palette.accent, color: palette.navText, borderRadius: 999, fontWeight: 700, fontSize: 20, boxShadow: `0 2px 8px ${palette.accent}55`, border: 'none', cursor: 'pointer', animation: 'bounce 2s infinite' }}
              >
                Начать
              </button>
            </form>
            <span style={{ color: palette.brown, fontSize: 16, opacity: 0.7 }}>* Мы не рассылаем спам. Только важные новости и инсайты.</span>
          </div>
          {/* Курс валют заменён на анимированный линейный график */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: 32 }}>
            <div style={{ background: palette.card, borderRadius: 32, boxShadow: `0 4px 24px ${palette.shadow}`, padding: 40, minWidth: 300, border: `1px solid ${palette.accent}`, display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', justifyContent: 'center' }}>
              <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 20, color: palette.accent, letterSpacing: 1, textAlign: 'center' }}>
                <span style={{ fontFamily: 'Material Icons', verticalAlign: 'middle', marginRight: 8 }}>show_chart</span> Динамика роста
              </h2>
              <AnimatedLineChart accent={palette.accent} />
            </div>
          </div>
        </div>
      </section> 
        </>
    );

}

function AnimatedLineChart({ accent }: { accent: string }) {
  const [length, setLength] = React.useState(0);
  const pathRef = React.useRef<SVGPathElement>(null);

  // Повторяющаяся анимация
  React.useEffect(() => {
    let interval: number;
    function animate() {
      if (pathRef.current) {
        const totalLength = pathRef.current.getTotalLength();
        setLength(totalLength);
        setTimeout(() => {
          pathRef.current && (pathRef.current.style.transition = 'stroke-dashoffset 2.2s cubic-bezier(.4,0,.2,1)');
          setLength(0);
        }, 200);
      }
    }
    animate();
    interval = window.setInterval(() => {
      if (pathRef.current) {
        pathRef.current.style.transition = 'none';
        animate();
      }
    }, 10000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  // Ломаная линия с резкими перепадами (примерно как на картинке)
  const width = 520;
  const height = 320;
  const minY = 40;
  const maxY = height - 40;
  const xOffset = 20;
  const points = [
    { x: 40 + xOffset, y: maxY },
    { x: 100 + xOffset, y: maxY - 60 },
    { x: 160 + xOffset, y: maxY - 20 },
    { x: 220 + xOffset, y: maxY - 120 },
    { x: 280 + xOffset, y: maxY - 60 },
    { x: 340 + xOffset, y: maxY - 100 },
    { x: 400 + xOffset, y: maxY - 40 },
    { x: 460 + xOffset, y: minY + 30 },
    { x: 500 + xOffset, y: minY },
  ];
  const d = points.map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`)).join(' ');
  // Для стрелки на конце
  const last = points[points.length - 1];
  const prev = points[points.length - 2];
  const angle = Math.atan2(last.y - prev.y, last.x - prev.x);
  const arrowLength = 28;
  const arrowAngle = Math.PI / 6;
  const arrowX1 = last.x - arrowLength * Math.cos(angle - arrowAngle);
  const arrowY1 = last.y - arrowLength * Math.sin(angle - arrowAngle);
  const arrowX2 = last.x - arrowLength * Math.cos(angle + arrowAngle);
  const arrowY2 = last.y - arrowLength * Math.sin(angle + arrowAngle);

  // Сетка (grid) — делаю более заметной
  const gridLines = [];
  const gridCountX = 8;
  const gridCountY = 6;
  for (let i = 0; i <= gridCountX; i++) {
    const x = 40 + xOffset + ((width - 60) / gridCountX) * i;
    gridLines.push(<line key={'vx' + i} x1={x} y1={minY - 20} x2={x} y2={maxY} stroke="#B4B4BC66" strokeWidth={2} />);
  }
  for (let i = 0; i <= gridCountY; i++) {
    const y = minY - 20 + ((maxY - (minY - 20)) / gridCountY) * i;
    gridLines.push(<line key={'hy' + i} x1={40 + xOffset} y1={y} x2={width - 10 + xOffset} y2={y} stroke="#B4B4BC66" strokeWidth={2} />);
  }

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block', margin: '0 auto', maxWidth: '100%' }}>
      {/* Сетка */}
      {gridLines}
      {/* Ось X */}
      <line x1={40 + xOffset} y1={maxY} x2={width - 10 + xOffset} y2={maxY} stroke="#B4B4BC" strokeWidth={2.5} markerEnd="url(#arrow-x)" />
      {/* Ось Y (стрелка строго вверх) */}
      <line x1={40 + xOffset} y1={maxY} x2={40 + xOffset} y2={minY - 20} stroke="#B4B4BC" strokeWidth={2.5} markerEnd="url(#arrow-y)" />
      {/* Линия графика */}
      <path
        ref={pathRef}
        d={d}
        fill="none"
        stroke={accent}
        strokeWidth={6}
        strokeDasharray={pathRef.current ? pathRef.current.getTotalLength() : 0}
        strokeDashoffset={length}
        style={{ filter: 'drop-shadow(0 4px 16px ' + accent + '44)' }}
      />
      {/* Стрелка на конце линии графика */}
      <polygon
        points={`${last.x},${last.y} ${arrowX1},${arrowY1} ${arrowX2},${arrowY2}`}
        fill={accent}
        style={{ opacity: 0.98 }}
      />
      {/* Точки графика (кроме последней) */}
      {points.slice(0, -1).map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={7} fill={accent} style={{ opacity: 0.85 }} />
      ))}
    </svg>
  );
}
