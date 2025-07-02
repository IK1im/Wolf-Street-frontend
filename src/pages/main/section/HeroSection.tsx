import React from "react";

interface HeroSectionProps {
  heroVisible: boolean;
  setEmail: (e: string) => void;
  email: string;
}

export default function HeroSection({
  heroVisible,
  setEmail,
  email,
}: HeroSectionProps) {
  const handleStart = () => alert(`Введён email: ${email}`);

  return (
    <>
      <section
        id="main"
        className="relative flex flex-col items-center justify-center min-h-screen h-screen p-0 border-b border-light-border dark:border-dark-border w-full m-0 bg-light-bg dark:bg-dark-bg text-light-fg dark:text-dark-fg"
      >
        {/* Анимированный фон */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute left-1/2 top-1/3 transform -translate-x-1/2 w-80 h-80 lg:w-[520px] lg:h-[520px] bg-light-accent/10 dark:bg-dark-accent/10 rounded-full blur-3xl lg:blur-[96px] animate-pulse" />
        </div>

        <div
          className={`w-full h-full flex flex-col lg:flex-row justify-center items-center gap-6 lg:gap-12 z-10 px-4 lg:px-0 transition-all duration-700 ease-out
            ${
              heroVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
        >
          {/* Левая часть: заголовок, описание, форма */}
          <div className="flex flex-col items-start justify-center w-full max-w-md lg:max-w-[460px] text-center lg:text-left">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-[42px] font-extrabold text-light-fg dark:text-dark-fg mb-4 lg:mb-6 leading-tight tracking-tight">
              Биржа будущего{" "}
              <span className="text-light-accent dark:text-dark-accent">
                уже здесь
              </span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-light-accent dark:text-dark-accent font-medium mb-6 lg:mb-8 max-w-full lg:max-w-[420px] leading-relaxed">
              Управляйте капиталом, инвестируйте и следите за рынком в
              премиальном стиле. Wolf Street — ваш финансовый успех начинается
              здесь.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleStart();
              }}
              className="w-full flex flex-col sm:flex-row items-center gap-3 lg:gap-4 mb-4 lg:mb-6"
            >
              <div className="relative w-full">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-light-accent dark:text-dark-accent text-base">
                  ✉️
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Введите ваш e-mail"
                  className="w-full pl-10 pr-4 py-2.5 lg:py-3 rounded-full border border-light-accent dark:border-dark-accent outline-none bg-light-card dark:bg-dark-card text-light-fg dark:text-dark-fg text-base lg:text-lg shadow-lg focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent focus:ring-opacity-20 transition-all"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto py-2.5 lg:py-3 px-6 lg:px-8 bg-light-accent dark:bg-dark-accent text-light-nav-text dark:text-dark-nav-text rounded-full font-bold text-base lg:text-lg shadow-lg border-none cursor-pointer hover:scale-105 transition-transform whitespace-nowrap"
              >
                Начать
              </button>
            </form>

            <span className="text-light-brown dark:text-dark-brown text-xs lg:text-sm opacity-70 text-center lg:text-left">
              * Мы не рассылаем спам. Только важные новости и инсайты.
            </span>
          </div>

          {/* Правая часть: мини график */}
          <div className="flex flex-col items-center justify-center w-full max-w-[200px] lg:max-w-[240px] mt-4 lg:mt-0">
            <div className="bg-light-card dark:bg-dark-card rounded-lg shadow-lg p-2 lg:p-3 w-full border border-light-accent dark:border-dark-accent flex flex-col gap-1 items-center justify-center">
              <h3 className="text-xs lg:text-sm font-semibold mb-1 text-light-accent dark:text-dark-accent text-center">
                📈 Рост
              </h3>
              <div className="w-full overflow-hidden">
                <AnimatedLineChart />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function AnimatedLineChart() {
  const [length, setLength] = React.useState(0);
  const pathRef = React.useRef<SVGPathElement>(null);

  // Повторяющаяся анимация
  React.useEffect(() => {
    function animate() {
      if (pathRef.current) {
        const totalLength = pathRef.current.getTotalLength();
        setLength(totalLength);
        setTimeout(() => {
          if (pathRef.current) {
            pathRef.current.style.transition =
              "stroke-dashoffset 1.8s cubic-bezier(.4,0,.2,1)";
            setLength(0);
          }
        }, 200);
      }
    }

    animate();

    const interval = window.setInterval(() => {
      if (pathRef.current) {
        pathRef.current.style.transition = "none";
        animate();
      }
    }, 8000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // Мини размеры графика
  const width = 180;
  const height = 100;
  const minY = 15;
  const maxY = height - 15;
  const xOffset = 8;

  const points = [
    { x: 15 + xOffset, y: maxY },
    { x: 35 + xOffset, y: maxY - 15 },
    { x: 55 + xOffset, y: maxY - 8 },
    { x: 75 + xOffset, y: maxY - 25 },
    { x: 95 + xOffset, y: maxY - 15 },
    { x: 115 + xOffset, y: maxY - 30 },
    { x: 135 + xOffset, y: maxY - 20 },
    { x: 155 + xOffset, y: minY + 5 },
  ];

  const d = points
    .map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`))
    .join(" ");

  // Стрелка на конце
  const last = points[points.length - 1];
  const prev = points[points.length - 2];
  const angle = Math.atan2(last.y - prev.y, last.x - prev.x);
  const arrowLength = 8;
  const arrowAngle = Math.PI / 6;
  const arrowX1 = last.x - arrowLength * Math.cos(angle - arrowAngle);
  const arrowY1 = last.y - arrowLength * Math.sin(angle - arrowAngle);
  const arrowX2 = last.x - arrowLength * Math.cos(angle + arrowAngle);
  const arrowY2 = last.y - arrowLength * Math.sin(angle + arrowAngle);

  // Минимальная сетка
  const gridLines = [];
  const gridCountX = 3;
  const gridCountY = 2;
  for (let i = 0; i <= gridCountX; i++) {
    const x = 15 + xOffset + ((width - 30) / gridCountX) * i;
    gridLines.push(
      <line
        key={"vx" + i}
        x1={x}
        y1={minY - 5}
        x2={x}
        y2={maxY}
        stroke="#B4B4BC"
        strokeWidth={0.5}
        opacity={0.2}
      />
    );
  }
  for (let i = 0; i <= gridCountY; i++) {
    const y = minY - 5 + ((maxY - (minY - 5)) / gridCountY) * i;
    gridLines.push(
      <line
        key={"hy" + i}
        x1={15 + xOffset}
        y1={y}
        x2={width - 8 + xOffset}
        y2={y}
        stroke="#B4B4BC"
        strokeWidth={0.5}
        opacity={0.2}
      />
    );
  }

  return (
    <div className="text-light-accent dark:text-dark-accent w-full">
      <svg
        width="100%"
        height="auto"
        viewBox={`0 0 ${width} ${height}`}
        className="block mx-auto max-w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Минимальная сетка */}
        {gridLines}

        {/* Ось X */}
        <line
          x1={15 + xOffset}
          y1={maxY}
          x2={width - 8 + xOffset}
          y2={maxY}
          className="stroke-current"
          strokeWidth={1}
          opacity={0.5}
        />

        {/* Ось Y */}
        <line
          x1={15 + xOffset}
          y1={maxY}
          x2={15 + xOffset}
          y2={minY - 5}
          className="stroke-current"
          strokeWidth={1}
          opacity={0.5}
        />

        {/* Линия графика */}
        <path
          ref={pathRef}
          d={d}
          fill="none"
          className="stroke-current"
          strokeWidth={2}
          strokeDasharray={
            pathRef.current ? pathRef.current.getTotalLength() : 0
          }
          strokeDashoffset={length}
          style={{ filter: "drop-shadow(0 1px 3px currentColor)" }}
        />

        {/* Стрелка на конце */}
        <polygon
          points={`${last.x},${last.y} ${arrowX1},${arrowY1} ${arrowX2},${arrowY2}`}
          className="fill-current"
          opacity={0.8}
        />

        {/* Точки графика (только ключевые) */}
        {[points[0], points[3], points[5], points[7]].map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={1.5}
            className="fill-current"
            opacity={0.7}
          />
        ))}
      </svg>
    </div>
  );
}
